import { AxiosRequestConfig } from 'axios';

/**
 *  IDCreator должен снабдить запрос уникальным ID, который в дальнейшем будет
 *  использоваться для отслеживания
 */
abstract class AbstractIDInjector {
  public abstract injectID(request: AxiosRequestConfig): AxiosRequestConfig;
}

export { AbstractIDInjector };
