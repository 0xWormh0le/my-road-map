import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import { UserPage } from '../../../src/features/user';

const mockStore = configureStore();

const store = {
  home: {},
  user: {
    user: {
      groups: [],
      first_name: '',
      last_name: '',
      all_companies: [],
      features: {}
    }
  }
}

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore(store)}>
      <Router initialEntries={['user']}>
        <Route path='user'>
          <UserPage />
        </Route>
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.user-user-page').length).toBe(1);
});