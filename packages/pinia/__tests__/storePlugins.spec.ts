import { describe, it, expect, vi } from 'vitest'
import { createPinia, defineStore, watch } from '../src'
import { computed, ref, toRef } from '@vue/reactivity'

declare module '../src' {
  export interface PiniaCustomProperties<Id> {
    pluginN: number
    hasApp: boolean
    idFromPlugin: Id
    globalA: string
    globalB: string
    shared: number
    double: number
  }

  export interface PiniaCustomStateProperties<S> {
    // pluginN: 'test' extends Id ? number : never | undefined
    pluginN: number
    shared: number
  }
}

describe('store plugins', () => {
  const useStore = defineStore('test', {
    actions: {
      incrementN() {
        return this.pluginN++
      },
    },

    getters: {
      doubleN: (state) => state.pluginN * 2,
    },
  })

  it('adds properties to stores', () => {
    const pinia = createPinia()

    // must call use after installing the plugin
    pinia.use(({ store }) => {
      if (!store.$state.hasOwnProperty('pluginN')) {
        // @ts-expect-error: cannot be a ref yet
        store.$state.pluginN = ref(20)
      }
      // @ts-expect-error: TODO: allow setting refs
      store.pluginN = toRef(store.$state, 'pluginN')
      return {}
    })

    const store = useStore(pinia)

    expect(store.$state.pluginN).toBe(20)
    expect(store.pluginN).toBe(20)
    // @ts-expect-error: pluginN is a number
    store.pluginN.notExisting
    // @ts-expect-error: it should always be 'test'
    store.idFromPlugin == 'hello'
  })

  it('can install plugins before installing pinia', () => {
    const pinia = createPinia()

    pinia.use(() => ({ pluginN: 1 }))

    pinia.use(() => ({ hasApp: true }))

    const store = useStore(pinia)

    expect(store.pluginN).toBe(1)
    expect(store.hasApp).toBe(true)
  })

  it('can be used in actions', () => {
    const pinia = createPinia()

    // must call use after installing the plugin
    pinia.use(() => {
      return { pluginN: 20 }
    })

    const store = useStore(pinia)

    expect(store.incrementN()).toBe(20)
  })

  it('can be used in getters', () => {
    const pinia = createPinia()

    // must call use after installing the plugin
    pinia.use(() => {
      return { pluginN: 20 }
    })

    const store = useStore(pinia)
    expect(store.doubleN).toBe(40)
  })

  it('allows chaining', () => {
    const pinia = createPinia()

    // must call use after installing the plugin
    pinia.use(() => ({ globalA: 'a' })).use(() => ({ globalB: 'b' }))

    const store = useStore(pinia)
    expect(store.globalA).toBe('a')
    expect(store.globalB).toBe('b')
  })

  it('shares the same ref among stores', () => {
    const pinia = createPinia()

    // must call use after installing the plugin
    pinia.use(({ store }) => {
      if (!store.$state.hasOwnProperty('shared')) {
        // @ts-expect-error: cannot be a ref yet
        store.$state.shared = ref(20)
      }
      // @ts-expect-error: TODO: allow setting refs
      store.shared = toRef(store.$state, 'shared')
    })

    const store = useStore(pinia)
    const store2 = useStore(pinia)

    expect(store.$state.shared).toBe(20)
    expect(store.shared).toBe(20)
    expect(store2.$state.shared).toBe(20)
    expect(store2.shared).toBe(20)

    store.$state.shared = 10
    expect(store.$state.shared).toBe(10)
    expect(store.shared).toBe(10)
    expect(store2.$state.shared).toBe(10)
    expect(store2.shared).toBe(10)

    store.shared = 1
    expect(store.$state.shared).toBe(1)
    expect(store.shared).toBe(1)
    expect(store2.$state.shared).toBe(1)
    expect(store2.shared).toBe(1)
  })

  it('passes the options of the options store', async () => {
    const options = {
      id: 'main',
      state: () => ({ n: 0 }),
      actions: {
        increment() {
          // @ts-expect-error
          this.n++
        },
      },
      getters: {
        a() {
          return 'a'
        },
      },
    }
    const useStore = defineStore(options)
    const pinia = createPinia()

    await new Promise<void>((done) => {
      pinia.use((context) => {
        expect(context.options).toEqual(options)
        done()
      })
      useStore(pinia)
    })
  })

  it('passes the options of a setup store', async () => {
    const useStore = defineStore('main', () => {
      const n = ref(0)

      function increment() {
        n.value++
      }
      const a = computed(() => 'a')

      return { n, increment, a }
    })
    const pinia = createPinia()

    await new Promise<void>((done) => {
      pinia.use((context) => {
        expect(context.options).toEqual({
          actions: {
            increment: expect.any(Function),
          },
        })
        ;(context.store as any).increment()
        expect((context.store as any).n).toBe(1)
        done()
      })

      useStore()
    })
  })

  it('run inside store effect', async () => {
    const pinia = createPinia()

    // must call use after installing the plugin
    pinia.use(({ store }) => ({
      // @ts-expect-error: invalid computed
      double: computed(() => store.$state.n * 2),
    }))

    const useStore = defineStore('main', {
      state: () => ({ n: 1 }),
    })

    const store = useStore(pinia)

    const spy = vi.fn()
    watch(() => store.double, spy, { flush: 'sync' })

    expect(spy).toHaveBeenCalledTimes(0)

    store.n++
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
