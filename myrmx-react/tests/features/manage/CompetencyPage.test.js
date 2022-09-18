import React from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CompetencyPage } from '../../../src/features/manage';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore({manage: {}, roadmap: { actionItems: {} }, user: {}})}>
      <Router initialEntries={['/manage/roadmaps/1/stages/1/competencies/1/questions/add']}>
        <CompetencyPage />
      </Router>
    </Provider>
    );
  expect(renderedComponent.find('.manage-competency-page').length).toBe(1);
});
