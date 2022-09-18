import React from 'react';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { DefaultPage } from '../../../src/features/notifications';

const middlewares = [thunk];

const mockStore = configureStore(middlewares);

const store = {
  common: {},
  notifications: { notifications: { results: [] } },
  user: {} 
}

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore(store)}>
    <Router>
      <DefaultPage />
    </Router>
  </Provider>);
  expect(renderedComponent.find('.notifications-default-page').length).toBe(1);
});
