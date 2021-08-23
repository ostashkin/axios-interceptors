import { AxiosRequestConfig } from 'axios';

abstract class AbstractCancelManager {
  public abstract cancelRequest(request: AxiosRequestConfig): void;
}

export { AbstractCancelManager };
