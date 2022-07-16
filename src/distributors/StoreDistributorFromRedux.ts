import { Store } from "redux";
import { Observable, BehaviorSubject } from "rxjs";

function getStateValueOnly<T extends Store>(store: T) {
  const state = store.getState();
  const newState = {} as ReturnType<typeof store.getState>;
  Object.entries(state).forEach(([key, value]: [string, Object]) => {
    if (!value.hasOwnProperty("queries")) {
      newState[key] = value;
    }
  });
  return newState;
}

function getState<T extends Store>(store: T) {
  const state = store.getState();
  return state as ReturnType<typeof store.getState>;
}

function getState$<T extends Store>(
  store: T
): Observable<ReturnType<typeof store.getState>> {
  return new Observable(function (observer) {
    // emit the current state as first value:
    observer.next(getState(store));
    const unsubscribe = store.subscribe(function () {
      // emit on every new state changes
      observer.next(getState(store));
    });
    // let's return the function that will be called
    // when the Observable is unsubscribed
    return unsubscribe;
  });
}

type StoreDistributor = Record<string, Store>;
type StoreDistributorBehaviourSubject = Record<
  string,
  BehaviorSubject<unknown>
>;

class StoreDistributorFromRedux {
  private store: StoreDistributor = {};
  private storeBehaviourSubject: StoreDistributorBehaviourSubject = {};
  private static instance: StoreDistributorFromRedux;

  constructor() {
    if (!StoreDistributorFromRedux.instance) {
      this.store = {};
      this.storeBehaviourSubject = {};
      StoreDistributorFromRedux.instance = this;
    }

    return StoreDistributorFromRedux.instance;
  }

  registerStore<
    TFirstParam extends string,
    TSecondParam extends NonNullable<Store>
  >(storeName: TFirstParam, store: TSecondParam) {
    this.store[storeName] = store;
    const storeBehaviourSubject =
      this.storeBehaviourSubject[storeName] ||
      new BehaviorSubject<ReturnType<TSecondParam["getState"]>>(null);
    const observable = getState$<typeof store>(store);
    observable.subscribe(storeBehaviourSubject);
  }

  dispatch<T extends { type: string; payload?: unknown }>(event: T) {
    Object.keys(this.store).forEach((storeName) => {
      const store = this.getStore(storeName);
      if (!store) return;
      this.store[storeName].dispatch(event);
    });
  }

  getState$<T extends keyof StoreDistributorBehaviourSubject>(
    storeName: T
  ): BehaviorSubject<ReturnType<StoreDistributor[T]["getState"]>> {
    this.storeBehaviourSubject[storeName] =
      this.storeBehaviourSubject[storeName] ||
      new BehaviorSubject<ReturnType<StoreDistributor[T]["getState"]>>(null);
    return this.storeBehaviourSubject[storeName];
  }

  getState<T extends keyof StoreDistributor>(
    storeName: T
  ): ReturnType<StoreDistributor[T]["getState"]> {
    const store = this.getStore(storeName);
    if (!store) return null;
    return store.getState();
  }

  getStore<T extends keyof StoreDistributor>(storeName: T) {
    return this.store[storeName] as StoreDistributor[T];
  }

  getStores() {
    const storeNames = this.getStoreNames();
    return storeNames.map((storeName) => {
      return {
        [storeName]: this.store[storeName],
      };
    });
  }

  getStoreNames() {
    return Object.keys(this.store) as Array<keyof StoreDistributor>;
  }

  static getInstance(): StoreDistributorFromRedux {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }
}

export const storeDistributorFromRedux = Object.freeze(
  StoreDistributorFromRedux.getInstance()
);

export default StoreDistributorFromRedux;
