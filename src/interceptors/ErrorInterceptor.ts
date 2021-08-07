import { AxiosError, AxiosInstance } from 'axios';
import { MaybePromise, Nullable } from '../types/utils';
import { ErrorFilteringResolver } from '../resolvers';
import { isPromise } from '../utils';

class ErrorInterceptor {
  private filteringResolver: Nullable<ErrorFilteringResolver> = null;

  private interceptorID: Nullable<number> = null;

  public addFilteringResolver(resolver: ErrorFilteringResolver) {
    this.filteringResolver = resolver;
  }

  public setup(instance: AxiosInstance): void {
    if (this.interceptorID !== null) {
      instance.interceptors.request.eject(this.interceptorID);
      this.interceptorID = null;
    }
    this.interceptorID = instance.interceptors.response.use(
      (response) => response,
      this.interceptError.bind(this)
    );
  }

  private interceptError(error: AxiosError): MaybePromise<AxiosError> {
    if (this.filteringResolver !== null) {
      const canResolve = this.filteringResolver.resolve(error);
      if (isPromise(canResolve)) {
        return new Promise((resolve) => {
          canResolve.then((result) => {
            const resolveBody = result ? error : (undefined as any);
            resolve(resolveBody);
          });
        });
      }
      if (canResolve) return error;
      return undefined as any;
    }
    return error;
  }
}

export { ErrorInterceptor };
