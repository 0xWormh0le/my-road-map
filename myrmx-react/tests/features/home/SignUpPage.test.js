import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { SignUpPage } from '../../../src/features/home';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore({ home: {} })}>
    <Router>
      <SignUpPage />
    </Router>
  </Provider>);
  expect(renderedComponent.find('.home-sign-up-page').length).toBe(1);
});
