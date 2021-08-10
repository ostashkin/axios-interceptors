import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RequestSuccessCheckingHandler, RequestSuccessImprovingHandler } from '../request';
import { CreateNextLogic, CreationBag, HandlerLogic } from './utils';

export type RequestImproverLogic = HandlerLogic<AxiosRequestConfig, AxiosRequestConfig>;
export type RequestCheckerLogic = HandlerLogic<AxiosRequestConfig, boolean>;

export type CreateSuccessRequestImproverBag = CreationBag<
  CreateSuccessRequestImprover,
  RequestSuccessImprovingHandler
>;
export type CreateSuccessRequestCheckerBag = CreationBag<
  CreateSuccessRequestChecker,
  RequestSuccessCheckingHandler
>;

export type CreateNextSuccessRequestImprover = CreateNextLogic<
  RequestSuccessImprovingHandler,
  CreateSuccessRequestImproverBag
>;
export type CreateNextSuccessRequestChecker = CreateNextLogic<
  RequestSuccessCheckingHandler,
  CreateSuccessRequestCheckerBag
>;

export interface CreateSuccessRequestImprover {
  (improve: RequestImproverLogic): CreateSuccessRequestImproverBag;
}

export interface CreateSuccessRequestChecker {
  (check: RequestCheckerLogic): CreateSuccessRequestCheckerBag;
}

/**
 * Служебная
 */
export interface InterceptSuccessRequestParams {
  check?: CreateSuccessRequestCheckerBag;
  improve?: CreateSuccessRequestImproverBag;
}

export interface CreateSuccessRequestInterceptor {
  (instance: AxiosInstance, params: InterceptSuccessRequestParams): any;
}
