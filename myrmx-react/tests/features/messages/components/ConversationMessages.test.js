import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { ConversationMessages } from '../../../../src/features/messages';

const mockStore = configureStore();

it('renders node with correct class name', () => {
  const renderedComponent = mount(<Provider store={mockStore({
    messages: { conversationMessages: {} }
  })}>
    <ConversationMessages
      messages={[]}
      peerUser={{}}
    />
  </Provider>);
  expect(renderedComponent.find('.messages-components-conversation-messages').length).toBe(1);
});
