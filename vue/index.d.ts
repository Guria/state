import { DeepReadonly, Ref } from 'vue'

import { ReadableStore } from '../create-store/index.js'

type ReadonlyRef<Type> = DeepReadonly<Ref<Type>>

/**
 * Subscribe to store changes and get store’s value.
 *
 * ```html
 * <template>
 *   <home-view v-if="page.router === 'home'" />
 *   <error-404-view v-else />
 * </template>
 *
 * <script>
 * import { useStore } from 'nanostores/vue'
 *
 * import { router } from './router'
 *
 * export default () => {
 *   let page = useStore(router)
 *   return { page }
 * }
 * </script>
 * ```
 *
 * @param store Store instance.
 * @returns Store value.
 */
export function useStore<Value extends any>(
  store: ReadableStore<Value>
): ReadonlyRef<Value>
