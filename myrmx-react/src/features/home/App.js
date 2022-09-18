import React, { useEffect, useCallback, useState } from 'react';
import clsx from 'clsx';
import Toast from 'react-bootstrap/Toast';
import _some from 'lodash/some';

import useInterval from '../common/useIntervalHook';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import { useFetchUpdates, useSetUnreadMessages, useUpdateUnreadMessages } from '../common/redux/hooks';
import { useAgoraClient, AgoraClientContext, AgoraGroupChatUpdatesChannelContext } from '../common/agoraHelpers';
// import config from '../../common/config';

import { useFetchAuthToken } from './redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import { useFetchGroupChats } from '../messages/redux/fetchGroupChats';
// import { usePushManager } from '../common/usePushManager';

export default function App({ children }) {
  const [ unreadMessagesCountFetched, setUnreadMessagesCountFetched ] = useState(false);
  const [ showAgoraNetworkErrorsToast, setShowAgoraNetworkErrorsToast ] = useState(false);
  const [ groupChatUpdatesAgoraChannel, setGroupChatUpdatesAgoraChannel ] = useState(undefined);
  const [ currentUserChatIds, setCurrentUserChatIds ] = useState([]);

  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const { updates, fetchUpdates } = useFetchUpdates();
  const { authToken, userApproved } = useFetchAuthToken();
  const { updateUnreadMessages } = useUpdateUnreadMessages();
  const { user, fetchUser } = useFetchUser();
  const { setUnreadMessages } = useSetUnreadMessages();
  const { fetchGroupChats } = useFetchGroupChats();
  // TODO: Restore theme detection when other themes will be ready
  // const { defaultTheme } = usePrivateLabelledSettings();
  
  // const { registerWebPushDevice } = usePushManager();

  useEffect(() => {
    if (authToken) {
      fetchUser().catch(unauthorizedErrorHandler);
    }
  }, [authToken, fetchUser, unauthorizedErrorHandler]);

  useEffect(() => {
    if (authToken) {
      document.cookie = `authtoken=${authToken};path=/;secure`;
    } else {
      document.cookie = 'authtoken=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }, [authToken]);

  const fetchUpdatesCallback = useCallback(() => {
    if (authToken && userApproved) {
      fetchUpdates().catch(unauthorizedErrorHandler);
    }
  }, [authToken, userApproved, fetchUpdates, unauthorizedErrorHandler]);

  // TODO: Ideally this should be a websocket-based real-time updates fetching
  // However currently we give up low latency for ease of implementation & deployment
  useInterval(fetchUpdatesCallback, 15 * 1000, true); // Every 15 seconds

  // This effect is only needed for one time unread messages count initialization
  useEffect(() => {
    if (unreadMessagesCountFetched || !updates.unread_messages_count) return;
    setUnreadMessages(updates.unread_messages_count);
    setUnreadMessagesCountFetched(true);
  }, [
    unreadMessagesCountFetched,
    updates.unread_messages_count,
    setUnreadMessages,
    setUnreadMessagesCountFetched,
  ]);

  const incrementMessagesCount = useCallback(() => {
    return updateUnreadMessages(1);
  }, [ updateUnreadMessages ]);

  // const agoraNetworkErrorHandler = useCallback(
  //   () => setShowAgoraNetworkErrorsToast(true),
  //   [ setShowAgoraNetworkErrorsToast ],
  // );

  const userIsAuthenticatedAndApproved = user && userApproved && authToken;
  // TODO: Find a better way to detect Agora networking issues
  // const { agoraClient } = useAgoraClient(userIsAuthenticatedAndApproved ? user.username : undefined, agoraNetworkErrorHandler);
  const { agoraClient } = useAgoraClient(userIsAuthenticatedAndApproved ? user.username : undefined);

  useEffect(() => {
    if (!agoraClient) return;
    agoraClient.on('MessageFromPeer', incrementMessagesCount);
    return () => agoraClient.off('MessageFromPeer', incrementMessagesCount);
  }, [ agoraClient, incrementMessagesCount ]);

  useEffect(() => {
    if (userIsAuthenticatedAndApproved) {
      fetchGroupChats().catch(unauthorizedErrorHandler).then(res => {
        setCurrentUserChatIds(res.results.map(c => c.id));
      });
    } else {
      setCurrentUserChatIds([]);
    }
  }, [ userIsAuthenticatedAndApproved, fetchGroupChats, unauthorizedErrorHandler ]);

  const groupChatUpdatesChannelMessageHandler = useCallback(function({ text }) {
    const jsonUpdate = JSON.parse(text);
    if (jsonUpdate.action === "new-group-chat") {
      // Current user isn't a participant of the new chat, ignore it
      if (!_some(jsonUpdate.participants, p => p.id === user.id)) return;
      incrementMessagesCount();
      setCurrentUserChatIds(cids => {
        return cids.indexOf(jsonUpdate.id) < 0 ? [...cids, jsonUpdate.id] : cids;
      });
    } else if (jsonUpdate.action === "new-message-in-group-chat") {
      // Current user isn't a participant of the chat new message was sent to, ignore it
      if (currentUserChatIds.indexOf(jsonUpdate.chatId) < 0) return;
      incrementMessagesCount();
    }
  }, [ user, incrementMessagesCount, currentUserChatIds ]);

  useEffect(() => {
    if (!agoraClient) return;
    const channel = agoraClient.createChannel("group-chat-updates");
    channel.join().then(() => setGroupChatUpdatesAgoraChannel(channel));
    return () => setGroupChatUpdatesAgoraChannel(undefined);
  }, [ agoraClient ]);

  useEffect(() => {
    if (!groupChatUpdatesAgoraChannel) return;
    const channel = groupChatUpdatesAgoraChannel;
    channel.on('ChannelMessage', groupChatUpdatesChannelMessageHandler);
    return () => channel.off('ChannelMessage', groupChatUpdatesChannelMessageHandler);
  }, [ groupChatUpdatesAgoraChannel, groupChatUpdatesChannelMessageHandler ]);

  // TODO: Restore theme detection when other themes will be ready
  // const theme = useMemo(() => {
  //   if (user && user.theme) {
  //     return user.theme
  //   } else if (user && user.default_theme) {
  //     return user.default_theme
  //   } else if (defaultTheme) {
  //     return defaultTheme
  //   } else {
  //     return 'light'
  //   }
  // }, [user, defaultTheme])
  const theme = 'light';

  return (
    <div className="home-app">
      <div className="toast-container">
        <Toast
          onClose={() => setShowAgoraNetworkErrorsToast(false)}
          show={showAgoraNetworkErrorsToast}
          delay={7000}
          autohide
        >
          <Toast.Header>
            <strong className="mr-auto text-danger">Error</strong>
          </Toast.Header>
          <Toast.Body>
            Your network connection is unstable. You may experience issues with chat messaging.
          </Toast.Body>
        </Toast>
      </div>
      <AgoraClientContext.Provider value={agoraClient}>
        <AgoraGroupChatUpdatesChannelContext.Provider value={groupChatUpdatesAgoraChannel}>
          {/* {config.displayStageEnvBanner && (
            <div className="stage-env-banner">
              WARNING! You're using staging or development environment.
            </div>
          )} */}
          <div className={clsx("page-container", theme)}>{children}</div>
        </AgoraGroupChatUpdatesChannelContext.Provider>
      </AgoraClientContext.Provider>
    </div>
  );
}
