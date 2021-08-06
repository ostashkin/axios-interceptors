import { AxiosRequestConfig } from 'axios';
import { RequestCheckingHandler } from '../abstract';
import { MaybePromise } from '../types/utils';
import { RequestCheckingChain } from '../chain';

class RequestCheckingResolver {
  constructor(private readonly handler: RequestCheckingHandler) {}

  public resolve(request: AxiosRequestConfig): MaybePromise<boolean> {
    return new RequestCheckingChain(this.handler).handle(request);
  }
}

export { RequestCheckingResolver };
