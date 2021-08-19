/**
 * Handlers and Actions allow registering the next handler/action
 * to be executed after the current one
 */
export interface WithNext<HandlerOrAction> {
  setNext(handler: HandlerOrAction): HandlerOrAction;
}
