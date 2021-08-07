import { AxiosError, AxiosInstance } from 'axios';
import { MaybePromise } from './utils';
import { ResponseErrorFilteringHandler } from '../abstract';

/**
 * Функция, фильтрующая поступающие ошибки
 */
export interface ResponseErrorFilterLogic {
  (error: AxiosError): MaybePromise<boolean>;
}

export interface CreateResponseErrorFilter {
  (check: ResponseErrorFilterLogic): CreateResponseErrorFilterBag;
}

export interface CreateResponseErrorFilterBag {
  setNext: CreateResponseErrorFilter;

  getHandler(): ResponseErrorFilteringHandler;
}

export interface CreateResponseErrorFilteringHandler {
  (filterLogic: ResponseErrorFilterLogic): ResponseErrorFilteringHandler;
}

export interface CreateNextResponseErrorFilter {
  (
    currentHandler: ResponseErrorFilteringHandler,
    baseHandler: ResponseErrorFilteringHandler
  ): CreateResponseErrorFilterBag;
}

export interface InterceptResponseErrorParams {
  filter?: CreateResponseErrorFilterBag;
  // TODO в эту функцию необходимо поместить объект интерцептора с методами управления им
  onIntercept?: Function;
  repeatRequest?: boolean;
}

export interface CreateResponseErrorInterceptor {
  (instance: AxiosInstance, params: InterceptResponseErrorParams): any;
}
