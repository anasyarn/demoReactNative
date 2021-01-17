import * as types from './constants';
import { refreshList } from './orderActions';
import NavigationService from '../navigator/service';
import { showMessage, hideMessage } from 'react-native-flash-message';
import * as config from '../config/config';
import axios from 'axios';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import translations from '../localization/translations';

i18n.translations = translations;
i18n.locale = Localization.locale;
i18n.fallbacks = true;

axios.defaults.baseURL = config.API_URL;

var stripe = require('stripe-client')(config.STRIPE_PUBLIC_KEY);

export function reset() {
  return (dispatch) => {
    dispatch({
      type: types.APP_RESET_STATE,
    });
  };
}

export function setState(state, dispatch) {
  console.log('received by setstate', state);
  return new Promise((resolve, reject) => {
    dispatch({
      type: types.APP_SET_STATE,
      state: state,
    });
    setTimeout(resolve, 1);
  });
}

export function setAppState(state) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: types.APP_SET_STATE,
        state: state,
      });
      setTimeout(resolve, 1);
    });
  };
}

export function setTipNowState(value) {
  return (dispatch) => {
    setState(
      {
        tip_now: value,
      },
      dispatch
    );
  };
}

export function setGuestsCount(value) {
  return (dispatch) => {
    setState(
      {
        guestsCount: value,
      },
      dispatch
    );
  };
}

export function setDatetime(selectedDatetime) {
  return (dispatch) => {
    console.log('setDatetime');
    setState(
      {
        selectedDatetime: selectedDatetime,
      },
      dispatch
    );
  };
}

export function setPaymentMethod(paymentMethod) {
  return (dispatch) => {
    console.log('setPaymentMethod');
    setState(
      {
        paymentMethod: paymentMethod,
      },
      dispatch
    );
  };
}

export function setTips(value) {
  return (dispatch) => {
    setState(
      {
        tipsSelected: value,
      },
      dispatch
    );
  };
}

export function loadTableData(table_id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { app } = getState();
      console.log('load table data');
      setState({ isTipsUpdating: true }, dispatch);
      axios
        .get(
          '/api/company-table/view-customer/' +
            table_id +
            '?access_token=' +
            app.access_token,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: 'application/json',
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          dispatch(updateAppTableData(res.data)).then(() => {
            setState({ isTipsUpdating: false }, dispatch);
            resolve(res.data);
          });
        })
        .catch((err) => {
          showMessage({
            message: dispatch(i18nT('messages.load_table_error')),
            type: 'danger',
          });
          setState({ isTipsUpdating: false }, dispatch);
          reject(err.response.data);
        });
    });
  };
}

export function resetQRData() {
  return (dispatch) => {
    dispatch({ type: types.RESET_QR_DATA });
  };
}

export function enterNewCard(value) {
  return (dispatch) => {
    dispatch({ type: types.ENTER_NEW_CARD, enter_new_card: value });
  };
}

export function checkIn(promotion_id) {
  return (dispatch, getState) => {
    const { app } = getState();
    console.log('checkIn');
    return new Promise((resolve, reject) => {
      return dispatch({
        type: types.CHECK_IN_REQUEST,
        payload: {
          client: 'api',
          request: {
            url: '/api/order/request?access_token=' + app.access_token,
            method: 'post',
            data: {
              table_id: app.table.id,
              guests_number: app.guestsCount,
              tips: app.tipsSelected,
              charge_type: app.tip_now && false ? 4 : 3,
              promotion_id: promotion_id,
              subtotal: app.subtotal ? app.subtotal : null,
            },
          },
          options: {
            onSuccess({ getState, dispatch, response }) {
              showMessage({
                message: 'Success',
                type: 'success',
              });
              setState(
                {
                  checkInLoading: false,
                },
                dispatch
              );
              //dispatch(refreshList())
              NavigationService.navigate('List', {});
              resolve(response.data);
            },
            onError({ getState, dispatch, error }) {
              console.log(error.response);
              if (error.response.data.status == 403) {
                showMessage({
                  message: error.response.data.message,
                  type: 'danger',
                });
                dispatch(logout());
              } else {
                setState(
                  {
                    checkInLoading: false,
                    hasError: true,
                    errorMessage: error.response.data.message,
                  },
                  dispatch
                ).then(reject);
              }
              reject();
            },
          },
        },
      });
    });
  };
}

