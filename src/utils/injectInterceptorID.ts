import { AxiosRequestConfig } from 'axios';
import { AxiosConfigWithInterceptorID } from '../types/interceptor';

const injectInterceptorID = (request: AxiosRequestConfig): AxiosRequestConfig => {
  if ((request as AxiosConfigWithInterceptorID).interceptorID === undefined) {
    (request as AxiosConfigWithInterceptorID).interceptorID = Math.random().toString();
  }
  return request;
};

export { injectInterceptorID };
