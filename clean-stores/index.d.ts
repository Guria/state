import { MapBuilder, AnySyncBuilder } from '../define-map/index.js'
import { ReadableStore } from '../create-store/index.js'

export const clean: unique symbol

/**
 * Destroys all cached stores and remove store from the cache.
 *
 * ```js
 * import { cleanStores } from 'nanostores'
 *
 * afterEach(() => {
 *   cleanStores(Router, Settings, User)
 * })
 * ```
 *
 * @param stores Used store classes.
 * @return Promise for stores destroying.
 */
export function cleanStores(
  ...stores: (ReadableStore | MapBuilder | AnySyncBuilder)[]
): void
