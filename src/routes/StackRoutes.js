import React, {Component} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import LocationScreen from '../screens/LocationScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import { colors } from '../constants/colors';
const Stack = createStackNavigator();

export class StackRoutes extends Component {
  async componentDidMount() {
    ///componentdidimount is a react life cycle methode in class based component. It is invoked when your component is mounted/loaded. Same is vailabale as useEffect hook in functional component
    try {
      ///here we r checking if user has data in local storage. If yes we r directly moving him to home screen else he is being moved to login screen
      const value = await AsyncStorage.getItem('userData');
      if (value != null) {
        this.setState({loading: false, userData: JSON.parse(value)}, () => {
          console.log(this.state.userData);
        });
      } else {
        this.setState({loading: false});
      }
    } catch (e) {
      console.log(e);
      // error reading value
      this.setState({loading: false});
    }
  }
  state = {loading: true, userData: ''};
  render() {
    /////this is the stack router of the app. This controls the routing system of the app. Here im using only stack router. There r also available others. Read more at reactnavigation.org
    return this.state.loading ? (
      <ActivityIndicator color={colors.app} size="large" style={{marginTop: '70%'}} />
    ) : (
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={
          this.state.userData != '' ? 'HomeScreen' : 'LoginScreen'
        }>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="LocationScreen" component={LocationScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Navigator>
    );
  }
}

export default StackRoutes;
