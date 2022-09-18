import React from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { UserPage } from '../../../src/features/manage';

const middlewares = [thunk];

const mockStore = configureStore(middlewares);

it('renders node with correct class name', () => {
  const store = {
    user: {
      user: {
        groups: [],
        features: {},
      }
    },
    dashboard: {
      assignedUsers: {
        results: [
          {
            id: 1,
            cohort: [],
            groups: [],
            email: '',
            first_name: '',
            last_name: '',
            phone_number: '',
            bio: '',
            date_joined: '',
            is_active: false,
            coach: [],
            roadmaps_info: []
          }
        ]
      }
    }
  }

  const renderedComponent = mount(
    <Provider store={mockStore(store)}>
      <Router initialEntries={['manage/user/1']}>
        <Route path='manage/user/:userId'>
          <UserPage />
        </Route>
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.manage-user-page').length).toBe(1);
});
