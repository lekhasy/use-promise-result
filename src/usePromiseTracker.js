import { useCallback, useEffect, useReducer } from "react";
import { useIsMounted } from "./useIsMounted";

const actionTypes = {
  initiateTrack: "initiateTrack",
  loadSuccess: "loadSuccess",
  loadFail: "loadFail",
};

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.initiateTrack: {
      return {
        ...state,
        loading: true,
        error: null,
        data: null,
        currentPromiseId: state.currentPromiseId + 1,
      };
    }
    case actionTypes.loadSuccess: {
      if (state.currentPromiseId !== action.payload.promiseId) {
        return state;
      }

      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload.data,
      };
    }
    case actionTypes.loadFail: {
      if (state.currentPromiseId !== action.payload.promiseId) {
        return state;
      }

      return {
        ...state,
        loading: false,
        error: action.payload.error,
        data: null,
      };
    }
  }
}

export function usePromiseTracker(initialPromise) {
  const [state, dispatch] = useReducer(reducer, {
    error: null,
    data: null,
    loading: !!initialPromise,
    currentPromiseId: initialPromise ? 1 : 0,
  });

  const isMounted = useIsMounted();

  const handleTrack = useCallback(
    (promise, isInitialPromise) => {
      if (!isInitialPromise) {
        dispatch({ type: actionTypes.initiateTrack });
      }

      const currentPromiseId = isInitialPromise
        ? state.currentPromiseId
        : state.currentPromiseId + 1;

      promise
        .then((data) => {
          if (!isMounted.current) {
            return;
          }

          dispatch({
            type: actionTypes.loadSuccess,
            payload: {
              promiseId: currentPromiseId,
              data,
            },
          });
        })
        .catch((ex) => {
          if (!isMounted.current) {
            return;
          }
          dispatch({
            type: actionTypes.loadFail,
            payload: {
              error: ex,
              promiseId: currentPromiseId,
            },
          });
        });
    },
    [state.currentPromiseId]
  );

  useEffect(() => {
    if (initialPromise) {
      // because all states is already set correctly on init, so there are no need to fire initiate action again
      // firing initiate action again will cause result of this hook change
      handleTrack(initialPromise, true);
    }
  }, []);

  return {
    loading: state.loading,
    data: state.data,
    error: state.error,
    success: state.currentPromiseId !== 0 && !state.loading && !state.error,
    track: handleTrack,
    tracking: state.currentPromiseId !== 0,
  };
}
