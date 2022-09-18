import React from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AdminPage } from '../../../src/features/dashboard';

const middlewares = [thunk];

const mockStore = configureStore(middlewares);

it('renders node with correct class name', () => {
  const store = {
    user: {
      user: {
        groups: [],
        features: {},
      }
    },
    dashboard: {
      assignedUsers: {
        results: []
      }
    },
    manage: {}
  }
  const renderedComponent = mount(
    <Provider store={mockStore(store)}>
      <Router>
        <AdminPage />
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.dashboard-admin-page').length).toBeGreaterThan(1);
});