export function updateAppTableData(data) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      var tipsList = [];
      tipsList.push({ value: 0, label: 'None' });
      if (data.tips) {
        if (data.tips.type == 1) {
          for (var i = 1; i <= 6; i++)
            tipsList.push({
              value: data.tips['t' + i],
              label: data.tips['t' + i] + '%',
            });
        } else {
          for (var i = 1; i <= 6; i++)
            tipsList.push({
              value: data.tips['t' + i],
              label: '$' + data.tips['t' + i],
            });
        }
      }
      setState(
        {
          user_info: data.user,
          card: data.card,
          company: data.company,
          company_time_now: data.company_time_now,
          company_hours: data.company_hours,
          company_user: data.company_user,
          table: data.table,
          order: data.order,
          orderCart: data.orderCart,
          cartItems: data.cartItems,
          summary: data.summary,
          guestsList: new Array(data.table ? data.table.count : 100)
            .fill(null)
            .map((o, i) => {
              return { value: i + 1, label: i + 1 };
            }),
          guestsCount: data.table ? (data.table.count > 1 ? 2 : 1) : 2,
          tips: data.tips,
          tipsList: tipsList,
          promotions: data.promotions,
          reservations: data.reservations,
          reserveNow: true,
          selectedDatetime: null,
          loading: false,
          enter_new_card: data.card && data.card.id ? false : true,
          tipsSelected:
            data.order && data.order.tips
              ? data.order.tips
              : data.tips
              ? data.tips.t3
              : 0,
        },
        dispatch
      ).then(resolve, reject);
    });
  };
}

export function setQRCodeData(res) {
  return (dispatch, getState) => {
    console.log('setQRCodeData');
    return new Promise((resolve, reject) => {
      let table_id = null;
      const { app } = getState();
      if (res && res.data && res.data.indexOf('table_id=') != -1) {
        pos = res.data.indexOf('table_id=');
        table_id = res.data.substring(pos + 9);
      }
      return dispatch({
        type: types.SET_QR_CODE_DATA,
        table_id: table_id,
        payload: {
          client: 'api',
          request: {
            url:
              '/api/company-table/view-customer/' +
              table_id +
              '?access_token=' +
              app.access_token,
            headers: { Accept: 'XMLHttpRequest' },
            method: 'post',
          },
          options: {
            onSuccess({ getState, dispatch, response }) {
              console.log('check-in-data');
              dispatch(updateAppTableData(response.data)).then(resolve);
            },
            onError({ getState, dispatch, error }) {
              console.log('check-in-data error');
              console.log(error.response);
              showMessage({
                message: error.response.data.message,
                type: 'danger',
              });
              if (error.response.data.status == 403) {
                dispatch(logout());
              } else {
                setState(
                  {
                    loading: false,
                    hasError: true,
                    errorMessage: error.response.data.message,
                  },
                  dispatch
                ).then(reject);
              }
            },
          },
        },
      });
    });
  };
}

