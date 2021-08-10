import { RequestSuccessImprovingResolver } from '../request';

export interface RequestInterceptorConfig {
  improve?: RequestSuccessImprovingResolver;
}
