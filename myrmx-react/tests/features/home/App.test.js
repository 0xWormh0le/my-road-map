import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import { App } from '../../../src/features/home';

const mockStore = configureStore();

describe('home/App', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = mount(<Provider store={mockStore({ common: { updates: {} }, home: {}, user: {}, messages: {} })}>
      <Router>
        <App />
      </Router>
    </Provider>);

    expect(renderedComponent.find('.home-app').length).toBe(1);
  });
});
