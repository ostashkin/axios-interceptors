import { AxiosRequestConfig } from 'axios';
import { MaybePromise, Nullable } from '../../../types/utils';
import { SuccessRequestHandler } from '../../../types/handler';

class RequestSuccessImprovingHandler implements SuccessRequestHandler {
  private nextHandler: Nullable<RequestSuccessImprovingHandler> = null;

  public constructor(
    public readonly handle: (entityToHandle: AxiosRequestConfig) => MaybePromise<AxiosRequestConfig>
  ) {}

  public setNext(handler: RequestSuccessImprovingHandler): RequestSuccessImprovingHandler {
    this.nextHandler = handler;
    return this.nextHandler;
  }

  public getNextHandler(): Nullable<RequestSuccessImprovingHandler> {
    return this.nextHandler;
  }
}

export { RequestSuccessImprovingHandler };
