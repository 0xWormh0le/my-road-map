import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { ActionItemPage } from '../../../src/features/roadmap';

const mockStore = configureStore([thunk]);

const state = {
  common: {},
  user: {
    user: {
      groups: []
    }
  },
  roadmap: {
    actionItems: {
      1: {
        resolutions: [],
        attachments: []
      },
    }
  }
}

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore(state)}>
      <Router initialEntries={['roadmap/1/stage/1/competency/1/action-item/1']}>
        <Route path='roadmap/:roadmapId/stage/:stageId/competency/:competencyId/action-item/:actionItemId'>
          <ActionItemPage />
        </Route>
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.roadmap-action-item-page').length).toBe(1);
});
