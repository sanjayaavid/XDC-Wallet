/**
 * @format
 */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);


import React from 'react';
import { AppRegistry, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './shim';
import Navigator from './src/navigators';
import { persistor, store } from './src/config/store';
import AnalyticsUtils from './src/utils/analytics';

const getCurrentRouteName = navigationState => {
  if (!navigationState) {
    return null;
  }

  const route = navigationState.routes[navigationState.index];

  if (route.routes) {
    return getCurrentRouteName(route);
  }

  return route.routeName;
};

console.log('store', store);

const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Navigator
        onNavigationStateChange={(prevState, currentState) => {
          const currentScreen = getCurrentRouteName(currentState);
          const prevScreen = getCurrentRouteName(prevState);

          if (prevScreen !== currentScreen) {
            AnalyticsUtils.trackScreen(currentScreen);
          }
        }}
      />
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent('XDCWallet', () => App);
