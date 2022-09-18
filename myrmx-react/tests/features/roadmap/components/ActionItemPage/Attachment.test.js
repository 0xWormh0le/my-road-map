import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Attachment } from '../../../../../src/features/roadmap';

const mockStore = configureStore();
  it('renders node with correct class name', () => {
    const renderedComponent = mount(<Provider store={mockStore({ roadmap: {} })}>
    <Attachment />
  </Provider>);

  expect(renderedComponent.find('.roadmap-components-action-item-page-attachment').length).toBe(1);
});
