import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { WithNext } from './withNext';
import { WithHandle } from './withHandle';

export interface Handler<ConcreteHandler, EntityToHandle>
  extends WithNext<ConcreteHandler>,
    WithHandle<EntityToHandle> {}

export interface SuccessRequestHandler extends Handler<SuccessRequestHandler, AxiosRequestConfig> {}
export interface SuccessResponseHandler extends Handler<SuccessResponseHandler, AxiosResponse> {}
export interface ResponseErrorHandler extends Handler<ResponseErrorHandler, AxiosError> {}