export function updateCard(newCard) {
  return (dispatch, getState) => {
    console.log('updateCard');
    setState({ isStripeLoading: true }, dispatch);
    return new Promise((resolve, reject) => {
      const { app } = getState();
      if (newCard.valid) {
        let params = {
          // mandatory
          number: newCard.values.number.replace(/\s/g, ''),
          exp_month: parseInt(newCard.values.expiry.split('/')[0]),
          exp_year: parseInt(newCard.values.expiry.split('/')[1]),
          cvc: newCard.values.cvc,
          name: app.user_info.first_name + ' ' + app.user_info.last_name,
          currency: 'usd',
          address_zip: newCard.values.postalCode,
        };
        if (app.user_info.country)
          params.address_country = app.user_info.country;
        return stripe.createToken({ card: params }).then((res) => {
          console.log('- stripeCreateToken - ');
          if (!res.error) {
            console.log('request');
            return dispatch({
              type: types.SAVE_CARD_DATA,
              payload: {
                client: 'api',
                request: {
                  url:
                    '/api/user/save-user-card?access_token=' + app.access_token,
                  method: 'post',
                  data: { tokenId: res.id },
                },
                options: {
                  onSuccess({ getState, dispatch, response }) {
                    console.log('success');
                    var data = response.data;
                    console.log(data);
                    setState(
                      {
                        card: data.card,
                        loading: false,
                        isStripeLoading: false,
                        enter_new_card: false,
                      },
                      dispatch
                    ).then(resolve);
                  },
                  onError({ getState, dispatch, error }) {
                    var response = error.response;
                    const message =
                      response.data && response.data.message
                        ? response.data.message
                        : dispatch(i18nT('messages.something_went_wrong'));
                    appOnError(getState, dispatch, error);
                    setState({ isStripeLoading: false }, dispatch).then(() => {
                      reject(message);
                    });
                  },
                },
              },
            });
          } else {
            showMessage({
              message: res.error.message,
              type: 'danger',
            });
            setState({ isStripeLoading: false }, dispatch).then(reject);
          }
        });
      } else {
        setState({ isStripeLoading: false }, dispatch).then(reject);
      }
    });
  };
}

export function updateCash(type) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { app } = getState();

      setState({ loading: true, isStripeLoading: true }, dispatch);

      axios
        .post(
          '/api/user/save-user-card',
          { type: type },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: 'application/json',
            },
            params: { access_token: app.access_token },
          }
        )
        .then((res) => {
          setState(
            {
              card: res.data.card,
              loading: false,
              isStripeLoading: false,
              enter_new_card: false,
            },
            dispatch
          );
          showMessage({
            message: dispatch(i18nT('messages.pay_by_cash_success')),
            type: 'success',
          });
          resolve(res.data);
        })
        .catch((err) => {
          setState({ loading: false, isStripeLoading: false }, dispatch);
          const message =
            err.response && err.response.data && err.response.data.message
              ? err.response.data.message
              : dispatch(i18nT('messages.something_went_wrong'));
          showMessage({ message: message, type: 'danger' });
          reject();
        });
    });
  };
}

export function login(user) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      return dispatch({
        type: types.LOGIN,
        payload: {
          client: 'api',
          request: {
            url: '/api/user/login',
            method: 'post',
            data: user,
          },
          options: {
            onSuccess({ getState, dispatch, response }) {
              dispatch({ type: `${types.LOGIN_SUCCESS}`, res: response.data });
              showMessage({
                message:
                  response && response.data && response.data.message
                    ? response.data.message
                    : dispatch(i18nT('messages.register_success')),
                type: 'info',
              });
              NavigationService.navigate('Promotions', {
                table: null,
                enter_new_card: false,
                company_id: null,
              });
              resolve();
            },
            onError({ getState, dispatch, error }) {
              var response = error.response;
              const message =
                response.data && response.data.message
                  ? response.data.message
                  : dispatch(i18nT('messages.something_went_wrong'));
              appOnError(getState, dispatch, error);
              reject(message);
            },
          },
        },
      });
    });
  };
}

export function register(user) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      console.log('register');
      return dispatch({
        type: types.REGISTER,
        payload: {
          client: 'api',
          request: {
            url: '/api/user/register',
            method: 'post',
            data: user,
          },
          options: {
            onSuccess({ getState, dispatch, response }) {
              console.log('success');
              if (response.data && response.data.success) {
                dispatch({
                  type: `${types.REGISTER_SUCCESS}`,
                  res: response.data,
                });
                showMessage({
                  message:
                    response && response.data && response.data.message
                      ? response.data.message
                      : dispatch(i18nT('messages.login_success')),
                  type: 'info',
                });
                NavigationService.navigate('Promotions', {
                  table: null,
                  enter_new_card: false,
                  company_id: null,
                });
                resolve();
              } else {
                dispatch({
                  type: `${types.REGISTER_FAIL}`,
                  res: response.payload,
                });
                reject(response.data.messages);
              }
            },
            onError({ getState, dispatch, error }) {
              console.log('fail');
              var response = error.response;
              const message =
                response.data && response.data.message
                  ? response.data.message
                  : dispatch(i18nT('messages.something_went_wrong'));
              appOnError(getState, dispatch, error);
              reject(message);
            },
          },
        },
      });
    });
  };
}

