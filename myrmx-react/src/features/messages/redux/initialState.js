// Initial state is the place you define all initial values for the Redux store of the feature.
// In the 'standard' way, initialState is defined in reducers: http://redux.js.org/docs/basics/Reducers.html
// But when application grows, there will be multiple reducers files, it's not intuitive what data is managed by the whole store.
// So Rekit extracts the initial state definition into a separate module so that you can have
// a quick view about what data is used for the feature, at any time.

// NOTE: initialState constant is necessary so that Rekit could auto add initial state when creating async actions.
const initialState = {
  conversations: undefined,
  conversationMessages: {},
  recipients: undefined,
  groupChats: undefined,
  groupChatMessages: {},
  fetchRecipientsPending: false,
  fetchRecipientsError: null,
  createUpdatePeerLastReadMessageTimestampPending: false,
  createUpdatePeerLastReadMessageTimestampError: null,
  createPeerToPeerMessagePending: false,
  createPeerToPeerMessageError: null,
  fetchConversationsPending: false,
  fetchConversationsError: null,
  fetchConversationMessagesPending: false,
  fetchConversationMessagesError: null,
  fetchGroupChatsPending: false,
  fetchGroupChatsError: null,
  fetchGroupChatMessagesPending: false,
  fetchGroupChatMessagesError: null,
  createGroupChatMessagePending: false,
  createGroupChatMessageError: null,
  createGroupChatPending: false,
  createGroupChatError: null,
  createUpdateGroupLastReadMessageTimestampPending: false,
  createUpdateGroupLastReadMessageTimestampError: null,
  deletePeerToPeerMessagePending: false,
  deletePeerToPeerMessageError: null,
  deleteGroupChatMessagePending: false,
  deleteGroupChatMessageError: null,
};

export default initialState;
