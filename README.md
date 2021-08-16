Tired creating these state in your component: loading, error, data, retry?
<br>
Also you need to check if component unmounted, is the current response still valid ...
<br>
With use-promise-result, your job is to specify how to get data, we take care all the boring flags.

# Build Status:
[![npm publish](https://github.com/lekhasy/use-promise-result/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/lekhasy/use-promise-result/actions/workflows/npm-publish.yml)

# Install:

```shell
npm i use-promise-result
```

# Usage:

```javascript
import { usePromiseTracker } from "use-promise-result";

const dataProvider = async () => {
  return (await axios.get("https://jsonplaceholder.typicode.com/todos/1")).data;
};

function App() {
  const { data, error, loading, success, track, tracking } =
    usePromiseTracker();

  useEffect(() => {
    handleReload()
  });

  const handleReload = () => track(dataProvider())

  // ...
}
```

## Fetch data on click:

``` javascript
const { data, error, loading, success, track, tracking } =
    usePromiseTracker();

const handleReload = () => track(dataProvider())
```

# API Reference:

### usePromiseTracker

```javascript
usePromiseTracker() : {data, error, loading, success, track, tracking}
```

### Returned value

```
- data: value returned from the promise
- error: error throw from the promise
- loading: indicate state of the promise
- track: call this function to track another promise
- tracking: indicate that the hook is tracking a promise
- success: tracking && !state.loading && !state.error
```

# Demo:

https://stackblitz.com/edit/react-kuzhwn?file=package.json
