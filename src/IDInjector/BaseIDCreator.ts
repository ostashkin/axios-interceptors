import { AxiosRequestConfig } from 'axios';
import { AbstractIDInjector } from './AbstractIDInjector';
import { AxiosConfigWithInterceptorID } from '../types/interceptor';

/**
 * BaseIDCreator снабжает запрос ID с помощью Math.random
 */
class BaseIDCreator extends AbstractIDInjector {
  private static instance: BaseIDCreator | null = null;

  private constructor() {
    super();
  }

  private static createID(): string {
    return Math.random().toString();
  }

  public static getCreator(): BaseIDCreator {
    if (BaseIDCreator.instance === null) BaseIDCreator.instance = new BaseIDCreator();
    return BaseIDCreator.instance;
  }

  public injectID(request: AxiosRequestConfig): AxiosRequestConfig {
    if ((request as AxiosConfigWithInterceptorID).interceptorID === undefined) {
      (request as AxiosConfigWithInterceptorID).interceptorID = BaseIDCreator.createID();
    }
    return request;
  }
}

export { BaseIDCreator };
