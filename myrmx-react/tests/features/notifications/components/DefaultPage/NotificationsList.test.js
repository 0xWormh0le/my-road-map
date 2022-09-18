import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { NotificationsList } from '../../../../../src/features/notifications';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore({
    common: {},
    notifications: {},
    user: {},
  })}>
    <Router>
      <NotificationsList notifications={{results: []}} />
    </Router>
  </Provider>);
  expect(renderedComponent.find('.notifications-components-default-page-notifications-list').length).toBe(1);
});
