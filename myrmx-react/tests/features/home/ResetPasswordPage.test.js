import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { ResetPasswordPage } from '../../../src/features/home';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore({ home: {} })}>
    <Router>
      <ResetPasswordPage />
    </Router>
  </Provider>);
  expect(renderedComponent.find('.home-reset-password-page').length).toBe(1);
});
