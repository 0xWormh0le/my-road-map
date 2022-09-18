import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { BottomNav } from '../../../src/features/common';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore({ common: {}, home: {} })}>
    <BottomNav />
  </Provider>);
  expect(renderedComponent.find('.common-bottom-nav').length).toBe(1);
});
