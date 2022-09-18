import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { CompetencyLearnTab } from '../../../../../src/features/roadmap';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore({ roadmap: {}, manage: {} })}>
      <Router initialEntries={['roadmap/1/stage/1/competency/1']}>
        <Route path='roadmap/1/stage/1/competency/1'>
          <CompetencyLearnTab competency={{ action_item_ids: [], attachments: [] }} user={{ groups: [], features: {} }} />
        </Route>
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.roadmap-components-competency-page-competency-learn-tab').length).toBe(1);
});
