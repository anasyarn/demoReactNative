import * as types from '../constants';
import { showMessage, hideMessage } from 'react-native-flash-message';
import * as config from '../../config/config';
import axios from 'axios';
import moment from 'moment';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import translations from '../../localization/translations';

i18n.translations = translations;
i18n.locale = Localization.locale;
i18n.fallbacks = true;

axios.defaults.baseURL = config.API_URL;

export function setState(state, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.RESERVATIONS_SET_STATE,
      state: state,
    });
    setTimeout(resolve, 1);
  });
}

export function resetState(dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({ type: types.RESERVATIONS_RESET_STATE });
    setTimeout(resolve, 1);
  });
}

export function createReservation() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { app } = getState();
      const data = Object.entries({
        company_id: app.company.id,
        time: moment.utc(app.selectedDatetime).format('YYYY-MM-DD HH:mm:ss'),
      })
        .map(([key, val]) => `${key}=${val}`)
        .join('&');

      console.log(data);
      setState({ loading: true }, dispatch).then(() => {
        axios
          .post('/api/reservations', data, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: 'application/json',
            },
            params: { access_token: app.access_token },
          })
          .then((res) => {
            console.log('ReservationMake: ', res);
            console.log(res.data);
            setState(
              {
                loading: false,
                item: res.data.reservation,
              },
              dispatch
            );
            resolve(res.data);
          })
          .catch((err) => {
            setState({ loading: false }, dispatch);
            const message =
              err &&
              err.response &&
              err.response.data &&
              err.response.data.message
                ? err.response.data.message
                : i18n.t('messages.something_went_wrong');
            showMessage({ message: message, type: 'danger' });
            reject(message);
          });
      });
    });
  };
}

export function deleteReservation(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { app } = getState();
      console.log('deleteReservation', id);
      setState({ deleting: id }, dispatch).then(() => {
        axios
          .delete('/api/reservations/' + id, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: 'application/json',
            },
            params: { access_token: app.access_token },
          })
          .then((res) => {
            setState({ deleting: null }, dispatch);
            resolve(res.data);
          })
          .catch((err) => {
            setState({ deleting: null }, dispatch);
            const message =
              err &&
              err.response &&
              err.response.data &&
              err.response.data.message
                ? err.response.data.message
                : i18n.t('messages.something_went_wrong');
            showMessage({ message: message, type: 'danger' });
            reject(message);
          });
      });
    });
  };
}
