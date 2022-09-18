import React from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { RenameStagePage } from '../../../src/features/manage';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore({roadmap: {}, manage: {}})}>
      <Router initialEntries={['/manage/roadmaps/1/stages/1/rename']}>
        <RenameStagePage />
      </Router>  
    </Provider>
  );
  expect(renderedComponent.find('.manage-rename-stage-page').length).toBe(1);
});
