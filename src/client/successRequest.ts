import {
  RequestSuccessInterceptor,
  RequestSuccessImprovingHandler,
  RequestSuccessCheckingHandler,
  RequestSuccessImprovingResolver,
  RequestSuccessCheckingResolver,
} from '../request';
import {
  CreateSuccessRequestImprover,
  CreateNextSuccessRequestImprover,
  CreateNextSuccessRequestChecker,
  CreateSuccessRequestChecker,
  CreateSuccessRequestInterceptor,
  RequestCheckerLogic,
} from '../types/client/successRequest';
import { Waiter } from '../asyncAction';
import { AsyncActionLogic } from '../types/client/asyncAction';

const createNextImprover: CreateNextSuccessRequestImprover = (currentImprover, baseImprover) => ({
  setNext(improve) {
    const nextImprover = new RequestSuccessImprovingHandler(improve);
    currentImprover.setNext(nextImprover);
    return createNextImprover(nextImprover, baseImprover);
  },
  getHandler() {
    return baseImprover;
  },
});

const createNextRequestChecker: CreateNextSuccessRequestChecker = (
  currentHandler,
  baseHandler
) => ({
  setNext(check) {
    const nextChecker = new RequestSuccessCheckingHandler(check);
    currentHandler.setNext(nextChecker);
    return createNextRequestChecker(nextChecker, baseHandler);
  },
  getHandler() {
    return baseHandler;
  },
});

const createRequestImprover: CreateSuccessRequestImprover = (improve) => {
  const baseImprover = new RequestSuccessImprovingHandler(improve);

  return {
    setNext(nextImprove) {
      const nextImprover = new RequestSuccessImprovingHandler(nextImprove);
      baseImprover.setNext(nextImprover);
      return createNextImprover(nextImprover, baseImprover);
    },
    getHandler() {
      return baseImprover;
    },
  };
};

const createRequestChecker: CreateSuccessRequestChecker = (
  check: RequestCheckerLogic,
  fix?: AsyncActionLogic
) => {
  const createBaseChecker = () => {
    if (fix === undefined) return new RequestSuccessCheckingHandler(check);
    const waiter = new Waiter(fix);
    return new RequestSuccessCheckingHandler(check, waiter);
  };

  const baseChecker = createBaseChecker();
  return {
    setNext(nextCheck) {
      const nextChecker = new RequestSuccessCheckingHandler(nextCheck);
      baseChecker.setNext(nextChecker);
      return createNextRequestChecker(nextChecker, baseChecker);
    },
    getHandler() {
      return baseChecker;
    },
  };
};

const createRequestInterceptor: CreateSuccessRequestInterceptor = (instance, params) => {
  const { improve, check } = params;
  const interceptor = new RequestSuccessInterceptor();
  if (improve !== undefined) {
    interceptor.addImprovingResolver(new RequestSuccessImprovingResolver(improve.getHandler()));
  }
  if (check !== undefined) {
    interceptor.addCheckingResolver(new RequestSuccessCheckingResolver(check.getHandler()));
  }
  return interceptor.setup(instance);
};

export { createRequestChecker, createRequestImprover, createRequestInterceptor };
