import {
  CreateNextResponseErrorFilter,
  CreateResponseErrorFilter,
  CreateResponseErrorInterceptor,
} from '../types/responseError';
import {
  ResponseErrorFilteringHandler,
  ResponseErrorFilteringResolver,
  ResponseErrorInterceptor,
} from '../response';
import { AsyncActionResolver } from '../asyncAction';

export const createNextErrorChecker: CreateNextResponseErrorFilter = (
  currentHandler,
  baseHandler
) => ({
  setNext(check) {
    const nextChecker = new ResponseErrorFilteringHandler(check);
    currentHandler.setNext(nextChecker);
    return createNextErrorChecker(nextChecker, baseHandler);
  },
  getHandler() {
    return baseHandler;
  },
});

const createResponseErrorFilter: CreateResponseErrorFilter = (check) => {
  const baseChecker = new ResponseErrorFilteringHandler(check);
  return {
    setNext(nextCheck) {
      const nextChecker = new ResponseErrorFilteringHandler(nextCheck);
      baseChecker.setNext(nextChecker);
      return createNextErrorChecker(nextChecker, baseChecker);
    },
    getHandler() {
      return baseChecker;
    },
  };
};

const createResponseErrorInterceptor: CreateResponseErrorInterceptor = (instance, params) => {
  const { intercept, filter, repeatRequest } = params;
  const interceptor = new ResponseErrorInterceptor(repeatRequest);
  if (filter !== undefined) {
    interceptor.addFilteringResolver(new ResponseErrorFilteringResolver(filter.getHandler()));
  }
  if (intercept !== undefined) {
    interceptor.addAsyncActionResolver(new AsyncActionResolver(intercept.getHandler()));
  }
  return interceptor.setup(instance);
};

export { createResponseErrorFilter, createResponseErrorInterceptor };
