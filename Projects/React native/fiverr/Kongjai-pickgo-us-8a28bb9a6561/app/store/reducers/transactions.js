
import * as types from '../constants';

const initialState = {
  item: null,
  items: [],
  loading: true,
  amount: 0,
  balance_active: 0,
  balance_pending: 0,
  balance_spent: 0
}

export default function reducer(state = initialState, action) {

  switch (action.type) {
    case types.TRANSACTIONS_SET_STATE:
      return {
        ...state,
        ...action.state
      };

    case types.TRANSACTIONS_RESET_STATE:
      return initialState

    default:
      return state;
  }
}
