import React, { Component } from 'react';
import {
  View,
  Button,
  AppRegistry,
  StyleSheet,
  Text,
  Linking,
  Platform,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  SafeAreaView,
  Dimensions,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  AsyncStorage,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { Icon, List, ListItem } from 'react-native-elements';
import { headerOptions, rightMenu } from '../styles/header';
import { logout, setAppState, i18n, i18nT } from '../store/appActions';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

import marker from '../../assets/map/pin.png';

class CalculationScreen extends Component {
  // static navigationOptions = {...headerOptions, headerRight: rightMenu, title: i18n.t('home.title')}

  constructor(props) {
    super(props);
    this.data = this.props.navigation.state.params;
    this.state = {
      sender_name: '',
      hazards: '',
      time: 'express',
      unit: 'cm',
      height: '',
      width: '',
      length: '',
      weight: '',
      distance_in_km: this.data.distance_in_km,
      total_price: '',
    };
  }
  componentDidMount() {
    console.log('this.state.distance_in_km');
    console.log(this.state.distance_in_km);
  }

  onSuccess = (e) => {};

  getPrice = () => {
    if (
      this.state.weight == '' ||
      this.state.length == '' ||
      this.state.width == '' ||
      this.state.height == '' ||
      this.state.unit == ''
    ) {
      Alert.alert(
        'Error',
        'Please fill all fields',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    } else {
      var ret = this.state.distance_in_km.split(' ');
      console.log('ret');
      console.log(ret);

      console.log('values -------------- values');
      console.log('weight');
      console.log(this.state.weight);
      console.log('size');
      console.log(this.state.height * this.state.width * this.state.length);
      console.log('Distance');
      console.log(ret[0]);
      console.log('delivery option');
      console.log(this.state.time);

      fetch(
        `http://restaurant-api.pickgo.la/api/order/calculate-price?access_token=${this.props.app.access_token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            weight: this.state.weight,
            size: this.state.height * this.state.width * this.state.length,
            distance: ret[0],
            delivery_option: this.state.time,
          }),
        }
      )
        .then((res) => res.json())
        .then(async (response) => {
          console.log(response);
          if (response.success) {
            this.setState({ total_price: response.result.total_price });
          } else {
            Alert.alert(
              'Error',
              response.message,
              [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
              { cancelable: false }
            );
          }
        })
        .catch((error) => alert('Please Check Your Internet Connection'));
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    const { app, logout, setAppState, i18nT } = this.props;
    const time_placeholder = {
      label: 'Delivery Option',
      value: null,
      color: '#9EA0A4',
    };
    const unit_placeholder = {
      label: 'Unit',
      value: null,
      color: '#9EA0A4',
    };
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            width: '100%',
            alignContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={{ width: '90%' }}>
            <View style={{ width: '100%', marginTop: 10 }}>
              <TextInput
                style={{
                  height: 40,
                  borderBottomColor: '#e9e9e9',
                  borderBottomWidth: 1,
                  fontSize: 17,
                  paddingBottom: 10,
                }}
                placeholder={'Company Name or Sender Name'}
                onChangeText={(sender_name) => {
                  this.setState({ sender_name });
                }}
                value={this.state.sender_name}
              />
            </View>
            <View style={{ width: '100%', marginTop: 10 }}>
              <TextInput
                style={{
                  height: 40,
                  borderBottomColor: '#e9e9e9',
                  borderBottomWidth: 1,
                  fontSize: 17,
                  paddingBottom: 10,
                }}
                placeholder={'Hazards or Careful Break?'}
                onChangeText={(hazards) => {
                  this.setState({ hazards });
                }}
                value={this.state.hazards}
              />
            </View>
            <View
              style={{
                width: '100%',
                marginTop: 10,
                borderBottomColor: '#e9e9e9',
                borderBottomWidth: 1,
              }}
            >
              <RNPickerSelect
                value={this.state.time}
                placeholder={time_placeholder}
                onValueChange={(value) => this.setState({ time: value })}
                style={{
                  inputAndroid: {
                    fontSize: 24,
                    color: '#000',
                  },
                  iconContainer: {
                    top: 5,
                    right: 15,
                  },
                }}
                items={[{ label: 'As soon as possible', value: 'express' }]}
                onValueChange={(value) => {
                  this.setState({
                    time: value,
                  });
                }}
              />
            </View>
            <View
              style={{
                width: '100%',
                marginTop: 10,
                borderBottomColor: '#e9e9e9',
                borderBottomWidth: 1,
              }}
            >
              <RNPickerSelect
                placeholder={unit_placeholder}
                value={this.state.unit}
                style={{
                  inputAndroid: {
                    fontSize: 24,
                    color: '#000',
                  },
                  iconContainer: {
                    top: 5,
                    right: 15,
                  },
                }}
                items={[
                  { label: 'CM', value: 'cm' },
                  { label: 'INCH', value: 'inch' },
                ]}
                onValueChange={(value) => {
                  this.setState({
                    unit: value,
                  });
                }}
              />
            </View>
            <View style={{ width: '100%', marginTop: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'space-between',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ width: '48%', marginTop: 10 }}>
                  <TextInput
                    style={{
                      height: 40,
                      borderBottomColor: '#e9e9e9',
                      borderBottomWidth: 1,
                      fontSize: 17,
                      paddingBottom: 10,
                    }}
                    placeholder={'H'}
                    onChangeText={(height) => {
                      this.setState({ height });
                    }}
                    value={this.state.height}
                  />
                </View>
                <View style={{ width: '48%', marginTop: 10 }}>
                  <TextInput
                    style={{
                      height: 40,
                      borderBottomColor: '#e9e9e9',
                      borderBottomWidth: 1,
                      fontSize: 17,
                      paddingBottom: 10,
                    }}
                    placeholder={'W'}
                    onChangeText={(width) => {
                      this.setState({ width });
                    }}
                    value={this.state.width}
                  />
                </View>
              </View>
            </View>
            <View style={{ width: '100%', marginTop: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'space-between',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ width: '48%', marginTop: 10 }}>
                  <TextInput
                    style={{
                      height: 40,
                      borderBottomColor: '#e9e9e9',
                      borderBottomWidth: 1,
                      fontSize: 17,
                      paddingBottom: 10,
                    }}
                    placeholder={'L'}
                    onChangeText={(length) => {
                      this.setState({ length });
                    }}
                    value={this.state.length}
                  />
                </View>
                <View style={{ width: '48%', marginTop: 10 }}>
                  <TextInput
                    style={{
                      height: 40,
                      borderBottomColor: '#e9e9e9',
                      borderBottomWidth: 1,
                      fontSize: 17,
                      paddingBottom: 10,
                    }}
                    placeholder={'Weight'}
                    onChangeText={(weight) => {
                      this.setState({ weight });
                    }}
                    value={this.state.weight}
                  />
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View
                style={{
                  width: '50%',
                  alignContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View style={{ width: '95%', backgroundColor: '#fff' }}>
                  <Text
                    style={{
                      fontSize: 28,
                      color: '#000',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    Distance
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: '50%',
                  alignContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View style={{ width: '95%', backgroundColor: '#fff' }}>
                  <Text
                    style={{
                      fontSize: 28,
                      color: '#000',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    Total Price
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  width: '50%',
                  alignContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: '95%',
                    paddingVertical: 10,
                    marginVertical: 10,
                    borderRadius: 25,
                    borderColor: '#e9e9e9',
                    borderWidth: 1,
                    backgroundColor: '#fff',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      color: '#000',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    {this.state.distance_in_km}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: '50%',
                  alignContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: '95%',
                    paddingVertical: 10,
                    marginVertical: 10,
                    borderRadius: 25,
                    borderColor: '#e9e9e9',
                    borderWidth: 1,
                    backgroundColor: '#fff',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      color: '#000',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    {this.state.total_price}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ width: '100%', marginTop: 50 }}>
              <TouchableOpacity
                onPress={() => {
                  this.getPrice();
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#26b050',
                  paddingVertical: 15,
                }}
              >
                <Text
                  style={{ textAlign: 'center', color: '#fff', fontSize: 22 }}
                >
                  CALCULATE
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: '100%', marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  console.log('this');
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#26b050',
                  paddingVertical: 15,
                }}
              >
                <Text
                  style={{ textAlign: 'center', color: '#fff', fontSize: 22 }}
                >
                  CALCULATE & SUBMIT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
const styles = {
  MyPinContainer: {
    zIndex: 9,
    flex: 1,
    position: 'absolute',
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    left: deviceWidth - 70,
    top: '15%',
    borderRadius: 50,
    shadowColor: '#000000',
    elevation: 7,
    shadowRadius: 5,
    shadowOpacity: 1.0,
    justifyContect: 'center',
    alignItem: 'center',
    alignContent: 'center',
  },
  markerFixed: {
    left: '50%',
    marginLeft: -14,
    marginTop: -110,
    position: 'absolute',
    top: '60%',
    height: 32,
    width: 32,
  },
  marker: {
    height: '100%',
    width: '100%',
  },
  mainbody: {
    flex: 1,
  },
  mainContainer: {
    flex: 1.0,
    backgroundColor: 'white',
  },
  safeAreaStyle: {
    flex: 1.0,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    height: 44,
    flexDirection: 'row',
    justifyContect: 'center',
    backgroundColor: '#EDEDED',
  },
  headerTitle: {
    flex: 1.0,
    textAlign: 'center',
    alignSelf: 'center',
    color: '#000',
  },
  menuButton: {
    paddingLeft: 8,
    paddingRight: 8,
    width: 50,
    alignSelf: 'center',
    tintColor: '#000',
  },
  menuContainer: {
    flex: 1.0,
    backgroundColor: '#EDEDED',
  },
  menuTitleContainer: {
    alignContent: 'flex-start',
    height: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContect: 'flex-start',
    paddingLeft: 5,
  },
  menuTitle: {
    color: '#000000',
    fontSize: 17,
  },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  drawerMenuHeader: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    paddingBottom: 15,
    borderBottomColor: '#808080',
  },
  map: {
    height: (deviceHeight * 2) / 2,
  },
  maps: {
    height: (deviceHeight * 2) / 3.5,
  },
};
export default connect((store) => ({ app: store.app }), {
  logout,
  setAppState,
  i18nT,
})(CalculationScreen);
