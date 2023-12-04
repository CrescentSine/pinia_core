/**
 * @module pinia
 */
export { setActivePinia, getActivePinia } from './rootStore'
export { createPinia } from './createPinia'
export type {
  Pinia,
  // TODO: remove in next release
  PiniaStorePlugin,
  PiniaPlugin,
  PiniaPluginContext,
} from './rootStore'

export { defineStore, skipHydrate } from './store'
export type {
  StoreActions,
  StoreGetters,
  StoreState,
  SetupStoreDefinition,
} from './store'

export type {
  StateTree,
  Store,
  StoreGeneric,
  StoreDefinition,
  _StoreWithGetters,
  _GettersTree,
  _ActionsTree,
  _Method,
  _StoreWithActions,
  _StoreWithState,
  StoreProperties,
  StoreOnActionListener,
  _StoreOnActionListenerContext,
  StoreOnActionListenerContext,
  SubscriptionCallback,
  SubscriptionCallbackMutation,
  SubscriptionCallbackMutationDirect,
  SubscriptionCallbackMutationPatchFunction,
  SubscriptionCallbackMutationPatchObject,
  _SubscriptionCallbackMutationBase,
  PiniaCustomProperties,
  PiniaCustomStateProperties,
  DefineStoreOptionsBase,
  DefineStoreOptions,
  DefineSetupStoreOptions,
  DefineStoreOptionsInPlugin,
  _ExtractActionsFromSetupStore,
  _ExtractGettersFromSetupStore,
  _ExtractStateFromSetupStore,
  _DeepPartial,
  _ExtractActionsFromSetupStore_Keys,
  _ExtractGettersFromSetupStore_Keys,
  _ExtractStateFromSetupStore_Keys,
  _UnwrapAll,
  _Awaited,
} from './types'
export { MutationType } from './types'

export { storeToRefs } from './storeToRefs'

export {
  watch,
  watchEffect,
  watchPostEffect,
  watchSyncEffect,
  nextTick,
} from './fromVue'

export {
  // core
  reactive,
  ref,
  readonly,
  computed,
  // utilities
  unref,
  proxyRefs,
  isRef,
  toRef,
  toValue,
  toRefs,
  isProxy,
  isReactive,
  isReadonly,
  isShallow,
  // advanced
  customRef,
  triggerRef,
  shallowRef,
  shallowReactive,
  shallowReadonly,
  markRaw,
  toRaw,
  // effect
  effect,
  stop,
  ReactiveEffect,
  // effect scope
  effectScope,
  EffectScope,
  getCurrentScope,
  onScopeDispose
} from '@vue/reactivity'

export type {
  Ref,
  MaybeRef,
  MaybeRefOrGetter,
  ToRef,
  ToRefs,
  UnwrapRef,
  ShallowRef,
  ShallowUnwrapRef,
  CustomRefFactory,
  ReactiveFlags,
  DeepReadonly,
  ShallowReactive,
  UnwrapNestedRefs,
  ComputedRef,
  WritableComputedRef,
  WritableComputedOptions,
  ComputedGetter,
  ComputedSetter,
  ReactiveEffectRunner,
  ReactiveEffectOptions,
  EffectScheduler,
  DebuggerOptions,
  DebuggerEvent,
  DebuggerEventExtraInfo,
  Raw
} from '@vue/reactivity'
