/* eslint-disable react/display-name */
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';
import HomeScreen from '../screens/home';
import InviteTeamScreen from '../screens/InviteTeam';
import DeliveryScreen from '../screens/Delivery';
import PinLocationScreen from '../screens/PinLocation';
import TrackOrder from '../screens/TrackOrder';
import DropOffScreen from '../screens/DropOff';
import DirectionsScreen from '../screens/Directions';
import DirectionsDefaultScreen from '../screens/DirectionsDefault';
import CalculationScreen from '../screens/Calculation';
import ItemSelect from '../screens/item_select';
import PromotionsScreen from '../screens/promotions';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';
import RegisterWithPhoneScreen from '../screens/registerWithPhoneNo';
import PhoneVerificationScreen from '../screens/phoneVerification';
import PhoneRegistrationCompleteScreen from '../screens/PhoneRegistrationComplete';
import SocialLogin from '../screens/SocialLogin';
import OrderList from '../screens/list';
import OrderDetail from '../screens/detail';
import ResetScreen from '../screens/reset';
import CheckoutScreen from '../screens/checkout';
import AuthLoadingScreen from '../screens/authLoading';
import MenuScreen from '../screens/menu';
import WalletScreen from '../screens/wallet';
import PaymentScreen from '../screens/Payment';
import { createBottomTabNavigator } from 'react-navigation';
import { MaterialIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import PhoneRegistrationComplete from '../screens/PhoneRegistrationComplete';

const HomeStack = createStackNavigator({
  Home: { screen: HomeScreen },
  InviteScreen: {
    screen: InviteTeamScreen,
    navigationOptions: {
      title: 'Invite',
    },
  },
});

const InviteTeamStack = createStackNavigator({
  InviteScreen: {
    screen: InviteTeamScreen,
    navigationOptions: {
      title: 'Invite',
    },
  },
});

const PromotionsStack = createStackNavigator({
  Promotions: {
    screen: PromotionsScreen,
    navigationOptions: {
      header: null,
    },
  },
});

const OrderListStack = createStackNavigator({
  List: {
    screen: OrderList,
    navigationOptions: {
      header: null,
    },
  },
});

const CheckoutStack = createStackNavigator({
  Checkout: {
    screen: CheckoutScreen,
    navigationOptions: {
      header: null,
    },
  },
});

const BottomTabs = createBottomTabNavigator(
  {
    Home: { screen: HomeStack },
    Invite: { screen: InviteTeamStack },
    // Cart: { screen: PromotionsStack },
    Promotions: { screen: PromotionsStack },
    CheckoutBottom: { screen: CheckoutStack },
    List: { screen: OrderListStack },
    // PinLocation: { screen: PinLocationScreen },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarLabel: ({ tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === 'Home') {
          return (
            <Text style={{ textAlign: 'center', color: tintColor }}>More</Text>
          );
        } else if (routeName === 'Cart') {
          return (
            <Text style={{ textAlign: 'center', color: tintColor }}>Cart</Text>
          );
        } else if (routeName === 'Invite') {
          return (
            <Text style={{ textAlign: 'center', color: tintColor }}>
              Invite Friends
            </Text>
          );
        } else if (routeName === 'Promotions') {
          return (
            <Text style={{ textAlign: 'center', color: tintColor }}>
              Search
            </Text>
          );
        } else if (routeName === 'CheckoutBottom') {
          return (
            <Text style={{ textAlign: 'center', color: tintColor }}>
              Checkout
            </Text>
          );
        } else if (routeName === 'List') {
          return (
            <Text style={{ textAlign: 'center', color: tintColor }}>
              Orders
            </Text>
          );
        } else if (routeName === 'PinLocation') {
          return (
            <Text style={{ textAlign: 'center', color: tintColor }}>
              Delivery
            </Text>
          );
        }
      },
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === 'Home') {
          return (
            <View
              style={{
                borderRadius: 25,
                padding: 5,
                backgroundColor: 'red',
                marginBottom: -5,
              }}
            >
              <MaterialIcons name="menu" size={18} color="white" />
            </View>
          );
        } else if (routeName === 'Cart') {
          return (
            <AntDesign
              style={{ marginBottom: -5 }}
              name="shoppingcart"
              size={24}
              color={tintColor}
            />
          );
        } else if (routeName === 'Invite') {
          return (
            <FontAwesome
              style={{ marginBottom: -5 }}
              name="user-plus"
              size={24}
              color={tintColor}
            />
          );
        } else if (routeName === 'Promotions') {
          return (
            <Feather
              style={{ marginBottom: -5 }}
              name="search"
              size={24}
              color={tintColor}
            />
          );
        } else if (routeName === 'CheckoutBottom') {
          return (
            <MaterialCommunityIcons
              style={{ marginBottom: -5 }}
              name="qrcode-scan"
              size={24}
              color={tintColor}
            />
          );
        } else if (routeName === 'List') {
          return (
            <Octicons
              style={{ marginBottom: -5 }}
              name="package"
              size={24}
              color={tintColor}
            />
          );
        } else if (routeName === 'PinLocation') {
          return (
            <MaterialCommunityIcons
              style={{ marginBottom: -5 }}
              name="truck-delivery"
              size={24}
              color={tintColor}
            />
          );
        }
      },
    }),
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: 'gray',
      activeBackgroundColor: '#2bae6a',
    },
    resetOnBlur: true,
  }
);

const AppNavigator = createStackNavigator(
  {
    Home: { screen: BottomTabs },
    Delivery: {
      screen: DeliveryScreen,
      navigationOptions: {
        header: null,
      },
    },
    PinLocation: {
      screen: PinLocationScreen,
      navigationOptions: {
        header: null,
      },
    },
    DropOff: {
      screen: DropOffScreen,
      navigationOptions: {
        header: null,
      },
    },
    Directions: {
      screen: DirectionsScreen,
      navigationOptions: {
        header: null,
      },
    },

    Calculation: { screen: CalculationScreen },
    ItemSelect: { screen: ItemSelect },
    Checkout: { screen: CheckoutScreen },
    Promotions: {
      screen: BottomTabs,
      navigationOptions: {
        header: null,
      },
    },
    List: { screen: OrderList },
    Menu: { screen: MenuScreen },
    Detail: { screen: OrderDetail },
    Wallet: { screen: WalletScreen },
    Payment: { screen: PaymentScreen },
    TrackOrder: {
      screen: TrackOrder,
      navigationOptions: {
        title: 'Your Order',
      },
    },
    DirectionsDefault: {
      screen: DirectionsDefaultScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'Promotions',
  }
);

const LoginNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Register: { screen: RegisterScreen },
  RegisterWithPhone: { screen: RegisterWithPhoneScreen },
  PhoneVerification: {
    screen: PhoneVerificationScreen,
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#27ae60',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerLeft: null,
      title: 'Verification',
    },
  },
  PhoneRegistrationComplete: { screen: PhoneRegistrationCompleteScreen },
  SocialLogin: { screen: SocialLogin },
  Reset: { screen: ResetScreen },
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppNavigator,
      Login: LoginNavigator,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);
