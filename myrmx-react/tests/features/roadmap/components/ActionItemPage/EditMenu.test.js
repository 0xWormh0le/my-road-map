import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { EditMenu } from '../../../../../src/features/roadmap';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore({ roadmap: {} })}>
    <EditMenu />
  </Provider>);
  expect(renderedComponent.find('.roadmap-components-action-item-page-edit-menu').length).toBe(1);
});
