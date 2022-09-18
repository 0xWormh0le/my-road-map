import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { DeliveryTypeNotificationsSettingsPage } from '../../../src/features/user';

const mockStore = configureStore();
const store = { user: { notificationsSettings: [] } };

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore(store)}>
    <Router>
      <DeliveryTypeNotificationsSettingsPage />
    </Router>
  </Provider>);
  expect(renderedComponent.find('.user-delivery-type-notifications-settings-page').length).toBe(1);
});
