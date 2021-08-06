import { AxiosRequestConfig } from 'axios';
import { MaybePromise } from './utils';
import { RequestCheckingHandler, RequestImprovingHandler } from '../abstract';

export interface ImproverLogic {
  (config: AxiosRequestConfig): MaybePromise<AxiosRequestConfig>;
}

export interface CheckerLogic {
  (config: AxiosRequestConfig): MaybePromise<boolean>;
}

export interface CreateImproverBag {
  setNext: CreateImprover;
  getHandler(): RequestImprovingHandler;
}

export interface CreateCheckerBag {
  setNext: CreateChecker;
  getHandler(): RequestCheckingHandler;
}

export interface CreateImprover {
  (improve: ImproverLogic): CreateImproverBag;
}

export interface CreateChecker {
  (check: CheckerLogic): CreateCheckerBag;
}

export interface CreateImprovingHandler {
  (improve: ImproverLogic): RequestImprovingHandler;
}

export interface CreateCheckingHandler {
  (check: CheckerLogic): RequestCheckingHandler;
}

export interface CreateNextImprover {
  (
    currentHandler: RequestImprovingHandler,
    baseHandler: RequestImprovingHandler
  ): CreateImproverBag;
}

export interface CreateNextChecker {
  (currentHandler: RequestCheckingHandler, baseHandler: RequestCheckingHandler): CreateCheckerBag;
}

export type RequestInterceptorActions = 'check' | 'improve';

export interface CreateRequestInterceptorBag<
  IsCheckRemoved extends boolean,
  IsImproveRemoved extends boolean
> {
  check: (checker: CreateCheckerBag) => CreateRequestInterceptorBag<true, IsImproveRemoved>;
  improve: (improver: CreateImproverBag) => CreateRequestInterceptorBag<IsCheckRemoved, true>;
}

export type CreateRequestInterceptorBagBooleanValues = Record<RequestInterceptorActions, boolean>;

export interface TestBag<InitialExcluded extends RequestInterceptorActions | ''> {
  check: (checker: CreateCheckerBag) => ExcludedTestBag<InitialExcluded, 'check'>;
  improve: (improver: CreateImproverBag) => ExcludedTestBag<InitialExcluded, 'improve'>;
}

export type ExcludedTestBag<
  InitialExcluded extends RequestInterceptorActions | '',
  ExcludedActions extends RequestInterceptorActions | ''
> = Omit<TestBag<InitialExcluded>, ExcludedActions>;
