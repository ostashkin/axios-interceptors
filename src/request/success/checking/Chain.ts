import { AxiosRequestConfig } from 'axios';
import { RequestSuccessCheckingHandler } from './Handler';
import { MaybePromise, Nullable } from '../../../types/utils';
import { isPromise } from '../../../utils';

class RequestSuccessCheckingChain {
  private isValidated: boolean = true;

  public constructor(private handler: Nullable<RequestSuccessCheckingHandler>) {}

  public handle(config: AxiosRequestConfig): MaybePromise<boolean> {
    if (!this.isValidated) {
      // return false;
      throw new Error('asd');
    }
    if (this.handler === null) {
      return this.isValidated;
    }
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

export { RequestSuccessCheckingChain };
