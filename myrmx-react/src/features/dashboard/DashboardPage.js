import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';

import { useFetchUser } from '../user/redux/hooks';
import { TabSelector } from '../common';

export default function DashboardPage({ children }) {
  const [tabs, setTabs] = useState([])
  
  const { user, replaceStringWithSynonyms } = useFetchUser();

  const location = useLocation()

  const history = useHistory()

  const [activeTab, setActiveTab] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  useEffect(() => {
    if (user && user.groups) {
      const tabs = []
      if (user.groups.includes('Admin')) {
        tabs.push({
          key: 'admin',
          label: 'Admin Dashboard',
          to: '/dashboard/admin'
        })
      }
      if (user.groups.includes('Coach')) {
        tabs.push({
          key: 'coach',
          label: replaceStringWithSynonyms('My Coaching'),
          to: '/dashboard/coach'
        })
      }
      if (user.groups.includes('User')) {
        tabs.push({
          key: 'my-roadmaps',
          label: 'My Roadmaps',
          to: '/dashboard/roadmaps'
        })
      }

      setTabs(tabs)

      setActiveTab(() => {
        const currentTab = tabs.findIndex(t => t.to === history.location.pathname)
        if (currentTab < 0) {
          return null
        } else {
          return tabs[currentTab].key
        }
      })

      if (history.location.pathname === '/dashboard/roadmap-library') {
        history.push('/dashboard/roadmap-library')
      } else if (!tabs.map(t => t.to).includes(history.location.pathname)) {
        history.push(tabs[0].to)
      }
    }
  }, [user, replaceStringWithSynonyms, history, history.location.pathname])

  return (
    <div className="dashboard-dashboard-page">
      {tabs.length > 1 && location.pathname !== '/dashboard/roadmap-library' && (
        <div className="tab-selector-container d-lg-none">
          <TabSelector
            className="dashboard-tab-selector"
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />
        </div>
      )}
      {children}
    </div>
  );
};

DashboardPage.propTypes = {};
DashboardPage.defaultProps = {};
