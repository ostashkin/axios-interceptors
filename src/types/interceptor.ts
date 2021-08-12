import { AxiosRequestConfig } from 'axios';

export interface Interceptor {
  continueExecution(): void;
}

export interface AxiosConfigWithInterceptorID extends AxiosRequestConfig {
  /**
   * @private
   */
  interceptorID: string;
}