export function simpleRegister(user) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      console.log('simple register');
      data = Object.entries(user)
        .map(([key, val]) => `${key}=${val}`)
        .join('&');
      axios
        .post('/api/user/simple-register', data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        })
        .then((res) => {
          setState(
            {
              user: res.data.user,
              user_info: res.data.user_info,
              isLoggedIn: true,
              access_token: res.data.access_token,
            },
            dispatch
          );
          showMessage({ message: 'Sign up success', type: 'success' });
          resolve(res.data);
        })
        .catch((err) => {
          showMessage({ message: 'Sign up error', type: 'danger' });
          reject(err.response.data);
        });
    });
  };
}

export function confirmPayment() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { app } = getState();
      console.log('confirm payment', app && app.order && app.order.id);
      if (app && app.order && app.order.id) {
        setState({ confirmLoading: true }, dispatch);
        axios
          .post(
            '/api/order/confirm/' + app.order.id,
            {},
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
              },
              params: { access_token: app.access_token },
            }
          )
          .then((res) => {
            showMessage({ message: 'Confirm success', type: 'success' });
            //dispatch(refreshList())
            NavigationService.navigate('List', {});
            setState({ confirmLoading: false }, dispatch);
            resolve(res.data);
          })
          .catch((err) => {
            const response = err.response;
            const message =
              response.data && response.data.message
                ? response.data.message
                : 'Confirm error';
            setState({ confirmLoading: false }, dispatch);
            showMessage({ message: message, type: 'danger' });
            reject(err.response.data);
          });
      }
    });
  };
}

export function claimPromotion(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { app } = getState();
      console.log('claim promotion');
      setState({ isPromotionLoading: true }, dispatch);
      axios
        .get('/api/promotion/add-user-promotion/' + id, {
          headers: { Accept: 'application/json' },
          params: { access_token: app.access_token },
        })
        .then((res) => {
          console.log(res.data);
          setState(
            {
              promotions: res.data.promotions,
              isPromotionLoading: false,
            },
            dispatch
          );
          showMessage({
            message: dispatch(i18nT('messages.claim_promotion')),
            type: 'success',
          });
          resolve(res.data);
        })
        .catch((err) => {
          showMessage({
            message:
              dispatch(i18nT('messages.claim_promotion')) +
              ': ' +
              err.response.data.message,
            type: 'danger',
          });
          setState({ isPromotionLoading: false }, dispatch);
          reject(err.response.data);
        });
    });
  };
}

export function appOnError(getState, dispatch, error) {
  console.log(' - fail here - ');
  console.log(error.response);
  setState(
    {
      loading: false,
    },
    dispatch
  );
  if (error.response.status == 403) {
    showMessage({
      message: 'Please login first',
      type: 'danger',
    });
    dispatch(logout());
  } else {
    showMessage({
      message:
        error.response.data && error.response.data.message
          ? error.response.data.message
          : dispatch(i18nT('messages.something_went_wrong')),
      type: 'danger',
    });
  }
}

export function logout() {
  return (dispatch) => {
    dispatch({
      type: types.LOGOUT,
    });
    NavigationService.navigate('Login', {});
  };
}

