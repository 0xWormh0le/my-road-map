import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { AnswerPage } from '../../../src/features/roadmap';

const mockStore = configureStore([thunk]);

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore({user: {}, manage: {}, roadmap: {}})}>
      <Router initialEntries={['roadmap/1/stage/1/competency/1/question/1/answer/1']}>
        <Route path='roadmap/:roadmapId/stage/:stageId/competency/:competencyId/question/:questionId/answer/1'>
          <AnswerPage />
        </Route>
      </Router>
    </Provider>
  
  );
  expect(renderedComponent.find('.roadmap-answer-page').length).toBe(1);
});
