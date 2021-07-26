import { AxiosInstance } from 'axios';
import { RequestImprovingHandler } from './abstract';
import {
  CreateImprover,
  CreateImproverBag,
  CreateImprovingHandler,
  CreateNextImprover,
} from './types/createImprover';
import { RequestInterceptor } from './interceptors/RequestInterceptor';
import { RequestImprovingResolver } from './resolvers/RequestImprovingResolver';

const createImprovingHandler: CreateImprovingHandler = (improve) => {
  class Improver extends RequestImprovingHandler {
    handle = improve;
  }
  return new Improver();
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

const requestInterceptor = (instance: AxiosInstance) => {
  const interceptor = new RequestInterceptor();
  return {
    improve: (improver: CreateImproverBag) => {
      const resolver = new RequestImprovingResolver(improver.getHandler());
      interceptor.addImprovingResolver(resolver);
      interceptor.setup(instance);
    },
  };
};

export { createImprover, requestInterceptor };
