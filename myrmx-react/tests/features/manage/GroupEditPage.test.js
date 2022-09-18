import React from 'react';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { GroupEditPage } from '../../../src/features/manage';

const middlewares = [thunk];

const mockStore = configureStore(middlewares);

const store = {
  manage: {
    cohorts: {
      results: [
        { id: 1 }
      ]
    }
  }
}

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore(store)}>
      <Router initialEntries={['manage/groups/add']}>
        <Route path='manage/groups/add'>
          <GroupEditPage />
        </Route>
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.manage-group-edit-page').length).toBe(1);
});
