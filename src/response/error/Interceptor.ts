import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { MaybePromise, Nullable } from '../../types/utils';
import { injectInterceptorID, isPromise } from '../../utils';
import { ResponseErrorFilteringResolver } from '.';
import { AsyncActionResolver } from '../../asyncAction';
import { IsRequestRepeatRequired } from '../../types/client/responseError';
import { AxiosConfigWithInterceptorID } from '../../types/interceptor';

class ResponseErrorInterceptor {
  /**
   * Резолвер, фильтрующий входящие ошибки.
   * Если вернёт true - ошибка будет обрабатываться, если false - произойдёт выбрасывание исключения
   * @private
   */
  private filteringResolver: Nullable<ResponseErrorFilteringResolver> = null;

  /**
   * Резолвер, выполняющий последовательные асинхронные действия над ошибками
   * @private
   */
  private asyncActionResolver: Nullable<AsyncActionResolver> = null;

  /**
   * Инстанс axios, ошибки которого перехватываются
   * @private
   */
  private axiosInstance: Nullable<AxiosInstance> = null;

  /**
   * ID настроенного перехватчика
   * @private
   */
  private interceptorID: Nullable<number> = null;

  private repeats: Record<string, { originalError: AxiosError; count: number }> = {};

  private readonly isRepeatRequired: boolean | IsRequestRepeatRequired;

  public constructor(repeatRequest?: boolean | IsRequestRepeatRequired) {
    this.isRepeatRequired = repeatRequest || false;
  }

  public addFilteringResolver(resolver: ResponseErrorFilteringResolver) {
    this.filteringResolver = resolver;
  }

  public addAsyncActionResolver(resolver: AsyncActionResolver) {
    this.asyncActionResolver = resolver;
  }

  public setup(instance: AxiosInstance) {
    this.axiosInstance = instance;
    if (this.interceptorID !== null) {
      instance.interceptors.response.eject(this.interceptorID);
      this.interceptorID = null;
    }
    instance.interceptors.request.use(injectInterceptorID);
    this.interceptorID = instance.interceptors.response.use(
      (response) => response,
      this.interceptError.bind(this)
    );
    return {
      continueExecution: () => {
        if (this.asyncActionResolver !== null) this.asyncActionResolver.continueExecution();
      },
    };
  }

  private tryToRepeatRequest(error: AxiosError): Promise<AxiosResponse> {
    const config = error.config as AxiosConfigWithInterceptorID;
    if (this.repeats[config.interceptorID] === undefined) {
      this.repeats[config.interceptorID] = { originalError: error, count: 0 };
    }

    if (typeof this.isRepeatRequired === 'boolean') {
      if (this.isRepeatRequired) return this.axiosInstance!(error.config);
      return Promise.reject();
    }

    this.repeats[config.interceptorID].count += 1;
    if (
      this.isRepeatRequired(
        this.repeats[config.interceptorID].count,
        error,
        this.repeats[config.interceptorID].originalError
      )
    ) {
      return this.axiosInstance!(error.config);
    }

    delete this.repeats[config.interceptorID];
    return Promise.reject();
  }

  private interceptError(error: AxiosError): MaybePromise<AxiosResponse> {
    if (this.filteringResolver !== null) {
      const mayBePromiseCanIntercept = this.filteringResolver.resolve(error);
      if (isPromise(mayBePromiseCanIntercept)) {
        return new Promise((resolve, reject) => {
          mayBePromiseCanIntercept.then((canIntercept) => {
            if (canIntercept) {
              if (this.asyncActionResolver !== null) {
                this.asyncActionResolver.resolve().then(() => {
                  this.tryToRepeatRequest(error)
                    .then(resolve)
                    .catch(() => {
                      reject(error);
                    });
                });
              } else {
                reject(error);
              }
            } else {
              reject(error);
            }
          });
        });
      }
      if (mayBePromiseCanIntercept) {
        if (this.asyncActionResolver !== null) {
          return new Promise((resolve, reject) => {
            this.asyncActionResolver!.resolve().then(() => {
              this.tryToRepeatRequest(error)
                .then(resolve)
                .catch(() => {
                  reject(error);
                });
            });
          });
        }
        throw error;
      }
      throw error;
    }
    if (this.asyncActionResolver !== null) {
      return new Promise((resolve, reject) => {
        this.asyncActionResolver!.resolve().then(() => {
          this.tryToRepeatRequest(error)
            .then(resolve)
            .catch(() => {
              reject(error);
            });
        });
      });
    }
    throw error;
  }
}

export { ResponseErrorInterceptor };
