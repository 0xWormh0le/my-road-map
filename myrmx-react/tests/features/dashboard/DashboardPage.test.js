import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';

import { DashboardPage } from '../../../src/features/dashboard';

const middlewares = [thunk];

const mockStore = configureStore(middlewares);

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore({ user: {} })}>
      <Router>
        <DashboardPage />
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.dashboard-dashboard-page').length).toBe(1);
});
