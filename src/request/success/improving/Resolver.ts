import { AxiosRequestConfig } from 'axios';
import { RequestSuccessImprovingHandler } from './Handler';
import { MaybePromise } from '../../../types/utils';
import { RequestSuccessImprovingChain } from './Chain';
import { isPromise } from '../../../utils';

class RequestSuccessImprovingResolver {
  private chain: RequestSuccessImprovingChain;

  constructor(private readonly handler: RequestSuccessImprovingHandler) {
    this.chain = new RequestSuccessImprovingChain(this.handler);
  }

  public resolve(request: AxiosRequestConfig): MaybePromise<AxiosRequestConfig> {
    const maybePromise = this.chain.handle(request);
    if (isPromise(maybePromise)) {
      return new Promise<AxiosRequestConfig>((resolve) => {
        maybePromise.then((chainResult) => {
          this.chain = new RequestSuccessImprovingChain(this.handler);
          resolve(chainResult);
        });
      });
    }
    this.chain = new RequestSuccessImprovingChain(this.handler);
    return maybePromise;
  }
}

export { RequestSuccessImprovingResolver };
