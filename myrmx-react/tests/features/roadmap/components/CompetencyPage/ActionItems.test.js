import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';

import { ActionItems } from '../../../../../src/features/roadmap';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore({ roadmap: {}, user: {} })}>
    <Router>
      <ActionItems actionItems={[]} competency={{}} />
    </Router>
  </Provider>);
  expect(renderedComponent.find('.action-item-container').length).toBe(1);
});
