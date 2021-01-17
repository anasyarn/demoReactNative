
import React, {Component} from 'react'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import FlashMessage from "react-native-flash-message";
import Routes from './app/navigator/routes'
import NavigationService from './app/navigator/service';
import configureStore from './app/store/index';

import base64 from 'react-native-base64'
if(typeof window.btoa != 'function') window.btoa = base64.encode

const {store, persistor} = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }} />
          <FlashMessage position="top" />
        </PersistGate>
      </Provider>
    );
  }
}