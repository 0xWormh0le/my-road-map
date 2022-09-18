import React from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
  
import { AccountsPage } from '../../../src/features/manage';

const middlewares = [thunk];

const mockStore = configureStore(middlewares);

const store = {
  user: {},
  manage: {
    acccounts: {
      results: []
    }
  }
}
it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore(store)}>
      <Router initialEntries={['/manage/user/add-profile']}>
        <AccountsPage />
      </Router>
    </Provider>
  );
  
  expect(renderedComponent.find('.manage-accounts-page').length).toBe(1);
});
