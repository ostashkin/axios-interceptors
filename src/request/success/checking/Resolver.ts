import { AxiosRequestConfig } from 'axios';
import { RequestSuccessCheckingHandler } from './Handler';
import { MaybePromise } from '../../../types/utils';
import { RequestSuccessCheckingChain } from './Chain';

class RequestSuccessCheckingResolver {
  constructor(private readonly handler: RequestSuccessCheckingHandler) {}

  public resolve(request: AxiosRequestConfig): MaybePromise<boolean> {
    try {
      return new RequestSuccessCheckingChain(this.handler).handle(request);
    } catch {
      return false;
    }
  }
}

export { RequestSuccessCheckingResolver };
