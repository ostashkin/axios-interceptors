import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { MaybePromise, Nullable } from '../../types/utils';
import { isPromise } from '../../utils';
import { ResponseErrorFilteringResolver } from '.';
import { AsyncActionResolver } from '../../asyncAction';

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

  private repeatRequest(error: AxiosError): Promise<AxiosResponse> {
    return this.axiosInstance!(error.config);
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
                  this.repeatRequest(error).then(resolve);
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
          return new Promise((resolve) => {
            this.asyncActionResolver!.resolve().then(() => {
              this.repeatRequest(error).then(resolve);
            });
          });
        }
        return undefined as any;
      }
      throw error;
    }
    if (this.asyncActionResolver !== null) {
      return new Promise((resolve) => {
        this.asyncActionResolver!.resolve().then(() => {
          this.repeatRequest(error).then(resolve);
        });
      });
    }
    return undefined as any;
  }
}

export { ResponseErrorInterceptor };
