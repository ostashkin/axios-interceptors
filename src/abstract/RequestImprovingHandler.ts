import { AxiosRequestConfig } from 'axios';
import { MaybePromise, Nullable } from '../types/utils';
import { RequestHandler } from '../types/handler';

abstract class RequestImprovingHandler implements RequestHandler {
  private nextHandler: Nullable<RequestImprovingHandler> = null;

  public abstract handle(entityToHandle: AxiosRequestConfig): MaybePromise<AxiosRequestConfig>;

  public setNext(handler: RequestImprovingHandler): RequestImprovingHandler {
    this.nextHandler = handler;
    return this.nextHandler;
  }

  public getNextHandler(): Nullable<RequestImprovingHandler> {
    return this.nextHandler;
  }
}

export { RequestImprovingHandler };
