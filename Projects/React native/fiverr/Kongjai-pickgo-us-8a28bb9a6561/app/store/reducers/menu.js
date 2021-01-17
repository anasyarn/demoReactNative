
import * as types from '../constants';

const initialState = {
  item: null,
  items: []
}

export default function reducer(state = initialState, action) {

  switch (action.type) {
    case types.MENU_SET_STATE:
      return {
        ...state,
        ...action.state
      };

    case types.MENU_RESET_STATE:
      return initialState

    default:
      return state;
  }
}
