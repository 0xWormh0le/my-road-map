import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { NotePage } from '../../../src/features/roadmap';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore({ roadmap: {}, user: {} })}>
      <Router>
        <NotePage />
      </Router>
    </Provider>  
  );
  expect(renderedComponent.find('.roadmap-note-page').length).toBe(1);
});
