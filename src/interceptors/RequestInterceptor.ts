import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { MaybePromise, Nullable } from '../types/utils';
import { RequestCheckingResolver, RequestImprovingResolver } from '../resolvers';
import { isPromise } from '../utils';

class RequestInterceptor {
  private improvingResolver: Nullable<RequestImprovingResolver> = null;

  private checkingResolver: Nullable<RequestCheckingResolver> = null;

  private interceptorID: Nullable<number> = null;

  public addImprovingResolver(resolver: RequestImprovingResolver) {
    this.improvingResolver = resolver;
  }

  public addCheckingResolver(resolver: RequestCheckingResolver) {
    this.checkingResolver = resolver;
  }

  public setup(instance: AxiosInstance): void {
    if (this.interceptorID !== null) {
      instance.interceptors.request.eject(this.interceptorID);
      this.interceptorID = null;
    }
    this.interceptorID = instance.interceptors.request.use(this.interceptRequest.bind(this));
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
      return undefined as any;
    }
    if (this.improvingResolver !== null) return this.improvingResolver.resolve(request);
    return request;
  }
}

export { RequestInterceptor };
