import { AxiosRequestConfig } from 'axios';
import { RequestSuccessCheckingHandler } from './Handler';
import { MaybePromise, Nullable } from '../../../types/utils';
import { isPromise } from '../../../utils';
import { CheckError } from './CheckError';

class RequestSuccessCheckingChain {
  private isValidated: boolean = true;

  private isHandlingStarted: boolean = false;

  public constructor(private handler: Nullable<RequestSuccessCheckingHandler>) {}

  private setNextHandler(): void {
    if (this.handler !== null) this.handler = this.handler.getNextHandler();
  }

  public resolveCurrentHandler() {
    if (this.handler !== null) this.handler.tryToConfirmFix();
  }

  public handle(config: AxiosRequestConfig): MaybePromise<boolean> {
    if (!this.isValidated) throw new CheckError(this.handler);
    if (this.isHandlingStarted && this.handler !== null) this.setNextHandler();
    if (this.handler === null) return this.isValidated;

    this.isHandlingStarted = true;
    const mayBePromise = this.handler.handle(config);
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