export function updateCart(data) {
  console.log('cart data here is:', data);
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { app } = getState();
      axios
        .post('/api/order-cart/add-to', data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
          params: { access_token: app.access_token },
        })
        .then((res) => {
          showMessage({
            message: dispatch(i18nT('messages.added_to_cart')),
            type: 'success',
          });
          setState({ cart: res.data.cart_items }, dispatch);
          resolve(res.data);
        })
        .catch((err) => {
          showMessage({
            message: dispatch(i18nT('messages.add_to_cart_error')),
            type: 'danger',
          });
          reject(err.response.data);
        });
    });
  };
}

export function universalQRCodeScan(res) {
  return (dispatch, getState) => {
    console.log('universalQRCodeScan');
    return new Promise((resolve, reject) => {
      let table_id = null;
      let cid = null;
      const { app } = getState();
      if (res && res.data && res.data.indexOf('?table_id=') != -1) {
        pos = res.data.indexOf('?table_id=');
        table_id = res.data.substring(pos + 10);
        dispatch(tableViewData(table_id)).then(resolve);
        return resolve();
      }
      if (res && res.data && res.data.indexOf('?cid=') != -1) {
        pos = res.data.indexOf('?cid=');
        cid = res.data.substring(pos + 5);
        dispatch(companyShowData(cid)).then(resolve);
        return resolve();
      }
      if (res && res.data && res.data.indexOf('?oid=') != -1) {
        pos = res.data.indexOf('?oid=');
        oid = res.data.substring(pos + 5);
        dispatch(orderDetailsShow(oid)).then(resolve);
        return resolve();
      }
      setState(
        {
          loading: false,
          hasError: true,
          errorMessage:
            dispatch(i18nT('messages.qr_code_text')) + ': \n\n' + res.data,
        },
        dispatch
      );
      showMessage({
        message: dispatch(i18nT('messages.data_format_wrong')),
        type: 'warning',
      });
    });
  };
}

export function tableViewData(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { app } = getState();
      console.log('tableViewData');
      setState(
        {
          loading: true,
          hasError: false,
          subtotal: null,
          errorMessage: '',
          table_id: id,
        },
        dispatch
      );
      axios
        .get('/api/company-table/view-customer/' + id, {
          headers: { Accept: 'application/json' },
          params: { access_token: app.access_token },
        })
        .then((res) => {
          setState({ loading: true }, dispatch);
          dispatch(updateAppTableData(res.data)).then(() => resolve(res.data));
        })
        .catch((error) => {
          console.log('check-in-data error');
          showMessage({
            message: error.response.data.message,
            type: 'danger',
          });
          if (error.response.data.status == 403) {
            dispatch(logout());
          } else {
            setState(
              {
                loading: false,
                hasError: true,
                errorMessage: error.response.data.message,
              },
              dispatch
            ).then(reject);
          }
        });
    });
  };
}

export function companyShowData(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { app } = getState();
      setState(
        {
          loading: true,
          hasError: false,
          errorMessage: '',
          subtotal: null,
          company_id: id,
        },
        dispatch
      );
      console.log(app.access_token, id);
      axios
        .get('/api/company-info/show/' + id, {
          headers: { Accept: 'application/json' },
          params: { access_token: app.access_token },
        })
        .then((res) => {
          setState({ loading: true }, dispatch);
          dispatch(updateAppTableData(res.data)).then(() => resolve(res.data));
        })
        .catch((error) => {
          console.log('comapny data error');
          console.log(error.response);
          const message =
            error &&
            error.response &&
            error.response.data &&
            error.response.data.message
              ? error.response.data.message
              : dispatch(i18nT('messages.company_data_error'));
          showMessage({ message: message, type: 'danger' });
          setState(
            { loading: false, hasError: true, errorMessage: message },
            dispatch
          ).then(reject);
        });
    });
  };
}

