import * as types from '../constants';
import { showMessage, hideMessage } from "react-native-flash-message";
import * as config from '../../config/config';
import axios from 'axios';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import translations from "../../localization/translations";

i18n.translations = translations;
i18n.locale = Localization.locale;
i18n.fallbacks = true;

axios.defaults.baseURL = config.API_URL;

export function setState(state, dispatch){
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.TRANSACTIONS_SET_STATE,
      state: state
    })
    setTimeout(resolve,1);
  })
}

export function resetState(){
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: types.TRANSACTIONS_RESET_STATE })
      setTimeout(resolve,1);
    })
  }
}

export function setAmount(amount) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      setState({amount: amount}, dispatch).then(resolve).catch(reject)
    })
  }
}

export function addFunds() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      console.log('addFunds')
      const { app, transactions } = getState()
      const data = Object.entries({ amount_cents: transactions.amount }).map(([key, val]) => `${key}=${val}`).join('&')
      setState({loading: true}, dispatch).then(() => {
        axios.post('/api/transaction/add-amount', data, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
          params: { access_token: app.access_token }
        }).then(res => {
          setState({
            loading: false,
            balance_active: res.data.balance_active,
            balance_pending: res.data.balance_pending,
            balance_spent: res.data.balance_spent
          }, dispatch)
          resolve(res.data)
        }).catch(err => {
          setState({loading: false}, dispatch)
          const message = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : i18n.t('messages.something_went_wrong')
          showMessage({message: message, type: "danger" })
          reject(message)
        })
      })

    })
  }
}

export function balance() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { app } = getState()
      console.log('balance')
      setState({loading: true}, dispatch).then(() => {
        axios.get('/api/transaction/balance', {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
          params: { access_token: app.access_token }
        }).then(res => {
          setState({
            loading: false,
            balance_active: res.data.balance_active,
            balance_pending: res.data.balance_pending,
            balance_spent: res.data.balance_spent
          }, dispatch)
          resolve(res.data)
        }).catch(err => {
          setState({loading: false}, dispatch)
          const message = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : i18n.t('messages.something_went_wrong')
          showMessage({message: message, type: "danger" })
          reject(message)
        })
      })
    })
  }
}
