import { AxiosRequestConfig } from 'axios';
import { RequestCheckingHandler } from '../abstract';
import { MaybePromise, Nullable } from '../types/utils';
import { isPromise } from '../utils';

class RequestCheckingChain {
  private isValidated: boolean = true;

  public constructor(private handler: Nullable<RequestCheckingHandler>) {}

  public handle(config: AxiosRequestConfig): MaybePromise<boolean> {
    if (!this.isValidated || this.handler === null) return this.isValidated;
    const mayBePromise = this.handler.handle(config);
    this.handler = this.handler.getNextHandler();
    if (!isPromise(mayBePromise)) {
      this.isValidated = mayBePromise;
      return this.handle(config);
    }
    return new Promise<boolean>((resolve) => {
      mayBePromise.then((result) => {
        this.isValidated = result;
        resolve(this.handle(config));
      });
    });
  }
}

export { RequestCheckingChain };