export function orderDetailsShow(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { app } = getState();
      console.log('orderDetailsShow');
      setState(
        {
          loading: true,
          hasError: false,
          subtotal: null,
          errorMessage: '',
        },
        dispatch
      );
      axios
        .get(`/api/order/customer-summary/${id}`, {
          headers: { Accept: 'application/json' },
          params: { access_token: app.access_token },
        })
        .then((res) => {
          const isPaid = [2, 5, 7].includes(res.data.order.type);
          if (isPaid) {
            setState({ loading: false, hasOrderPaid: true }, dispatch).then(
              () => {
                NavigationService.navigate('Detail', { item: { id: id } });
                resolve(res.data);
                setTimeout(() => {
                  setState({ loading: false, hasOrderPaid: false }, dispatch);
                }, 100);
              }
            );
          } else {
            res.data.user = res.data.user_info;
            setState({ loading: true }, dispatch).then(() => {
              dispatch(updateAppTableData(res.data)).then(() =>
                resolve(res.data)
              );
            });
          }
        })
        .catch((error) => {
          showMessage({
            message: error.response.data.message,
            type: 'danger',
          });
          setState(
            {
              loading: false,
              hasError: true,
              errorMessage: error.response.data.message,
            },
            dispatch
          ).then(reject);
        });
    });
  };
}

export function reserveATable() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { app } = getState();
      console.log('reserveATable');
      const data = Object.entries({
        company_id: app.company.id,
        tips: app.tipsSelected,
        type: app.tip_now && false ? 4 : 3,
        guests_number: app.guestsCount,
        subtotal: app.subtotal ? app.subtotal : null,
      })
        .map(([key, val]) => `${key}=${val}`)
        .join('&');

      setState({ isMakeReservationLoading: true }, dispatch);
      axios
        .post('/api/order/make-reservation', data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
          params: { access_token: app.access_token },
        })
        .then((res) => {
          showMessage({
            message: dispatch(i18nT('messages.reservation_success')),
            type: 'success',
          });
          setState({ isMakeReservationLoading: false }, dispatch).then(
            resetQRData
          );
          resolve(res.data);
        })
        .catch((err) => {
          showMessage({
            message: dispatch(i18nT('messages.reservation_error')),
            type: 'danger',
          });
          setState({ isMakeReservationLoading: false }, dispatch);
          reject(err.response.data);
        });
    });
  };
}

export function callAServer(order_id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { app } = getState();
      console.log('call a server');
      console.log('order_id - ', order_id);

      setState({ callServerLoading: true }, dispatch);
      axios
        .post(
          '/api/order/call-a-server/' + order_id,
          {},
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: 'application/json',
            },
            params: { access_token: app.access_token },
          }
        )
        .then((res) => {
          setState({ callServerLoading: false }, dispatch);
          showMessage({
            message: dispatch(i18nT('messages.call_a_server_success')),
            type: 'info',
          });
          resolve(res.data);
        })
        .catch((err) => {
          var response = err.response;
          const message =
            response.data && response.data.message
              ? response.data.message
              : dispatch(i18nT('messages.something_went_wrong'));
          setState({ callServerLoading: false }, dispatch);
          showMessage({ message: message, type: 'danger' });
          reject(message);
        });

      resolve();
    });
  };
}

export function cashNotify(order_id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { app } = getState();
      console.log('cashNotify');
      console.log('order_id - ', order_id);

      setState({ confirmLoading: true }, dispatch);
      axios
        .post(
          '/api/order/cash-notify/' + order_id,
          {},
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: 'application/json',
            },
            params: { access_token: app.access_token },
          }
        )
        .then((res) => {
          showMessage({
            message: dispatch(i18nT('messages.cash_notify_success')),
            type: 'info',
          });
          setState({ confirmLoading: false }, dispatch);
          resolve(res.data);
        })
        .catch((err) => {
          var response = err.response;
          const message =
            response.data && response.data.message
              ? response.data.message
              : dispatch(i18nT('messages.something_went_wrong'));
          showMessage({ message: message, type: 'danger' });
          setState({ confirmLoading: false }, dispatch);
          reject(message);
        });
      resolve();
    });
  };
}

export function i18nT(str, obj) {
  return (dispatch, getState) => {
    const { app } = getState();
    i18n.locale = app.lang ? app.lang : Localization.locale;
    return i18n.t(str, obj);
  };
}

export { i18n };
