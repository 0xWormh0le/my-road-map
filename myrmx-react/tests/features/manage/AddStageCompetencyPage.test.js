import React from 'react';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AddStageCompetencyPage } from '../../../src/features/manage';

const mockStore = configureStore([thunk]);

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore({manage: {}})}>
      <Router initialEntries={['roadmaps/1/stages/1']}>
        <Route path='roadmaps/:roadmapId/stages/:stageId'>
          <AddStageCompetencyPage />
        </Route>
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.manage-add-stage-competency-page').length).toBe(1);
});
