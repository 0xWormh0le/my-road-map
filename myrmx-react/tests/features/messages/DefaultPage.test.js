import React from 'react';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import AgoraRTM from 'agora-rtm-sdk';
import { AgoraClientContext, AgoraGroupChatUpdatesChannelContext } from '../../../src/features/common/agoraHelpers';
import { DefaultPage } from '../../../src/features/messages';

const middlewares = [thunk];

const mockStore = configureStore(middlewares);

const store = {
  common: {
    updates: {}
  },
  messages: {
    conversations: {
      results: []
    }
  },
  notifications: {},
  home: {
    authToken: 'token',
    userApproved: true
  },
  user: {
    user: {
      username: '',
      groups: [],
      first_name: '',
      last_name: '',
      all_companies: [],
      features: {}
    }
  }
}

const agoraAppId = '53285ba263cd4f13b807920bd1a95a95'
const agoraClient = AgoraRTM.createInstance(agoraAppId)
const agoraChannel = agoraClient.createChannel("foo")

it('renders node with correct class name', () => {
  const renderedComponent = mount(
    <Provider store={mockStore(store)}>
      <Router initialEntries={['']}>
        <Route path=''>
          <AgoraClientContext.Provider value={agoraClient}>
            <AgoraGroupChatUpdatesChannelContext.Provider value={agoraChannel}>
              <DefaultPage />
            </AgoraGroupChatUpdatesChannelContext.Provider>
          </AgoraClientContext.Provider>
        </Route>
      </Router>
    </Provider>
  );
  expect(renderedComponent.find('.messages-default-page').length).toBe(1);
});
