export type MaybePromise<Data = any> = Promise<Data> | Data;

export type Nullable<Data = any> = null | Data;

export type ListElement<List extends any[]> = List extends (infer Element)[] ? Element : never;

export type CreationBag<NextFunction, Handler> = {
  setNext: NextFunction;
  getHandler: () => Handler;
};

export type HandlerLogic<EntityToHandle, Result> = (
  entityToHandle: EntityToHandle
) => MaybePromise<Result>;

export type CreateNextLogic<Handler, Bag> = (currentHandler: Handler, baseHandler: Handler) => Bag;
