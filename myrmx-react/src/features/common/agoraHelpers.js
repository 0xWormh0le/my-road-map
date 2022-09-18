import React, { useCallback, useEffect, useState } from 'react';
import AgoraRTM from 'agora-rtm-sdk';
import { useDispatch } from 'react-redux';

import config from '../../common/config';

import { clearAgoraRtmToken } from './redux/actions';
import { useFetchAgoraRtmToken } from './redux/fetchAgoraRtmToken';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';

const AgoraClientContext = React.createContext(undefined);

const AgoraGroupChatUpdatesChannelContext = React.createContext(undefined);

function useAgoraClient(uid, networkErrorHandler) {
  const [ agoraClient, setAgoraClient ] = useState(undefined);

  const dispatch = useDispatch();
  const { fetchAgoraRtmToken } = useFetchAgoraRtmToken();
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();

  const fetchAgoraRtmTokenHandlingErrors = useCallback(() => {
    return fetchAgoraRtmToken().catch(unauthorizedErrorHandler);
  }, [ fetchAgoraRtmToken, unauthorizedErrorHandler ]);

  useEffect(() => {
    var initializedClient = undefined;
    async function initAgoraClient() {
      if (!uid) return;
      const rtmToken = await fetchAgoraRtmTokenHandlingErrors();
      const client = AgoraRTM.createInstance(config.agoraAppId);
      client.on('ConnectionStateChanged', (newState, reason) => {
        console.log('on connection state changed to ' + newState + ' reason: ' + reason);
        if (newState === "RECONNECTING" && typeof networkErrorHandler === "function") {
          networkErrorHandler();
        }
      });
      try {
        await client.login({ token: rtmToken, uid });
      } catch (err) {
        console.log('AgoraRTM client login failure', err);
        return;
      }
      console.log('AgoraRTM client login success');
      initializedClient = client;
      setAgoraClient(client);
      client.on('TokenExpired', () => {
        fetchAgoraRtmTokenHandlingErrors().then(token => client.renewToken(token));
      });
    }
    initAgoraClient();
    return () => {
      if (initializedClient) {
        initializedClient.logout().then(() => setAgoraClient(undefined));
      }
      dispatch(clearAgoraRtmToken());
    };
  }, [ uid, fetchAgoraRtmTokenHandlingErrors, networkErrorHandler, dispatch ]);

  return { agoraClient };
}

export { useAgoraClient, AgoraClientContext, AgoraGroupChatUpdatesChannelContext };
