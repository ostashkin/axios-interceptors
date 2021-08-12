import { Nullable } from '../types/utils';
import { IAsyncActionHandler } from '../types/handler';
import { Waiter } from './Waiter';

class AsyncActionHandler implements IAsyncActionHandler {
  private nextHandler: Nullable<AsyncActionHandler> = null;

  public constructor(public readonly waiter: Waiter) {}

  public setNext(handler: AsyncActionHandler): AsyncActionHandler {
    this.nextHandler = handler;
    return this.nextHandler;
  }

  public getNextHandler(): Nullable<AsyncActionHandler> {
    return this.nextHandler;
  }
}

export { AsyncActionHandler };
