import { Nullable } from '../../../types/utils';
import { RequestSuccessCheckingHandler } from './Handler';

class CheckError {
  public constructor(private readonly handler: Nullable<RequestSuccessCheckingHandler>) {}

  public tryToFix(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.handler === null) {
        reject();
      } else {
        resolve(this.handler.fix());
      }
    });
  }

  public confirmFix(): void {
    if (this.handler !== null) {
      this.handler.tryToConfirmFix();
    }
  }
}

export { CheckError };
