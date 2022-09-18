import React from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AcceptCoachInvitePage } from '../../../src/features/home';

const middlewares = [thunk];

const mockStore = configureStore(middlewares);

const store = {
  home: {
    coachInvitation: {}
  }
}

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore(store)}>
      <Router initialEntries={['accept-coach-invite/22/sample-token']}>
        <Route path='accept-coach-invite/:uid/:token'>
          <AcceptCoachInvitePage />
        </Route>
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.home-accept-coach-invite-page').length).toBe(1);
});
