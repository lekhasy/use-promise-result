import { useEffect, useRef } from "react";

// https://stackoverflow.com/questions/49906437/how-to-cancel-a-fetch-on-componentwillunmount
export function useIsMounted() {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted; // returning "isMounted.current" wouldn't work because we would return unmutable primitive
}
