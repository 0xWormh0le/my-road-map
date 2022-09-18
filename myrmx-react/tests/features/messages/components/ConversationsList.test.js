import React from 'react';
import { shallow } from 'enzyme';

import { ConversationsList } from '../../../../src/features/messages';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(
    <ConversationsList
      peerMessages={{}}
    />
  );
  expect(renderedComponent.find('.messages-components-conversations-list').length).toBe(1);
});
