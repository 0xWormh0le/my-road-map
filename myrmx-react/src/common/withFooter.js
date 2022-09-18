import React, { useMemo, useCallback } from 'react'
import { useLocation } from 'react-router-dom';
import { BottomNav, appSections } from '../features/common';

export default Page => props => {
  const location = useLocation()

  const getActiveSection = useCallback(pathname => {
    if (pathname.startsWith('/messages')) {
      return appSections.messages
    } else if (pathname.startsWith('/common')) {
      return appSections.menu
    } else if (pathname.startsWith('/user')) {
      return appSections.menu
    } else if (pathname.startsWith('/notifications')) {
      return appSections.notifications
    } else {
      return appSections.home
    }
  }, [])

  const active = useMemo(() => {
    const { pathname, state } = location
    if (pathname.startsWith('/user-not-approved')) {
      if (state && state.pathname) {
        return getActiveSection(state.pathname)
      }
    } else {
      return getActiveSection(pathname)
    }
  }, [location, getActiveSection])

  return (
    <>
      <Page {...props} />
      <div className="d-lg-none" style={{ height: '3.5em' }} />
      <BottomNav activeSection={active} />
    </>
  )
}
