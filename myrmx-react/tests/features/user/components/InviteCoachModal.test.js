import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { InviteCoachModal } from '../../../../src/features/user';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore({ user: {} })}>
    <InviteCoachModal />
  </Provider>);
  // Length is two because there are 2 similar items - for mobile & desktop
  expect(renderedComponent.find('.user-components-invite-coach-modal').length).toBe(2);
});
