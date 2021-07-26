import { RequestImprovingResolver } from '../resolvers/RequestImprovingResolver';

export interface RequestInterceptorConfig {
  improve?: RequestImprovingResolver;
}
