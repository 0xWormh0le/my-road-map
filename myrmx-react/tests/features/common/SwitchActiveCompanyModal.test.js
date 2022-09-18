import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { SwitchActiveCompanyModal } from '../../../src/features/common';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore({ user: {} })}>
    <SwitchActiveCompanyModal />
  </Provider>);
  expect(renderedComponent.find('.common-switch-active-company-modal').length).toBe(1);
});
