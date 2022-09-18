import React from 'react';
import { MemoryRouter as Route } from 'react-router-dom';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { EditRoadmapPage } from '../../../src/features/manage';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

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
  manage: {
    
  }
}
it('renders node with correct class name', () => {
  const renderedComponent = mount(
  <Provider store={mockStore(store)}>
    <Route path={['manage/roadmaps/:roadmapId']}>
      <EditRoadmapPage />
    </Route>
  </Provider>);
  expect(renderedComponent.find('.manage-edit-roadmap-page').length).toBe(1);
});
