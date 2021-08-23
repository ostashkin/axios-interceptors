import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { MaybePromise, Nullable } from '../../types/utils';
import { RequestSuccessCheckingResolver, RequestSuccessImprovingResolver } from '.';
import { isPromise } from '../../utils';
import { Interceptor } from '../../types/interceptor';
import { AbstractIDInjector } from '../../IDInjector';

class RequestSuccessInterceptor {
  private improvingResolver: Nullable<RequestSuccessImprovingResolver> = null;

  private checkingResolver: Nullable<RequestSuccessCheckingResolver> = null;

  private interceptorID: Nullable<number> = null;

  /**
   * @param IDInjector Класс, предоставляющий для запроса уникальный ID
   */
  public constructor(private readonly IDInjector: AbstractIDInjector) {}

  public addImprovingResolver(resolver: RequestSuccessImprovingResolver) {
    this.improvingResolver = resolver;
  }

  public addCheckingResolver(resolver: RequestSuccessCheckingResolver) {
    this.checkingResolver = resolver;
  }

  public setup(instance: AxiosInstance): Interceptor {
    if (this.interceptorID !== null) {
      instance.interceptors.request.eject(this.interceptorID);
      this.interceptorID = null;
    }
    this.interceptorID = instance.interceptors.request.use(this.interceptRequest.bind(this));
    return {
      continueExecution: () => {
        if (this.checkingResolver !== null) this.checkingResolver.continueExecution();
      },
    };
  }

  /**
   * Поптыка заимпровить запрос
   * @param request
   * @private
   */
  private tryToReturnImprovedRequest(request: AxiosRequestConfig): AxiosRequestConfig {
    if (this.improvingResolver === null) return request;
    return this.improvingResolver.resolve(request) as AxiosRequestConfig;
  }

  private tryToResolveImprovedRequest(
    canResolve: Promise<boolean>,
    request: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    return new Promise((resolve) => {
      canResolve.then((result) => {
        if (result) {
          resolve(this.tryToReturnImprovedRequest(request));
        } else {
          const { CancelToken } = axios;
          const source = CancelToken.source();

          request.cancelToken = source.token;
          source.cancel('canceled by interceptor');
        }
      });
    });
  }

  private interceptRequest(request: AxiosRequestConfig): MaybePromise<AxiosRequestConfig> {
    this.IDInjector.injectID(request);
    if (this.checkingResolver !== null) {
      const canResolve = this.checkingResolver.resolve(request);
      if (isPromise(canResolve)) return this.tryToResolveImprovedRequest(canResolve, request);
      if (canResolve) return this.tryToReturnImprovedRequest(request);
      const { CancelToken } = axios;
      const source = CancelToken.source();

      request.cancelToken = source.token;
      source.cancel('canceled by interceptor');
    }
    return this.tryToReturnImprovedRequest(request);
  }
}

export { RequestSuccessInterceptor };
