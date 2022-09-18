import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { ForgotPasswordPage } from '../../../src/features/home';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore({ home: {} })}>
    <Router>
      <ForgotPasswordPage />
    </Router>
  </Provider>);
  expect(renderedComponent.find('.home-forgot-password-page').length).toBe(1);
});
