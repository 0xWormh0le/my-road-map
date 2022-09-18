import { useEffect, useRef } from 'react';

const useTimeout = (callback, timeout) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (timeout) {
      const id = setTimeout(callback, timeout);
      return () => clearTimeout(id);
    }
  }, [callback, timeout]);
};

export default useTimeout;
