import axios, { AxiosRequestConfig } from 'axios';
import { AbstractCancelManager } from './AbstractCancelManager';

class BaseCancelManager extends AbstractCancelManager {
  private static instance: BaseCancelManager | null = null;

  private constructor() {
    super();
  }

  public static getManager(): BaseCancelManager {
    if (BaseCancelManager.instance === null) BaseCancelManager.instance = new BaseCancelManager();
    return BaseCancelManager.instance;
  }

  public cancelRequest(request: AxiosRequestConfig): void {
    const { CancelToken } = axios;
    const source = CancelToken.source();

    request.cancelToken = source.token;
    source.cancel('canceled by interceptor');
  }
}

export { BaseCancelManager };
