import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { LogInPage } from '../../../src/features/home';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore({ home: {} })}>
    <Router>
      <LogInPage />
    </Router>
  </Provider>);
  expect(renderedComponent.find('.home-log-in-page').length).toBe(1);
});
