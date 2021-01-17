
import * as types from '../constants';

const initialState = {
  item: null,
  items: [],
  loading: false,
  deleting: null
}

export default function reducer(state = initialState, action) {

  switch (action.type) {
    case types.RESERVATIONS_SET_STATE:
      return {
        ...state,
        ...action.state
      };

    case types.RESERVATIONS_RESET_STATE:
      return initialState

    default:
      return state;
  }
}
