import { AxiosRequestConfig } from 'axios';
import { MaybePromise } from '../types/utils';

abstract class AbstractResolver<RequestData = any> {
  public abstract resolve(request: AxiosRequestConfig): MaybePromise<RequestData>;
}

export { AbstractResolver };
