/* eslint-disable max-classes-per-file */
import { AxiosInstance } from 'axios';
import {
  ResponseErrorFilteringHandler,
  RequestCheckingHandler,
  RequestImprovingHandler,
} from './abstract';
import {
  CreateRequestChecker,
  CreateRequestCheckingHandler,
  CreateImprover,
  CreateImprovingHandler,
  CreateNextRequestChecker,
  CreateNextImprover,
} from './types/createImprover';
import { ErrorInterceptor, RequestInterceptor } from './interceptors';
import { ErrorFilteringResolver } from './resolvers';
import {
  CreateResponseErrorFilter,
  CreateResponseErrorFilteringHandler,
  CreateNextResponseErrorFilter,
  CreateResponseErrorInterceptor,
} from './types/responseError';

// TODO split code to files, fix eslint max classes error
const createImprovingHandler: CreateImprovingHandler = (improve) => {
  class Improver extends RequestImprovingHandler {
    handle = improve;
  }
  return new Improver();
};

const createRequestCheckingHandler: CreateRequestCheckingHandler = (check) => {
  class Checker extends RequestCheckingHandler {
    public handle = check;
  }

  return new Checker();
};

const createErrorCheckingHandler: CreateResponseErrorFilteringHandler = (check) => {
  class Checker extends ResponseErrorFilteringHandler {
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

const createNextRequestChecker: CreateNextRequestChecker = (currentHandler, baseHandler) => ({
  setNext(check) {
    const nextChecker = createRequestCheckingHandler(check);
    currentHandler.setNext(nextChecker);
    return createNextRequestChecker(nextChecker, baseHandler);
  },
  getHandler() {
    return baseHandler;
  },
});

const createNextErrorChecker: CreateNextResponseErrorFilter = (currentHandler, baseHandler) => ({
  setNext(check) {
    const nextChecker = createErrorCheckingHandler(check);
    currentHandler.setNext(nextChecker);
    return createNextErrorChecker(nextChecker, baseHandler);
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

const createRequestChecker: CreateRequestChecker = (check) => {
  const baseChecker = createRequestCheckingHandler(check);
  return {
    setNext(nextCheck) {
      const nextChecker = createRequestCheckingHandler(nextCheck);
      baseChecker.setNext(nextChecker);
      return createNextRequestChecker(nextChecker, baseChecker);
    },
    getHandler() {
      return baseChecker;
    },
  };
};

const createResponseErrorFilter: CreateResponseErrorFilter = (check) => {
  const baseChecker = createErrorCheckingHandler(check);
  return {
    setNext(nextCheck) {
      const nextChecker = createErrorCheckingHandler(nextCheck);
      baseChecker.setNext(nextChecker);
      return createNextErrorChecker(nextChecker, baseChecker);
    },
    getHandler() {
      return baseChecker;
    },
  };
};

// const getRequestInterceptorActions = <InitialExcluded extends RequestInterceptorActions | ''>(
//   instance: AxiosInstance,
//   interceptor: RequestInterceptor,
//   ...deletedActions: string[]
// ): ExcludedTestBag<InitialExcluded, ''> => {
//   const baseActions = {
//     improve: (improver: CreateImproverBag) => {
//       const resolver = new RequestImprovingResolver(improver.getHandler());
//       interceptor.addImprovingResolver(resolver);
//       interceptor.setup(instance);
//       return getRequestInterceptorActions<InitialExcluded | 'improve'>(
//         instance,
//         interceptor,
//         ...deletedActions.concat('improve' as InitialExcluded)
//       );
//     },
//
//     check: (checker: CreateRequestCheckerBag) => {
//       const resolver = new RequestCheckingResolver(checker.getHandler());
//       interceptor.addCheckingResolver(resolver);
//       interceptor.setup(instance);
//       return getRequestInterceptorActions<InitialExcluded | 'check'>(
//         instance,
//         interceptor,
//         ...deletedActions.concat('check' as InitialExcluded)
//       );
//     },
//   } as ExcludedTestBag<InitialExcluded, ''>;
//
//   return Object.keys(deletedActions).reduce((acc, actionLabel) => {
//     const canRemoveKey = deletedActions[actionLabel as keyof typeof deletedActions];
//     if (canRemoveKey) {
//       const { [actionLabel as keyof typeof acc]: actionToExclude, ...restActions } = acc;
//       return restActions;
//     }
//     return acc as any;
//   }, baseActions);
// };

const createRequestInterceptor = (instance: AxiosInstance) => {
  const interceptor = new RequestInterceptor();
  // eslint-disable-next-line no-console
  console.log(interceptor);
  // eslint-disable-next-line no-console
  console.log(instance);
  // return getRequestInterceptorActions(instance, interceptor);
};

const createResponseErrorInterceptor: CreateResponseErrorInterceptor = (instance, params) => {
  const interceptor = new ErrorInterceptor();
  if (params.filter !== undefined) {
    interceptor.addFilteringResolver(new ErrorFilteringResolver(params.filter.getHandler()));
  }
  interceptor.setup(instance);
};

export {
  createImprover,
  createRequestChecker,
  createRequestInterceptor,
  createResponseErrorFilter,
  createResponseErrorInterceptor,
};
