import * as Localization from 'expo-localization';
import * as types from './constants';

const initialState = {
  user: {},
  user_info: {},
  pickup_coords: {},
  loading: false,
  isLoggedIn: false,
  access_token: null,
  table_id: null,
  company_id: null,
  enter_new_card: false,
  isStripeLoading: false,
  card: {},
  company: {},
  company_user: {},
  table: {},
  guestsList: [],
  guestsCount: null,
  tips: {},
  tipsList: [],
  reserveNow: true,
  selectedDatetime: null,
  promotions: [],
  reservations: [],
  isPromotionLoading: false,
  tipsSelected: 0,
  tip_now: false,
  checkInLoading: false,
  hasError: false,
  errorMessage: '',
  isTipsUpdating: false,
  isMakeReservationLoading: false,
  hasOrderPaid: false,
  callServerLoading: false,
  lang: Localization.locale.split('-')[0],
  paymentMethod: null,
  cart: null,
  cartCount: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN:
      return { ...state, loading: true };
    case types.LOGIN_SUCCESS:
      var data = action.res;
      console.log('login success');
      return {
        ...state,
        loading: false,
        isLoggedIn: data.success,
        access_token: data.access_token,
        user: data.success ? data.user : {},
        user_info: data.success ? data.user_info : {},
      };
    // case types.SET_CART:
    //   return { ...state, cart: action.res };
    case types.REGISTER:
      return { ...state, loading: true };
    case types.SET_PAYMENT_METHOD:
      console.log(action);
      return { ...state, paymentMethod: action.state };
    case types.REGISTER_SUCCESS:
      var data = action.res;
      console.log('register success');
      return {
        ...state,
        loading: false,
        isLoggedIn: data.success,
        access_token: data.access_token,
        user: data.success ? data.user : {},
        user_info: data.success ? data.user_info : {},
      };
    case types.REGISTER_FAIL:
      return {
        ...state,
        loading: false,
      };

    case types.LOGOUT:
      return {
        ...state,
        loading: false,
        user: {},
        isLoggedIn: false,
        access_token: null,
      };
    case types.RESET_QR_DATA:
      return {
        ...state,
        table_id: null,
        company_id: null,
        card: {},
        company: {},
        company_user: {},
        table: {},
        tips: {},
        promotions: [],
        loading: false,
        enter_new_card: false,
        new_card_loading: false,
        hasError: false,
        errorMessage: '',
        hasOrderPaid: false,
      };

    case types.ENTER_NEW_CARD:
      return {
        ...state,
        enter_new_card: action.enter_new_card,
        isStripeLoading: false,
      };

    case types.SET_QR_CODE_DATA:
      return {
        ...state,
        loading: true,
        hasError: false,
        errorMessage: '',
        table_id: action.table_id,
      };
    case types.CHECK_IN_REQUEST:
      return {
        ...state,
        checkInLoading: true,
      };
    case types.APP_SET_STATE:
      console.log("calledthis",action.state.cart)
      return {
        ...state,
        ...action.state,
      };
    case types.APP_RESET_STATE:
      return initialState;

    default:
      return state;
  }
}
