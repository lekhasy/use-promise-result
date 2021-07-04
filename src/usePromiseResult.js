import { useCallback, useEffect, useReducer, useRef } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived": {
      return { ...state, loading: false, data: action.payload.data };
    }
    case "errorOccured": {
      return {
        ...state,
        data: null,
        loading: false,
        error: action.payload.error,
      };
    }
    case "reload":
      return {
        ...state,
        loading: true,
        error: null,
        retryCount: state.retryCount + 1,
      };
    default:
      throw new Error();
  }
}

export function usePromiseResult(dataProvider, initFetch = true) {
  const [state, dispatch] = useReducer(reducer, {
    error: null,
    data: null,
    loading: initFetch,
    retryCount: initFetch ? 0 : -1,
  });

  const isMounted = useIsMounted();

  useEffect(() => {
    if (state.retryCount === -1) {
      return;
    }
    dataProvider()
      .then((data) => {
        if (isMounted) dispatch({ type: "dataReceived", payload: { data } });
      })
      .catch((error) => {
        if (isMounted) dispatch({ type: "errorOccured", payload: { error } });
      });
    // we only want to trigger this effect only user specifically call retry
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.retryCount]);

  const handleReload = useCallback(() => {
    dispatch({ type: "reload" });
  }, []);

  return {
    loading: state.loading,
    data: state.data,
    error: state.error,
    success: !state.loading && !state.error,
    reload: handleReload,
  };
}

// https://stackoverflow.com/questions/49906437/how-to-cancel-a-fetch-on-componentwillunmount
function useIsMounted() {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted; // returning "isMounted.current" wouldn't work because we would return unmutable primitive
}
