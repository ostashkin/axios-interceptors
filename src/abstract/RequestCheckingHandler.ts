import { AxiosRequestConfig } from 'axios';
import { MaybePromise, Nullable } from '../types/utils';
import { RequestHandler } from '../types/handler';

abstract class RequestCheckingHandler implements RequestHandler {
  private nextHandler: Nullable<RequestCheckingHandler> = null;

  public abstract handle(entityToHandle: AxiosRequestConfig): MaybePromise<boolean>;

  public setNext(handler: RequestCheckingHandler): RequestCheckingHandler {
    this.nextHandler = handler;
    return this.nextHandler;
  }

  public getNextHandler(): Nullable<RequestCheckingHandler> {
    return this.nextHandler;
  }
}

export { RequestCheckingHandler };
