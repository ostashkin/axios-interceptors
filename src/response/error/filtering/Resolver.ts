import { AxiosError } from 'axios';
import { ResponseErrorFilteringHandler } from './Handler';
import { MaybePromise } from '../../../types/utils';
import { ResponseErrorFilteringChain } from './Chain';

class ResponseErrorFilteringResolver {
  constructor(private readonly handler: ResponseErrorFilteringHandler) {}

  public resolve(error: AxiosError): MaybePromise<boolean> {
    return new ResponseErrorFilteringChain(this.handler).handle(error);
  }
}

export { ResponseErrorFilteringResolver };
