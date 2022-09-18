import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { DesktopHeader } from '../../../src/features/common';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore({ user: {} })}>
    <Router>
      <DesktopHeader />
    </Router>
  </Provider>);
  expect(renderedComponent.find('.common-desktop-header-container').length).toBe(1);
});
