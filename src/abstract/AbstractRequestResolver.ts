import { AxiosRequestConfig } from 'axios';
import { MaybePromise } from '../types/utils';
import { RequestImprovingHandler } from './RequestImprovingHandler';

abstract class AbstractRequestResolver {
  protected abstract handler: RequestImprovingHandler;

  public abstract resolve(request: AxiosRequestConfig): MaybePromise<AxiosRequestConfig>;
}

export { AbstractRequestResolver };
