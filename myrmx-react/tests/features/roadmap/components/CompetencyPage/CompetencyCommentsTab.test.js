import React from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import CompetencyCommentsTab from '../../../../../src/features/roadmap/components/CompetencyPage/CompetencyCommentsTab';

const middlewares = [thunk];

const mockStore = configureStore(middlewares);

it('renders node with correct class name', () => {
  const store = {
    roadmap: {
      addCompetenncyCommentPending: false
    },
    notifications: {
      markCommentsReadingPending :false
    }
  }
  const renderedComponent = mount(
    <Provider store={mockStore(store)}>
      <CompetencyCommentsTab />
    </Provider>  
  );
  expect(renderedComponent.find('.roadmap-components-competency-page-competency-comments-tab').length).toBe(1);
});
