import React from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { EditAssignedCoachesPage } from '../../../src/features/roadmap';

const middlewares = [thunk];

const mockStore = configureStore(middlewares);

const store = {
  common: {},
  dashboard: {},
  user: { user: {} },
  roadmap: {
    roadmaps: {
      1: {}
    }
  }
}

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore(store)}>
      <Router initialEntries={['roadmap/1/edit-assigned-coaches']}>
        <Route path='roadmap/:roadmapId/edit-assigned-coaches'>
          <EditAssignedCoachesPage />
        </Route>
      </Router>
    </Provider>
  );

  expect(renderedComponent.find('.roadmap-edit-assigned-coaches-page').length).toBe(1);
});
