import { useEffect, useRef } from 'react'

const windowScrollEnd = direction => {
  if (direction === 'scrolldown') {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight
  } else if (direction === 'scrollup') {
    return window.scrollY === 0
  } else {
    return false
  }
}

const elementScrollEnd = (element, direction) => {
  if (direction === 'scrolldown') {
    return element.clientHeight + element.scrollTop >= element.scrollHeight;
  } else if (direction === 'scrollup') {
    return element.scrollTop === 0
  } else {
    return false
  }
}

export default ({
  scrollDirection = 'scrolldown',
  fetchAction,
  actionArgs = {},
  requestNextPage,
  scrollRef,
}) => {
  const page = useRef(0)

  const handleScroll = useRef(null)

  useEffect(() => {
    const scrollEventSource = scrollRef || window;

    if (handleScroll.current) {
      scrollEventSource.removeEventListener('scroll', handleScroll.current)
    }

    handleScroll.current = e => {
      const scrollEnd = scrollRef ? elementScrollEnd(scrollRef, scrollDirection) : windowScrollEnd(scrollDirection);
      if (scrollEnd && requestNextPage()) {
        fetchAction({ ...actionArgs, page: page.current + 1, }).then(() => page.current = page.current + 1)
      }
    }

    scrollEventSource.addEventListener('scroll', handleScroll.current)
    
    return () => scrollEventSource.removeEventListener('scroll', handleScroll.current)
  }, [
    scrollDirection,
    fetchAction,
    actionArgs,
    requestNextPage,
    scrollRef,
  ])

  return {
    resetPage: () => page.current = 0
  }
}
