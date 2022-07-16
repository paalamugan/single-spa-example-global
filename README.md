# Single spa example global

Single spa example share data between one to other single spa microfrontend application.

## How to Use

- One Way to do, Registered store from single-spa microfrontend

  ```ts
  import { StoreDistributorFromRedux } from "@single-spa-example/global";
  const storeDistributor = new StoreDistributorFromRedux();
  storeDistributor.registerStore(storeName, store);
  ```

- Another Way to do, Registered store from single-spa microfrontend

  ```ts
  import { storeDistributorFromRedux as storeDistributor } from "@single-spa-example/global";
  storeDistributor.registerStore(storeName, store);
  ```

- Add Below line, Where you would like to access registered Store state value.

  ```ts
  import { storeDistributorFromRedux as storeDistributor } from "@single-spa-example/global";
  const state = storeDistributor.getState(storeName);
  console.log("state", state);
  ```

- Add Below line, Where you would like to access registered Store state value as observable.

  ```ts
  import { storeDistributorFromRedux as storeDistributor } from "@single-spa-example/global";
  const state$ = storeDistributor.getState$(storeName);
  state$.subscribe((state) => {
    console.log("state", state);
  });
  ```

- Add Below line, To update data from one microfrontend to other microfrontend
  ```ts
  import { storeDistributorFromRedux as storeDistributor } from "@single-spa-example/global";
  storeDistributor.dispatch({ type: "INCREMENT", payload: 1 });
  ```

## Getting started

- Supported Node Engine

```
node - v16.12.0
yarn - 1.22.19
```

- Install node_modules package for first time only

```sh
yarn install
```

- Run application in development mode

```sh
yarn start
```

- Run application as a standalone in development mode

```sh
yarn start:standalone
```

- To build for production

```sh
yarn build
```
