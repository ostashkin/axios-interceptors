import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { MaybePromise, Nullable } from '../../types/utils';
import { RequestSuccessCheckingResolver, RequestSuccessImprovingResolver } from '.';
import { isPromise } from '../../utils';
import { Interceptor } from '../../types/interceptor';

class RequestSuccessInterceptor {
  private improvingResolver: Nullable<RequestSuccessImprovingResolver> = null;

  private checkingResolver: Nullable<RequestSuccessCheckingResolver> = null;

  private interceptorID: Nullable<number> = null;

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

  private interceptRequest(request: AxiosRequestConfig): MaybePromise<AxiosRequestConfig> {
    if (this.checkingResolver !== null) {
      const canResolve = this.checkingResolver.resolve(request);
      if (isPromise(canResolve)) {
        return new Promise((resolve) => {
          canResolve.then((result) => {
            if (result) {
              if (this.improvingResolver !== null) {
                resolve(this.improvingResolver.resolve(request));
              } else {
                resolve(request);
              }
            }
            resolve(undefined as any);
          });
        });
      }
      if (canResolve) {
        if (this.improvingResolver !== null) return this.improvingResolver.resolve(request);
        return request;
      }
      const { CancelToken } = axios;
      const source = CancelToken.source();

      request.cancelToken = source.token;
      source.cancel('canceled by interceptor');
    }
    if (this.improvingResolver !== null) return this.improvingResolver.resolve(request);
    return request;
  }
}

export { RequestSuccessInterceptor };
