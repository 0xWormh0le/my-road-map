/* This is the Root component mainly initializes Redux and React Router. */

import React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { hot, setConfig } from 'react-hot-loader';
import { PersistGate } from 'redux-persist/integration/react';

import storeContainer from './common/store';
import routeConfig from './common/routeConfig';
import history from './common/history';
import withFooter from './common/withFooter';
import { useFetchAuthToken } from './features/home/redux/hooks';
import withNetworkDetector from './features/common/NetworkDetector';

setConfig({
  logLevel: 'debug',
});

const notApprovedUserAllowedPaths = [
  '/user-not-approved',
  '/user/',
  '/user/profile',
];

const ProtectedRoute = ({ component: Comp, path, ...rest }) => {
  const location = useLocation()
  
  const { authToken, userApproved } = useFetchAuthToken();
  
  const renderFunc = props => {
    if (!authToken) {
      return <Redirect to={`/log-in?next=${location.pathname}`} />
    }

    if (!userApproved && !notApprovedUserAllowedPaths.includes(path)) {
      return <Redirect to='/user-not-approved' />
    }

    return <Comp {...props} />
  }
  
  return <Route path={path} render={renderFunc} {...rest} />
}

function renderRouteConfigV3(routes, contextPath) {
  // Resolve route config object in React Router v3.
  const children = []; // children component list

  const renderRoute = (item, routeContextPath) => {
    let newContextPath;
    if (/^\//.test(item.path)) {
      newContextPath = item.path;
    } else {
      newContextPath = `${routeContextPath}/${item.path}`;
    }
    newContextPath = newContextPath.replace(/\/+/g, '/');
    
    const component = (item.noSignIn || item.childRoutes) ? item.component : withFooter(item.component)
    const Comp = withNetworkDetector(component)

    if (item.component && item.childRoutes) {
      const childRoutes = renderRouteConfigV3(item.childRoutes, newContextPath);
      children.push(
        <Route
          key={newContextPath}
          render={props => <Comp {...props}>{childRoutes}</Comp>}
          path={newContextPath}
        />,
      );
    } else if (item.component) {
      const RouteComponent = item.noSignIn ? Route : ProtectedRoute
      children.push(
        <RouteComponent
          key={newContextPath}
          component={Comp}
          path={newContextPath}
          exact
        />,
      );
    } else if (item.childRoutes) {
      item.childRoutes.forEach(r => renderRoute(r, newContextPath));
    }
  };

  routes.forEach(item => renderRoute(item, contextPath));

  // Use Switch so that only the first matched route is rendered.
  return <Switch>{children}</Switch>;
}

function Root() {
  const children = renderRouteConfigV3(routeConfig, '/');
  return (
    <Provider store={storeContainer.store}>
      <PersistGate loading={null} persistor={storeContainer.persistor}>
        <ConnectedRouter history={history}>
          {children}
        </ConnectedRouter>
      </PersistGate>
    </Provider>
  );
}

export default hot(module)(Root);
