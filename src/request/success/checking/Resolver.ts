import { AxiosRequestConfig } from 'axios';
import { RequestSuccessCheckingHandler } from './Handler';
import { MaybePromise, Nullable } from '../../../types/utils';
import { RequestSuccessCheckingChain } from './Chain';
import { CheckError } from './CheckError';

class RequestSuccessCheckingResolver {
  constructor(private readonly handler: RequestSuccessCheckingHandler) {}

  private canResolve: boolean = true;

  private queue: Function[] = [];

  private currentError: Nullable<CheckError> = null;

  public continueExecution(): void {
    if (this.currentError !== null) this.currentError.confirmFix();
  }

  public resolve(request: AxiosRequestConfig): MaybePromise<boolean> {
    try {
      if (!this.canResolve) return this.storeRequest(request);
      return new RequestSuccessCheckingChain(this.handler).handle(request);
    } catch (error) {
      if (error instanceof CheckError) {
        this.currentError = error;
        this.canResolve = false;
        error.tryToFix().then(() => {
          this.currentError = null;
          this.resolveStoredRequests();
        });
        return this.storeRequest(request);
      }
      throw error;
    }
  }

  private storeRequest(request: AxiosRequestConfig): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const onFix = () => resolve(this.resolve(request));
      this.queue.push(onFix);
    });
  }

  private resolveStoredRequests(): void {
    this.canResolve = true;
    this.queue.forEach((delayedRequest) => {
      delayedRequest();
    });
    this.queue.length = 0;
  }
}

export { RequestSuccessCheckingResolver };
