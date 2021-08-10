import { AxiosRequestConfig } from 'axios';
import { MaybePromise, Nullable } from '../../../types/utils';
import { RequestHandler } from '../../../types/handler';

class RequestSuccessCheckingHandler implements RequestHandler {
  private nextHandler: Nullable<RequestSuccessCheckingHandler> = null;

  public constructor(
    public readonly handle: (entityToHandle: AxiosRequestConfig) => MaybePromise<boolean>
  ) {}

  public setNext(handler: RequestSuccessCheckingHandler): RequestSuccessCheckingHandler {
    this.nextHandler = handler;
    return this.nextHandler;
  }

  public getNextHandler(): Nullable<RequestSuccessCheckingHandler> {
    return this.nextHandler;
  }
}

export { RequestSuccessCheckingHandler };
