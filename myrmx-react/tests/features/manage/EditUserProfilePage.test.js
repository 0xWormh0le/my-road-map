import React from 'react';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { EditUserProfilePage } from '../../../src/features/manage';

const middlewares = [thunk];

const mockStore = configureStore(middlewares);

const store = {
  user: {
    user: { }
  },
  dashboard: {
    assignedUsers: {
      results: [{
        id: 1,
        first_name: '',
        last_name: '',
        cohort: [],
        roadmaps_info: [],
        coach: [],
        groups: [],
        is_approved: false
      }]
    }
  },
  manage: {
    cohorts: { results: [] }
  }
}

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore(store)}>
      <Router initialEntries={['manage/user/1/edit-profile']}>
        <Route path='manage/user/:userId'>
          <EditUserProfilePage />
        </Route>
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.manage-edit-user-profile-page').length).toBe(1);
});
