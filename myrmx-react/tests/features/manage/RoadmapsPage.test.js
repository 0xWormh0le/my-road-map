import React from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import { RoadmapsPage } from '../../../src/features/manage';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore({dashboard: {}, manage: {}, user: {}})}>
      <Router initialEntries={['/manage/roadmaps']}>
        <RoadmapsPage />
      </Router>
    </Provider>
  );

  expect(renderedComponent.find('.manage-roadmaps-page').length).toBe(1);
});
