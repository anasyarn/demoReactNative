
import * as types from './constants';

const initialState = {
  list: [],
  item: {},
  isPaid: false,
  isProcessing: false,
  isPending: false,
  isWaitingServer: false,
  company: {},
  promo_name: '',
  tips: {},
  summary: {},
  table: {},
  cartItems: [],
  tipsSelected: 0,
  isListLoading: false,
  isListRefreshing: false,
  isDetailLoading: false,
  isNeedEnterCard: false,
  isTipsLoading: false,
  isConfirmLoading: false,
  page: 1,
  empty: false,
  showEditPayment: false,

  hasError: false,
  errorMessage: '',
}

function orderPayloadToState(data){
  var isPaid = [2,5,7].includes(data.order.type)
  return {
    item: data.order,
    isPaid: isPaid,
    isProcessing: [1,3,4].includes(data.order.type),
    isPending: [0].includes(data.order.type),
    isWaitingServer: [3,4,6].includes(data.order.type),
    isNeedEnterCard: !data.card && !isPaid,
    company: data.company,
    promo_name: data.promo_name,
    cartItems: data.cartItems,
    card: data.card,
    tips: data.tips,
    summary: data.summary,
    table: data.table,
    isDetailLoading: false,
    tipsSelected: data.order.tips,
    isTipsLoading: false,
    isConfirmLoading: false,
    showEditPayment: false
  }
}

export default function reducer(state = initialState, action) {

  switch (action.type) {

    case types.ORDER_SET_STATE:
      return {
        ...state,
        ...action.state
      }

    case types.ORDERS_LIST:
      return {
        ...state,
        list: action.isListRefreshing ? [] : state.list,
        isListLoading: true,
        isListRefreshing: action.isListRefreshing ? true : false,
        empty: action.isListRefreshing ? false : state.empty,
        page: action.page
      }

    case types.ORDERS_LIST + '_SUCCESS':
      if(state.isListRefreshing){
        var list = action.payload.data.items
      }else{
        var list = state.list.concat(action.payload.data.items)
      }
      return {
        ...state,
        list: list,
        isListLoading: false,
        isListRefreshing: false,
        empty: action.payload.data.items.length == 0
      }

    case types.ORDER_SUMMARY:
      return {
        ...state,
        item: {},
        company: {},
        promo_name: '',
        card: {},
        tips: {}, 
        isDetailLoading: true,
        hasError: false,
        errorMessage: ''
      }

    case types.ORDER_SUMMARY + '_SUCCESS':
      console.log('Summary success')
      var data = orderPayloadToState(action.payload.data)
      return {
        ...state,
        ...data
      }

    case types.ORDER_SET_TIPS:
      return {
        ...state,
        tipsSelected: action.tipsSelected,
        isTipsLoading: true
      }

    case types.ORDER_SET_TIPS + '_SUCCESS':
      console.log('Set tips success')
      var data = orderPayloadToState(action.payload.data)
      return {
        ...state,
        ...data
      }

    case types.ORDER_CONFIRM:
      return {
        ...state,
        tipsSelected: action.tipsSelected,
        isConfirmLoading: true
      }

    case types.ORDER_CONFIRM + '_SUCCESS':
      console.log('Confirm success')
      var data = orderPayloadToState(action.payload.data)
      return {
        ...state,
        ...data
      }

    default:
      return state;
  }
}