import { Nullable } from '../types/utils';
import { AsyncActionHandler } from './Handler';

class AsyncActionChain {
  public constructor(private handler: Nullable<AsyncActionHandler>) {}

  public resolveCurrentHandler() {
    if (this.handler !== null) {
      this.handler.waiter.tryToResolve();
    }
  }

  public handle(): Promise<void> {
    return new Promise((resolve) => {
      if (this.handler === null) {
        resolve();
      } else {
        this.handler.waiter.startAction().then(() => {
          this.handler = this.handler!.getNextHandler();
          resolve(this.handle());
        });
      }
    });
  }
}

export { AsyncActionChain };
