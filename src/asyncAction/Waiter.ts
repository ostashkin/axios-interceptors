import { Nullable } from '../types/utils';
import { AsyncActionLogic } from '../types/asyncAction';

class Waiter {
  public constructor(private readonly action: AsyncActionLogic) {}

  private resolve: Nullable<Function> = null;

  public tryToResolve() {
    if (this.resolve !== null) {
      this.resolve();
      this.resolve = null;
    }
  }

  public startAction(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.resolve = resolve;
      this.action({ resolveAction: this.tryToResolve.bind(this) });
    });
  }
}

export { Waiter };
