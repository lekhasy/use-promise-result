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

```javascript
import { usePromiseResult } from "use-promise-result";

const dataProvider = () => {
  return axios.get("https://jsonplaceholder.typicode.com/todos/1");
};

function App() {
  const { data, error, loading, success, reload } =
    usePromiseResult(dataProvider);

    // ...
}
```

# Example:
https://stackblitz.com/edit/react-kuzhwn?file=package.json
