import { describe, expect, it } from 'vitest'
import { createTestingPinia } from './testing'
import { defineStore, setActivePinia } from 'pinia'
import { ref, computed } from '@vue/reactivity'

describe('Testing', () => {
  const useCounter = defineStore('counter', {
    state: () => ({ n: 0 }),
    getters: {
      double: (state) => state.n * 2,
      doublePlusOne(): number {
        return this.double + 1
      },
    },
    actions: {
      increment(amount = 1) {
        this.n += amount
      },
    },
  })

  const useCounterSetup = defineStore('counter-setup', () => {
    const n = ref(0)
    const double = computed(() => n.value * 2)
    const doublePlusOne = computed(() => double.value + 1)
    function increment(amount = 1) {
      n.value += amount
    }
    function $reset() {
      n.value = 0
    }

    return { n, double, doublePlusOne, increment, $reset }
  })

  const STORES_TO_TEST = {
    'Options Store': useCounter,
    'Setup Store': useCounterSetup,
  }

  for (const name in STORES_TO_TEST) {
    const useStore = STORES_TO_TEST[name as keyof typeof STORES_TO_TEST]

    describe('plugins', () => {

      it('executes plugins with fakeApp', () => {
        const pinia = createTestingPinia({
          plugins: [() => ({ pluginN: 0 })],
        })

        const counter = useStore(pinia)

        expect(counter.pluginN).toBe(0)
      })

      it('can override getters added in plugins', () => {
        const pinia = createTestingPinia({
          plugins: [
            ({ store }) => {
              store.triple = computed(() => store.n * 3)
            },
          ],
        })

        const store = useStore(pinia)
        store.n++
        // @ts-expect-error: non declared
        expect(store.triple).toBe(3)
        // once the getter is overridden, it stays
        // @ts-expect-error: non declared
        store.triple = 10
        // @ts-expect-error: non declared
        expect(store.triple).toBe(10)
        store.n++
        // @ts-expect-error: non declared
        expect(store.triple).toBe(10)
        // it can be set to undefined again to reset
        // @ts-expect-error
        store.triple = undefined
        // @ts-expect-error: non declared
        expect(store.triple).toBe(6)
        store.n++
        // @ts-expect-error: non declared
        expect(store.triple).toBe(9)
      })
    })

    describe('getters', () => {
      it('allows overriding getters', () => {
        const pinia = createTestingPinia()
        const store = useStore(pinia)

        // console.log('is same', d === toRaw(store).double._computed)

        store.n++
        expect(store.double).toBe(2)
        // once the getter is overridden, it stays
        store.double = 3
        expect(store.double).toBe(3)
        expect(store.doublePlusOne).toBe(4)
        store.n++
        expect(store.double).toBe(3)
        expect(store.doublePlusOne).toBe(4)
        // it can be set to undefined again to reset
        // @ts-expect-error
        store.double = undefined
        expect(store.n).toBe(2)
        expect(store.double).toBe(4)
        expect(store.doublePlusOne).toBe(5)
        // it works again
        store.n++
        expect(store.n).toBe(3)
        expect(store.double).toBe(6)
        expect(store.doublePlusOne).toBe(7)
      })
    })
  }

  it('works with nested stores', () => {
    const useA = defineStore('a', () => {
      const n = ref(0)
      return { n }
    })

    const useB = defineStore('b', () => {
      const a = useA()
      const n = ref(0)
      const doubleA = computed(() => a.n * 2)
      return { n, doubleA }
    })

    const pinia = createTestingPinia()
    setActivePinia(pinia)

    const b = useB()
    const a = useA()

    expect(a.n).toBe(0)
    a.n++
    expect(b.doubleA).toBe(2)
    expect(pinia.state.value).toEqual({
      a: { n: 1 },
      b: { n: 0 },
    })
  })
})
