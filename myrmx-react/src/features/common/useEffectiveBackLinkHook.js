import { useLocation } from 'react-router-dom';

function useEffectiveBackLink(defaultBackLink) {
  const location = useLocation();

  return location.state?.backLink || defaultBackLink;
}

export default useEffectiveBackLink;
