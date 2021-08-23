import { AxiosRequestConfig } from 'axios';
import { AbstractIDManager } from './AbstractIDManager';
import { AxiosConfigWithInterceptorID } from '../types/interceptor';

/**
 * BaseIDCreator снабжает запрос ID с помощью Math.random
 */
class BaseIDManager extends AbstractIDManager {
  private static instance: BaseIDManager | null = null;

  private constructor() {
    super();
  }

  private static createID(): string {
    return Math.random().toString();
  }

  public static getCreator(): BaseIDManager {
    if (BaseIDManager.instance === null) BaseIDManager.instance = new BaseIDManager();
    return BaseIDManager.instance;
  }

  public injectID(request: AxiosRequestConfig): AxiosRequestConfig {
    if ((request as AxiosConfigWithInterceptorID).interceptorID === undefined) {
      (request as AxiosConfigWithInterceptorID).interceptorID = BaseIDManager.createID();
    }
    return request;
  }
}

export { BaseIDManager };
