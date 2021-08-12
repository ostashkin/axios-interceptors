import { AsyncActionHandler } from './Handler';
import { AsyncActionChain } from './Chain';

class AsyncActionResolver {
  private chain: AsyncActionChain;

  constructor(private readonly handler: AsyncActionHandler) {
    this.chain = new AsyncActionChain(this.handler);
  }

  public continueExecution() {
    this.chain.resolveCurrentHandler();
  }

  public resolve(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.chain.handle().then(() => {
        this.chain = new AsyncActionChain(this.handler);
        resolve();
      });
    });
  }
}

export { AsyncActionResolver };
