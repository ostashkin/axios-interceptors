import { CreateAsyncAction, CreateNextAsyncAction } from '../types/asyncAction';
import { AsyncActionHandler, Waiter } from '../asyncAction';

export const createNextAsyncAction: CreateNextAsyncAction = (currentHandler, baseHandler) => ({
  setNext(action) {
    const nextChecker = new AsyncActionHandler(new Waiter(action));
    currentHandler.setNext(nextChecker);
    return createNextAsyncAction(nextChecker, baseHandler);
  },
  getHandler() {
    return baseHandler;
  },
});

const createAsyncAction: CreateAsyncAction = (logic) => {
  const baseAction = new AsyncActionHandler(new Waiter(logic));

  return {
    setNext(nextLogic) {
      const nextAction = new AsyncActionHandler(new Waiter(nextLogic));
      baseAction.setNext(nextAction);
      return createNextAsyncAction(nextAction, baseAction);
    },
    getHandler() {
      return baseAction;
    },
  };
};

export { createAsyncAction };
