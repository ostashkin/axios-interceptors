import { AxiosError } from 'axios';
import { MaybePromise, Nullable } from '../../../types/utils';
import { ResponseErrorHandler } from '../../../types/handler';

class ResponseErrorFilteringHandler implements ResponseErrorHandler {
  private nextHandler: Nullable<ResponseErrorFilteringHandler> = null;

  public constructor(
    public readonly handle: (entityToHandle: AxiosError) => MaybePromise<boolean>
  ) {}

  public setNext(handler: ResponseErrorFilteringHandler): ResponseErrorFilteringHandler {
    this.nextHandler = handler;
    return this.nextHandler;
  }

  public getNextHandler(): Nullable<ResponseErrorFilteringHandler> {
    return this.nextHandler;
  }
}

export { ResponseErrorFilteringHandler };
