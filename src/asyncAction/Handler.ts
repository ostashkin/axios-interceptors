import { Nullable } from '../types/utils';
import { Waiter } from './Waiter';
import { IAsyncActionHandler } from '../types/asyncAction';

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
