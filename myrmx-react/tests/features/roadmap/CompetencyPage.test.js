import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { CompetencyPage } from '../../../src/features/roadmap';

const mockStore = configureStore([thunk]);

const store = {
  common: { updates: {} },
  dashboard: {
    assignedUsers: {}
  },
  manage: {},
  roadmap: {
    competencies: {
      1: {
        attachments: [],
        action_item_ids: []
      }
    }
  },
  user: { user: { groups: [], features: {} } }
}

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore(store)}>
      <Router initialEntries={['stage/1/competency/1']}>
        <Route path='stage/:stageId/competency/:competencyId'>
          <CompetencyPage />
        </Route>
      </Router>
    </Provider>
  );

  expect(
    renderedComponent.find('.roadmap-competency-page').length
  ).toBe(1);
});
