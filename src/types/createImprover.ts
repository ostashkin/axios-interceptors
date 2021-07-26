import { AxiosRequestConfig } from 'axios';
import { MaybePromise } from './utils';
import { RequestImprovingHandler } from '../abstract';

export interface ImproverLogic {
  (config: AxiosRequestConfig): MaybePromise<AxiosRequestConfig>;
}

export interface CreateImproverBag {
  setNext: CreateImprover;
  getHandler(): RequestImprovingHandler;
}

export interface CreateImprover {
  (improve: ImproverLogic): CreateImproverBag;
}

export interface CreateImprovingHandler {
  (improve: ImproverLogic): RequestImprovingHandler;
}

export interface CreateNextImprover {
  (
    currentHandler: RequestImprovingHandler,
    baseImprover: RequestImprovingHandler
  ): CreateImproverBag;
}
