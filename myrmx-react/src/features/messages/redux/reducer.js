// This is the root reducer of the feature. It is used for:
//   1. Load reducers from each action in the feature and process them one by one.
//      Note that this part of code is mainly maintained by Rekit, you usually don't need to edit them.
//   2. Write cross-topic reducers. If a reducer is not bound to some specific action.
//      Then it could be written here.
// Learn more from the introduction of this approach:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da.

import initialState from './initialState';
import { reducer as fetchRecipientsReducer } from './fetchRecipients';
import { reducer as createUpdatePeerLastReadMessageTimestampReducer } from './createUpdatePeerLastReadMessageTimestamp';
import { reducer as createPeerToPeerMessageReducer } from './createPeerToPeerMessage';
import { reducer as fetchConversationsReducer } from './fetchConversations';
import { reducer as fetchConversationMessagesReducer } from './fetchConversationMessages';
import { reducer as fetchGroupChatsReducer } from './fetchGroupChats';
import { reducer as fetchGroupChatMessagesReducer } from './fetchGroupChatMessages';
import { reducer as createGroupChatMessageReducer } from './createGroupChatMessage';
import { reducer as createGroupChatReducer } from './createGroupChat';
import { reducer as editGroupChatReducer } from './editGroupChat';
import { reducer as createUpdateGroupLastReadMessageTimestampReducer } from './createUpdateGroupLastReadMessageTimestamp';
import { reducer as deletePeerToPeerMessageReducer } from './deletePeerToPeerMessage';
import { reducer as deleteGroupChatMessageReducer } from './deleteGroupChatMessage';

const reducers = [
  fetchRecipientsReducer,
  createUpdatePeerLastReadMessageTimestampReducer,
  createPeerToPeerMessageReducer,
  fetchConversationsReducer,
  fetchConversationMessagesReducer,
  fetchGroupChatsReducer,
  fetchGroupChatMessagesReducer,
  createGroupChatMessageReducer,
  createGroupChatReducer,
  editGroupChatReducer,
  createUpdateGroupLastReadMessageTimestampReducer,
  deletePeerToPeerMessageReducer,
  deleteGroupChatMessageReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
