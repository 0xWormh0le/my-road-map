import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { UserNotApproved } from '../../../src/features/common';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore({ home: { userApproved: false } })}>
      <Router>
        <UserNotApproved />
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.common-user-not-approved').length).toBe(1);
});
