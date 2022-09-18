import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import config from '../../common/config';
import { createAxiosConfigWithAuth } from '../../common/apiHelpers';

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4)
  var base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  var rawData = window.atob(base64)
  var outputArray = new Uint8Array(rawData.length)

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray;
}

function loadVersionBrowser(userAgent) {
  var ua = userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {name: 'IE', version: (tem[1] || '')};
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR\/(\d+)/);
    if (tem != null) {
      return {name: 'Opera', version: tem[1]};
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }
  return {
    name: M[0],
    version: M[1]
  };
}

var applicationServerKey = "BDwExw-J5WNmQuGRTsIVNOg1vOTSjIg-7UOo8y0Y1Do6vUJSlbbRMzCHhsmuVa_zSD49DTnoaDS_BqrlpPoJsy8";

function registerWebPushDeviceActionCreator(args = {}) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const doRequest = axios.post(
        `${config.apiRootUrl}/register-web-push-device/`,
        args,
        createAxiosConfigWithAuth(getState()),
      );
      doRequest.then(
        (res) => { console.log("REGISTERED!"); resolve(res);},
        (err) => reject(err),
      );
    });
  };
}

export function usePushManager() {
  const dispatch = useDispatch();

  const registerWebPushDevice = useCallback(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.ready.then(function (reg) {
      var serviceWorker;
      if (reg.installing) {
        serviceWorker = reg.installing;
      } else if (reg.waiting) {
        serviceWorker = reg.waiting;
      } else if (reg.active) {
        serviceWorker = reg.active;
      }

      if (!serviceWorker) return;

      var browser = loadVersionBrowser(navigator.userAgent);
      if (browser.name.toUpperCase() === "SAFARI") return; // Safari isn't a valid web push device

      reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
      }).then(function (sub) {
        var endpointParts = sub.endpoint.split('/');
        var registration_id = endpointParts[endpointParts.length - 1];
        var data = {
          'browser': browser.name.toUpperCase(),
          'p256dh': btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))),
          'auth': btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth')))),
          'name': 'Browser',
          'registration_id': registration_id
        };
        dispatch(registerWebPushDeviceActionCreator(data));
      });
    });
  }, [dispatch]);

  return { registerWebPushDevice };
}
