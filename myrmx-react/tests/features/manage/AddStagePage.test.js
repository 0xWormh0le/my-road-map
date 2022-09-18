import React from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AddStagePage } from '../../../src/features/manage';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore({manage: {}})}>
      <Router initialEntries={['/manage/roadmaps/1/stages/add']}>
        <AddStagePage />
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.manage-add-stage-page').length).toBe(1);
});
