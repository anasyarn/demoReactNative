// NavigationService.js

import { NavigationActions } from 'react-navigation';
//import { setAppState } from "../store/appActions";

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {

	console.log(routeName, params)
	//_navigator.dispatch(setAppState({table: {}, table_id: null}))
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

export default {
  navigate,
  setTopLevelNavigator,
};