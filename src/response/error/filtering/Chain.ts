import { AxiosError } from 'axios';
import { MaybePromise, Nullable } from '../../../types/utils';
import { isPromise } from '../../../utils';
import { ResponseErrorFilteringHandler } from './Handler';

class ResponseErrorFilteringChain {
  private isValidated: boolean = true;

  public constructor(private handler: Nullable<ResponseErrorFilteringHandler>) {}

  public handle(error: AxiosError): MaybePromise<boolean> {
    if (!this.isValidated || this.handler === null) return this.isValidated;
    const mayBePromise = this.handler.handle(error);
    this.handler = this.handler.getNextHandler();
    if (!isPromise(mayBePromise)) {
      this.isValidated = mayBePromise;
      return this.handle(error);
    }
    return new Promise<boolean>((resolve) => {
      mayBePromise.then((result) => {
        this.isValidated = result;
        resolve(this.handle(error));
      });
    });
  }
}

export { ResponseErrorFilteringChain };
