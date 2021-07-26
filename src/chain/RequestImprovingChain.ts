import { AxiosRequestConfig } from 'axios';
import { RequestImprovingHandler } from '../abstract';
import { MaybePromise, Nullable } from '../types/utils';
import { isPromise } from '../utils';

class RequestImprovingChain {
  private config: MaybePromise<Nullable<AxiosRequestConfig>> = null;

  public constructor(private handler: Nullable<RequestImprovingHandler>) {}

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

export { RequestImprovingChain };
