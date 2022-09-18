import React from 'react';
import { GroupsPage } from '../../../src/features/manage';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];

const mockStore = configureStore(middlewares);

const store = {
  manage: {
    cohorts: {
      results: []
    }
  }
}

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore(store)}>
      <Router>
        <GroupsPage />
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.manage-groups-page').length).toBe(1);
});
