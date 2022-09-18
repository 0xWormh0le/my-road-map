import { useEffect, useRef, useState } from 'react';

function useFocusedInput() {
  const formInputRef = useRef();
  const [ inputFocused, setInputFocused ] = useState(false);

  useEffect(() => {
    const isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf('CriOS') === -1 &&
      navigator.userAgent.indexOf('FxiOS') === -1;
    if (!isSafari) return;
    const formInputRefCurrent = formInputRef.current;
    if (!formInputRefCurrent) return;
    const handleFocus = () => setInputFocused(true);
    const handleBlur = () => setInputFocused(false);
    formInputRefCurrent.addEventListener('focus', handleFocus);
    formInputRefCurrent.addEventListener('blur', handleBlur);
    return () => {
      formInputRefCurrent.removeEventListener('focus', handleFocus);
      formInputRefCurrent.removeEventListener('blur', handleBlur);
    };
  }, [formInputRef]);

  return { formInputRef, inputFocused };
}

export default useFocusedInput;
