const isPromise = (candidate: any): candidate is PromiseLike<any> =>
  candidate !== null && typeof candidate === 'object' && typeof candidate.then === 'function';

export { isPromise };
