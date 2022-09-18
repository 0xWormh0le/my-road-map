import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';

import { ProfileView } from '../../../../src/features/user';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore({ home: {}, user: {} })}>
      <Router>
        <ProfileView user={{ groups: [], cohort: [] }} />
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.user-components-profile-view').length).toBe(1);
});
