const isObject = (candidate: any): candidate is Object =>
  candidate !== null && typeof candidate === 'object';

const isPromise = (candidate: any): candidate is PromiseLike<any> =>
  isObject(candidate) && typeof candidate.then === 'function';

export { isPromise };
