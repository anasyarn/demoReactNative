
import { createStore, applyMiddleware, combineReducers } from 'redux';
import app from './appReducer';
import order from './orderReducer';
import transactions from './reducers/transactions';
import reservations from './reducers/reservations';
import axios from 'axios';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import { AsyncStorage as storage } from 'react-native';
import { multiClientMiddleware } from 'redux-axios-middleware';
import * as config from '../config/config';

const rootReducer = combineReducers({ app, order, transactions, reservations });

const clients = {
  default: {
    client: axios.create({
      baseURL: config.BASE_URL,
      responseType: 'json'
    })
  },
  api: {
    client: axios.create({
      baseURL: config.API_URL,
      responseType: 'json',
      auth: {
        username: 'yookmai',
        password: 'devdev'
      }
    })
  }
}

const persistConfig = {
    key: 'root',
    storage: storage,
    version: 1
};
const persistedReducer = persistReducer(persistConfig, rootReducer)
//const persistedReducer = rootReducer

export default () => {
  let store = createStore(persistedReducer, applyMiddleware(multiClientMiddleware(clients), thunk));
  let persistor = persistStore(store)
  return { store, persistor }
}


