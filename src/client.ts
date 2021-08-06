/* eslint-disable max-classes-per-file */
import { AxiosInstance } from 'axios';
import { RequestCheckingHandler, RequestImprovingHandler } from './abstract';
import {
  CreateChecker,
  CreateCheckerBag,
  CreateCheckingHandler,
  CreateImprover,
  CreateImproverBag,
  CreateImprovingHandler,
  CreateNextChecker,
  CreateNextImprover,
  ExcludedTestBag,
  RequestInterceptorActions,
} from './types/createImprover';
import { RequestInterceptor } from './interceptors';
import { RequestCheckingResolver, RequestImprovingResolver } from './resolvers';

// TODO split code to files, fix eslint max classes error
const createImprovingHandler: CreateImprovingHandler = (improve) => {
  class Improver extends RequestImprovingHandler {
    handle = improve;
  }
  return new Improver();
};

const createCheckingHandler: CreateCheckingHandler = (check) => {
  class Checker extends RequestCheckingHandler {
    public handle = check;
  }

  return new Checker();
};

const createNextImprover: CreateNextImprover = (currentImprover, baseImprover) => ({
  setNext(improve) {
    const nextImprover = createImprovingHandler(improve);
    currentImprover.setNext(nextImprover);
    return createNextImprover(nextImprover, baseImprover);
  },
  getHandler() {
    return baseImprover;
  },
});

const createNextChecker: CreateNextChecker = (currentHandler, baseHandler) => ({
  setNext(check) {
    const nextChecker = createCheckingHandler(check);
    currentHandler.setNext(nextChecker);
    return createNextChecker(nextChecker, baseHandler);
  },
  getHandler() {
    return baseHandler;
  },
});

const createImprover: CreateImprover = (improve) => {
  const baseImprover = createImprovingHandler(improve);

  return {
    setNext(nextImprove) {
      const nextImprover = createImprovingHandler(nextImprove);
      baseImprover.setNext(nextImprover);
      return createNextImprover(nextImprover, baseImprover);
    },
    getHandler() {
      return baseImprover;
    },
  };
};

const createChecker: CreateChecker = (check) => {
  const baseChecker = createCheckingHandler(check);
  return {
    setNext(nextCheck) {
      const nextChecker = createCheckingHandler(nextCheck);
      baseChecker.setNext(nextChecker);
      return createNextChecker(nextChecker, baseChecker);
    },
    getHandler() {
      return baseChecker;
    },
  };
};

const getInterceptorActions = <InitialExcluded extends RequestInterceptorActions | ''>(
  instance: AxiosInstance,
  interceptor: RequestInterceptor,
  ...deletedActions: string[]
): ExcludedTestBag<InitialExcluded, ''> => {
  const baseActions = {
    improve: (improver: CreateImproverBag) => {
      const resolver = new RequestImprovingResolver(improver.getHandler());
      interceptor.addImprovingResolver(resolver);
      interceptor.setup(instance);
      return getInterceptorActions<InitialExcluded | 'improve'>(
        instance,
        interceptor,
        ...deletedActions.concat('improve' as InitialExcluded)
      );
    },

    check: (checker: CreateCheckerBag) => {
      const resolver = new RequestCheckingResolver(checker.getHandler());
      interceptor.addCheckingResolver(resolver);
      interceptor.setup(instance);
      return getInterceptorActions<InitialExcluded | 'check'>(
        instance,
        interceptor,
        ...deletedActions.concat('check' as InitialExcluded)
      );
    },
  } as ExcludedTestBag<InitialExcluded, ''>;

  return Object.keys(deletedActions).reduce((acc, actionLabel) => {
    const canRemoveKey = deletedActions[actionLabel as keyof typeof deletedActions];
    if (canRemoveKey) {
      const { [actionLabel as keyof typeof acc]: actionToExclude, ...restActions } = acc;
      return restActions;
    }
    return acc as any;
  }, baseActions);
};

const createRequestInterceptor = (instance: AxiosInstance): ExcludedTestBag<'', ''> => {
  const interceptor = new RequestInterceptor();

  return getInterceptorActions(instance, interceptor);
};

export { createImprover, createChecker, createRequestInterceptor };
