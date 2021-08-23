import { AxiosRequestConfig } from 'axios';

/**
 *  IDCreator должен снабдить запрос уникальным ID, который в дальнейшем будет
 *  использоваться для отслеживания
 */
abstract class AbstractIDManager {
  public abstract injectID(request: AxiosRequestConfig): AxiosRequestConfig;
}

export { AbstractIDManager };
