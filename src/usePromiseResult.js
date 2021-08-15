import { useCallback, useEffect, useReducer, useRef } from "react";
import { useIsMounted } from "./useIsMounted";
import usePromiseTracker from "./usePromiseTracker";

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
    case "reload": {
      return {
        ...state,
        loading: true,
        error: null,
        reloadCount: state.reloadCount + 1,
        callbacks: {
          successHandler: action.payload.onSuccess,
          errorHandler: action.payload.onError,
        },
      };
    }
    default:
      throw new Error();
  }
}

export function usePromiseResult1(dataProvider, initFetch = true) {
  const { loading, success, data, error, track } = usePromiseTracker(
    initFetch ? dataProvider() : null
  );

  const handleRetry = () => {
    track(dataProvider);
  };

  return {
    loading,
    success,
    data,
    error,
    retry: handleRetry,
  };
}

export function usePromiseResult(dataProvider, initFetch = true) {
  const [state, dispatch] = useReducer(reducer, {
    error: null,
    data: null,
    loading: initFetch,
    reloadCount: initFetch ? 1 : 0,
    callbacks: {
      successHandler: null,
    },
  });

  const isMounted = useIsMounted();

  useEffect(() => {
    if (!initFetch && state.reloadCount === 0) {
      return;
    }
    dataProvider()
      .then((data) => {
        if (isMounted) {
          state.callbacks.successHandler && state.callbacks.successHandler();
          dispatch({ type: "dataReceived", payload: { data } });
        }
      })
      .catch((error) => {
        if (isMounted) {
          state.callbacks.errorHandler && state.callbacks.errorHandler();
          dispatch({ type: "errorOccured", payload: { error } });
        }
      });
    // we only want to trigger this effect only user specifically call retry
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.reloadCount]);

  const handleReload = useCallback((options) => {
    const { onSuccess, onError } = options || {};
    dispatch({
      type: "reload",
      payload: {
        onSuccess,
        onError,
      },
    });
  }, []);

  return {
    loading: state.loading,
    data: state.data,
    error: state.error,
    success: !state.loading && !state.error,
    reloadCount: state.reloadCount,
    reload: handleReload,
  };
}
