import { AxiosRequestConfig } from 'axios';
import { MaybePromise, Nullable } from '../../../types/utils';
import { SuccessRequestHandler } from '../../../types/handler';
import { Waiter } from '../../../asyncAction';
import { RequestCheckerLogic } from '../../../types/client/successRequest';

class RequestSuccessCheckingHandler implements SuccessRequestHandler {
  private nextHandler: Nullable<RequestSuccessCheckingHandler> = null;

  private readonly fixWaiter: Nullable<Waiter>;

  public readonly handle: RequestCheckerLogic;

  public constructor(handle: (entityToHandle: AxiosRequestConfig) => MaybePromise<boolean>);

  public constructor(
    handle: (entityToHandle: AxiosRequestConfig) => MaybePromise<boolean>,
    fixWaiter: Waiter
  );

  public constructor(
    handle: (entityToHandle: AxiosRequestConfig) => MaybePromise<boolean>,
    fixWaiter?: Waiter
  ) {
    this.handle = handle;
    this.fixWaiter = fixWaiter !== undefined ? fixWaiter : null;
  }

  public setNext(handler: RequestSuccessCheckingHandler): RequestSuccessCheckingHandler {
    this.nextHandler = handler;
    return this.nextHandler;
  }

  public getNextHandler(): Nullable<RequestSuccessCheckingHandler> {
    return this.nextHandler;
  }

  public fix(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.fixWaiter === null) {
        reject();
      } else {
        resolve(this.fixWaiter.startAction());
      }
    });
  }

  public tryToConfirmFix(): void {
    if (this.fixWaiter !== null) this.fixWaiter.tryToResolve();
  }
}

export { RequestSuccessCheckingHandler };
