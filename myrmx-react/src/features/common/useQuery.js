import { useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default () => {
  const location = useLocation()
  const query = useRef(new URLSearchParams(location.search))
  
  return query.current
}
