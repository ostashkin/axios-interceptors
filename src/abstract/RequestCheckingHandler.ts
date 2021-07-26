import { AxiosRequestConfig } from 'axios';
import { MaybePromise, Nullable } from '../types/utils';
import { RequestHandler } from '../types/handler';

abstract class RequestCheckingHandler implements RequestHandler {
  private nextHandler: Nullable<RequestHandler> = null;

  public abstract handle(entityToHandle: AxiosRequestConfig): MaybePromise<boolean>;

  public setNext(handler: RequestHandler): RequestHandler {
    this.nextHandler = handler;
    return this.nextHandler;
  }
}

export { RequestCheckingHandler };
