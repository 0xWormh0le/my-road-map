import { useRef, useEffect } from 'react';

const useInterval = (callback, delay, executeImmediately = false) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      if (executeImmediately) tick();
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [executeImmediately, delay]);
};

export default useInterval;
