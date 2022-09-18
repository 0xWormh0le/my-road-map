import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import { MemoryRouter as Router } from 'react-router-dom';

import { ProfilePage } from '../../../src/features/user';

const mockStore = configureStore([thunk]);

const store = {
  home: {},
  user: {
    user: {
      groups: [],
      cohort: [],
      first_name: '',
      last_name: ''
    }
  }
}

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore(store)}>
    <Router>
      <ProfilePage />
    </Router>
  </Provider>);
  expect(renderedComponent.find('.user-profile-page').length).toBe(1);
});
