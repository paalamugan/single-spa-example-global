# Single spa global

Share data between single spa microfrontend application.

## How to Use

- One Way to do

```ts
import { StoreDistributorFromRedux } from "single-spa-global";
const storeDistributor = new StoreDistributorFromRedux();
storeDistributor.registerStore(storeName, store);
```

- Another Way to do

  - Add Below line, In Which micro frontend application store you would like to share to another micro frontend application.

  ```ts
  import { storeDistributorFromRedux as storeDistributor } from "single-spa-global";
  storeDistributor.registerStore(storeName, store);
  ```

  - Add Below line, So you can access registered Store state value from other micro frontend application.

  ```ts
  import { storeDistributorFromRedux as storeDistributor } from "single-spa-global";
  const state = storeDistributor.getState(storeName);
  console.log("state", state);
  ```

  ```ts
  import { storeDistributorFromRedux as storeDistributor } from "single-spa-global";
  const state$ = storeDistributor.getState$(storeName);
  state$.subscribe((state) => {
    console.log("state", state);
  });
  ```

  ```ts
  import { storeDistributorFromRedux as storeDistributor } from "single-spa-global";
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
