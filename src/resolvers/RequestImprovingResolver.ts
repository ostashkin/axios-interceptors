import { AxiosRequestConfig } from 'axios';
import { RequestImprovingHandler, AbstractRequestResolver } from '../abstract';
import { MaybePromise } from '../types/utils';
import { RequestImprovingChain } from '../chain';

class RequestImprovingResolver extends AbstractRequestResolver {
  constructor(protected readonly handler: RequestImprovingHandler) {
    super();
  }

  public resolve(request: AxiosRequestConfig): MaybePromise<AxiosRequestConfig> {
    return new RequestImprovingChain(this.handler).handle(request);
  }
}

export { RequestImprovingResolver };
