import { MaybePromise } from './utils';

/**
 * Handlers must work with a specific entity, such as a request, response, or response error.
 * Moreover, each handler returns its processing result.
 * For example, a filtering handler will return true or false,
 * but an enhancement handler will return the same entity that it is working with.
 */
export interface WithHandle<EntityToHandle> {
  handle(entityToHandle: EntityToHandle): MaybePromise;
}
