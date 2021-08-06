export type MaybePromise<Data = any> = Promise<Data> | Data;

export type Nullable<Data = any> = null | Data;

export type ListElement<List extends any[]> = List extends (infer Element)[] ? Element : never;
