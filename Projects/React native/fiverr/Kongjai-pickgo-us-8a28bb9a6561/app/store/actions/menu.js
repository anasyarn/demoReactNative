
import * as types from '../constants';
import { showMessage, hideMessage } from "react-native-flash-message";
import * as config from '../config/config';
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
      type: types.MENU_SET_STATE,
      state: state
    })
    setTimeout(resolve,1);
  })
}

export function resetState(dispatch){
  return new Promise((resolve, reject) => {
    dispatch({ type: types.MENU_RESET_STATE })
    setTimeout(resolve,1);
  })
}

export function getMenu(user) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { app } = getState()

      const data = Object.entries({ }).map(([key, val]) => `${key}=${val}`).join('&')

      setState({loading: true}, dispatch).then(() => {

        axios.post('/list', data).then(res => {
          setState({ loading: false }, dispatch)
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
