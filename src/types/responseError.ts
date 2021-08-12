import { AxiosError, AxiosInstance } from 'axios';
import { MaybePromise } from './utils';
import { CreateAsyncActionBag } from './asyncAction';
import { ResponseErrorFilteringHandler } from '../response';
import { Interceptor } from './interceptor';

/**
 * Функция, фильтрующая поступающие ошибки
 */
export interface ResponseErrorFilterLogic {
  (error: AxiosError): MaybePromise<boolean>;
}

/**
 * Функция, доступная клиенту, создающая логику для фильтрации ошибок
 */
export interface CreateResponseErrorFilter {
  (check: ResponseErrorFilterLogic): CreateResponseErrorFilterBag;
}

/**
 * Результат выполнения функции, создающей логику. Содержит функцию для подстановки новой логики
 */
export interface CreateResponseErrorFilterBag {
  /**
   * Позволяет подставить новую логику
   */
  setNext: CreateResponseErrorFilter;

  /**
   * @private
   * Содержит логику, для получения класса хэндлера
   */
  getHandler(): ResponseErrorFilteringHandler;
}

/**
 * Служебная
 */
export interface CreateNextResponseErrorFilter {
  (
    currentHandler: ResponseErrorFilteringHandler,
    baseHandler: ResponseErrorFilteringHandler
  ): CreateResponseErrorFilterBag;
}

/**
 * Служебная
 */
export interface InterceptResponseErrorParams {
  filter?: CreateResponseErrorFilterBag;
  // TODO в эту функцию необходимо поместить объект интерцептора с методами управления им
  intercept?: CreateAsyncActionBag;
  repeatRequest?: IsRequestRepeatRequired | boolean;
}

export interface CreateResponseErrorInterceptor {
  (instance: AxiosInstance, params: InterceptResponseErrorParams): Interceptor;
}

export interface IsRequestRepeatRequired {
  (repeatCount: number, currentError: AxiosError, originalError: AxiosError): boolean;
}
