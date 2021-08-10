import { AxiosRequestConfig } from 'axios';
import { RequestSuccessImprovingHandler } from './Handler';
import { MaybePromise, Nullable } from '../../../types/utils';
import { isPromise } from '../../../utils';

class RequestSuccessImprovingChain {
  private config: MaybePromise<Nullable<AxiosRequestConfig>> = null;

  public constructor(private handler: Nullable<RequestSuccessImprovingHandler>) {}

  public handle(config: AxiosRequestConfig): MaybePromise<AxiosRequestConfig> {
    this.config = config;
    if (this.handler === null) return config;
    const mayBePromise = this.handler.handle(config);
    this.handler = this.handler.getNextHandler();
    if (!isPromise(mayBePromise)) return this.handle(mayBePromise);
    return new Promise<AxiosRequestConfig>((resolve) => {
      mayBePromise.then((improvedConfig) => {
        resolve(this.handle(improvedConfig));
      });
    });
  }
}

export { RequestSuccessImprovingChain };
