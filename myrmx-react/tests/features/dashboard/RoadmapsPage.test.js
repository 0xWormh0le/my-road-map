import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { MemoryRouter as Router } from 'react-router';

import { RoadmapsPage } from '../../../src/features/dashboard';

const mockStore = configureStore([thunk]);

const store = {
  home: {
    authToken: ''
  },
  common: {},
  dashboard: { roadmaps: { results: [] } },
  user: {
    user: {
      all_companies: [],
      features: {}
    }
  }
}

describe('dashboard/RoadmapsPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      dashboard: {},
      actions: {},
    };
    const renderedComponent = mount(
      <Provider store={mockStore(store)}>
        <Router>
          <RoadmapsPage {...props} />
        </Router>
      </Provider>
    );

    expect(
      renderedComponent.find('.dashboard-roadmaps-page').length
    ).toBe(1);
  });
});
