import { AxiosRequestConfig } from 'axios';
import { MaybePromise } from './utils';
import { RequestCheckingHandler, RequestImprovingHandler } from '../abstract';

export interface ImproverLogic {
  (config: AxiosRequestConfig): MaybePromise<AxiosRequestConfig>;
}

export interface RequestCheckerLogic {
  (config: AxiosRequestConfig): MaybePromise<boolean>;
}

export interface CreateImproverBag {
  setNext: CreateImprover;
  getHandler(): RequestImprovingHandler;
}

export interface CreateRequestCheckerBag {
  setNext: CreateRequestChecker;
  getHandler(): RequestCheckingHandler;
}

export interface CreateImprover {
  (improve: ImproverLogic): CreateImproverBag;
}

export interface CreateRequestChecker {
  (check: RequestCheckerLogic): CreateRequestCheckerBag;
}

export interface CreateImprovingHandler {
  (improve: ImproverLogic): RequestImprovingHandler;
}

export interface CreateRequestCheckingHandler {
  (check: RequestCheckerLogic): RequestCheckingHandler;
}

export interface CreateNextImprover {
  (
    currentHandler: RequestImprovingHandler,
    baseHandler: RequestImprovingHandler
  ): CreateImproverBag;
}

export interface CreateNextRequestChecker {
  (
    currentHandler: RequestCheckingHandler,
    baseHandler: RequestCheckingHandler
  ): CreateRequestCheckerBag;
}

export type RequestInterceptorActions = 'check' | 'improve';

export interface CreateRequestInterceptorBag<
  IsCheckRemoved extends boolean,
  IsImproveRemoved extends boolean
> {
  check: (checker: CreateRequestCheckerBag) => CreateRequestInterceptorBag<true, IsImproveRemoved>;
  improve: (improver: CreateImproverBag) => CreateRequestInterceptorBag<IsCheckRemoved, true>;
}

export type CreateRequestInterceptorBagBooleanValues = Record<RequestInterceptorActions, boolean>;

export interface TestBag<InitialExcluded extends RequestInterceptorActions | ''> {
  check: (checker: CreateRequestCheckerBag) => ExcludedTestBag<InitialExcluded, 'check'>;
  improve: (improver: CreateImproverBag) => ExcludedTestBag<InitialExcluded, 'improve'>;
}

export type ExcludedTestBag<
  InitialExcluded extends RequestInterceptorActions | '',
  ExcludedActions extends RequestInterceptorActions | ''
> = Omit<TestBag<InitialExcluded>, ExcludedActions>;
