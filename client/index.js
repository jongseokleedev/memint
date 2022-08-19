/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import messaging from '@react-native-firebase/messaging';

import {legacy_createStore as createStore} from 'redux';
import rootReducer from './src/slices/Index';
const store = createStore(rootReducer);

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => RNRedux);
