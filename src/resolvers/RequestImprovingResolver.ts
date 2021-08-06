import { AxiosRequestConfig } from 'axios';
import { RequestImprovingHandler } from '../abstract';
import { MaybePromise } from '../types/utils';
import { RequestImprovingChain } from '../chain';

class RequestImprovingResolver {
  constructor(private readonly handler: RequestImprovingHandler) {}

  public resolve(request: AxiosRequestConfig): MaybePromise<AxiosRequestConfig> {
    return new RequestImprovingChain(this.handler).handle(request);
  }
}

export { RequestImprovingResolver };
