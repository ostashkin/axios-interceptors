import { AxiosError } from 'axios';
import { ResponseErrorFilteringHandler } from '../abstract';
import { MaybePromise } from '../types/utils';
import { ErrorCheckingChain } from '../chain';

class ErrorFilteringResolver {
  constructor(private readonly handler: ResponseErrorFilteringHandler) {}

  public resolve(error: AxiosError): MaybePromise<boolean> {
    return new ErrorCheckingChain(this.handler).handle(error);
  }
}

export { ErrorFilteringResolver };
