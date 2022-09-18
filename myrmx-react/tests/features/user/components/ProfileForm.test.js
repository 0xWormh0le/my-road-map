import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';

import { ProfileForm } from '../../../../src/features/user';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore({ user: {} })}>
    <Router>
      <ProfileForm user={{ first_name: 'foo', last_name: 'bar', features: {} }} />
    </Router>
  </Provider>);
  expect(renderedComponent.find('.user-components-profile-form').length).toBe(1);
});
