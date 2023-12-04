import { Pinia } from './rootStore'
import { ref, markRaw, effectScope, Ref } from '@vue/reactivity'
import { StateTree, StoreGeneric } from './types'

/**
 * Creates a Pinia instance to be used by the application
 */
export function createPinia(): Pinia {
  const scope = effectScope(true)
  // NOTE: here we could check the window object for a state and directly set it
  // if there is anything like it with Vue 3 SSR
  const state = scope.run<Ref<Record<string, StateTree>>>(() =>
    ref<Record<string, StateTree>>({})
  )!

  let _p: Pinia['_p'] = []

  const pinia: Pinia = markRaw({
    use(plugin) {
      _p.push(plugin)
      return this
    },

    _p,
    // it's actually undefined here
    _e: scope,
    _s: new Map<string, StoreGeneric>(),
    state,
  })

  return pinia
}
