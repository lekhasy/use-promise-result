Tired creating these state in your component: isLoading, isError, data, retry?
<br>
With use-promise-result, your job is to specify how to get data, we take care all the boring flags.

# Build Status:

[![npm publish](https://github.com/lekhasy/use-promise-result/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/lekhasy/use-promise-result/actions/workflows/npm-publish.yml)

# Install:

```shell
pnpm i use-promise-result
```

# Usage:

## Fetch data on mount:

```javascript
import { usePromiseResult } from "use-promise-result";

const dataProvider = async () => {
  return (await axios.get("https://jsonplaceholder.typicode.com/todos/1")).data;
};

function App() {
  const { data, error, loading, success, reload } =
    usePromiseResult(dataProvider);

  // ...
}
```

## Fetch data on action:

```
const { data, error, loading, success, reload } =
    usePromiseResult(dataProvider, false);
```

Passing the second parameter to fail would stop usePromiseResult from calling data provider on mount.

Later you can call reload function to trigger the call to data provider (ex: when user click on a button)

# API Reference:

### usePromiseResult

```
- usePromiseResult(<dataProvider>, [initFetch]) : {data, error, loading, success, reload}
```

### Returned value

```
- data: value returned from dataProvider
- error: error throw from dataProvider
- loading: indicate state of the promise returned from dataProvider
- reload: call this function to reload data
```

#### Most of the time, you only care about is data available or not

```
- success: success = !state.loading && !state.error
```

# Example:

https://stackblitz.com/edit/react-kuzhwn?file=package.json
