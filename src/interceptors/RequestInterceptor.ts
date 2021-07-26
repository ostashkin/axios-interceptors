import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { MaybePromise, Nullable } from '../types/utils';
import { RequestImprovingResolver } from '../resolvers/RequestImprovingResolver';

class RequestInterceptor {
  private improvingResolver: Nullable<RequestImprovingResolver> = null;

  public addImprovingResolver(resolver: RequestImprovingResolver) {
    this.improvingResolver = resolver;
  }

  public setup(instance: AxiosInstance): void {
    instance.interceptors.request.use(this.interceptRequest.bind(this));
  }

  private interceptRequest(request: AxiosRequestConfig): MaybePromise<AxiosRequestConfig> {
    if (this.improvingResolver !== null) return this.improvingResolver.resolve(request);
    return undefined as any;
  }
}

export { RequestInterceptor };
