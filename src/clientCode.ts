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
