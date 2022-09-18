import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { persistStore, persistReducer } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage';

import {
  COMMON_LOGOUT,
} from '../features/common/redux/constants';

import history from './history';
import rootReducer from './rootReducer';

const router = routerMiddleware(history);

// NOTE: Do not change middleares delaration pattern since rekit plugins may register middlewares to it.
const middlewares = [thunk, router];

let devToolsExtension = f => f;

/* istanbul ignore if  */
if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger');

  const logger = createLogger({ collapsed: true });
  middlewares.push(logger);

  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__();
  }
}

const authPersistConfig = {
  key: 'auth',
  storage: localStorage,
  whitelist: ['home'],
}

function wrapRootReducer(rootReducer) {
  function appReducer(state, action) {
    if (action.type === COMMON_LOGOUT) {
      authPersistConfig.storage.removeItem(`persist:${authPersistConfig.key}`);
      state = undefined;
    }
    return rootReducer(state, action);
  }
  return persistReducer(authPersistConfig, appReducer);
}

const persistedReducer = wrapRootReducer(rootReducer);

function configureStore(initialState) {
  const store = createStore(
    persistedReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares),
      devToolsExtension,
    ),
  );

  /* istanbul ignore if  */
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default; // eslint-disable-line
      const wrappedNextRootReducer = wrapRootReducer(nextRootReducer);
      store.replaceReducer(wrappedNextRootReducer);
    });
  }

  return { store, persistor: persistStore(store) };
}

export default configureStore();
