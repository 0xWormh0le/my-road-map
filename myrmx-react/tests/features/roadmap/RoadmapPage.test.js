import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { RoadmapPage } from '../../../src/features/roadmap';

const mockStore = configureStore([thunk]);

it('renders node with correct class name', () => {
  const store = {
    user: {
      user: {
        features: [],
        groups: []
      }
    },
    roadmap: {
      roadmaps: {
        1: {
          stage_ids: []
        }
      }
    },
    common: {},
    manage: {},
    dashboard: {
      assignedUsers: {}
    }
  }
  const renderedComponent = mount(
    <Provider store={mockStore(store)}>
      <Router initialEntries={['roadmap/1']}>
        <Route path='roadmap/:roadmapId'>
          <RoadmapPage />
        </Route>
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.roadmap-default-page').length).toBe(1);
});
