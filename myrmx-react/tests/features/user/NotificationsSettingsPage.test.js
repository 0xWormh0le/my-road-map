import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { NotificationsSettingsPage } from '../../../src/features/user';
import { MemoryRouter as Router } from 'react-router';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore({ user: {} })}>
    <Router>
      <NotificationsSettingsPage />
    </Router>
  </Provider>);
  expect(renderedComponent.find('.user-notifications-settings-page').length).toBe(1);
});
