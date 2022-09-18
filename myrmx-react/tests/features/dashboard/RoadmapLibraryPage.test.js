import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';

import { RoadmapLibraryPage } from '../../../src/features/dashboard';

const mockStore = configureStore();

const store = {
  common: {},
  dashboard: {},
  user: {},
  manage: {
    userRoadmaps: {}
  }
}

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore(store)}>
    <Router>
      <RoadmapLibraryPage />
    </Router>
  </Provider>);
  expect(renderedComponent.find('.dashboard-roadmap-library-page').length).toBe(1);
});
