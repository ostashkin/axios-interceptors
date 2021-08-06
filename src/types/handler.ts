import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { MaybePromise } from './utils';

export interface WithNextHandler<Handler> {
  setNext(handler: Handler): Handler;
}

export interface WithHandle<EntityToHandle> {
  handle(entityToHandle: EntityToHandle): MaybePromise;
}

export interface RequestHandler
  extends WithNextHandler<RequestHandler>,
    WithHandle<AxiosRequestConfig> {}

export interface ResponseHandler
  extends WithNextHandler<ResponseHandler>,
    WithHandle<AxiosResponse> {}

export interface ErrorHandler extends WithNextHandler<ErrorHandler>, WithHandle<AxiosError> {}
