import { MaybePromise } from '../utils';
import { AsyncActionHandler } from '../../asyncAction';

export interface AsyncActionLogicParams {
  resolveAction: () => void;
}

export interface AsyncActionLogic {
  (params: AsyncActionLogicParams): MaybePromise<void>;
}

export interface CreateAsyncActionBag {
  setNext: CreateAsyncAction;
  getHandler(): AsyncActionHandler;
}

export interface CreateAsyncAction {
  (action: AsyncActionLogic): CreateAsyncActionBag;
}

export interface CreateNextAsyncAction {
  (currentHandler: AsyncActionHandler, baseHandler: AsyncActionHandler): CreateAsyncActionBag;
}
