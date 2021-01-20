import React, {Component} from 'react';
import {
  Text,
  View,
  StatusBar,
  ActivityIndicator,
  BackHandler,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {Header, Container, Button, Icon, Input, Item} from 'native-base';
import {colors} from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetLocation from 'react-native-get-location';
import Geocoder from 'react-native-geocoding';
import axios from 'axios';
Geocoder.init('AIzaSyDhd8oEV76Rjc8Xk4KV-Wdmz2E_u9bD4iM');
export class SettingsScreen extends Component {
  state = {
    loading: false,
    name: '',
    address: '',
    userData: {},
    loginLocation: {longitude: '', latitude: '', address: ''},
  };

  async componentDidMount() {
    await this.requestPermissions();
    this.getCurrentLocation();
    try {
      const value = await AsyncStorage.getItem('userData');
      if (value != null) {
        this.setState(
          {
            userData: JSON.parse(value),
          },
          () => {
            console.log(this.state.userData);
          },
        );
      }
    } catch (e) {
      console.log(e);
      // error reading value
    }
  }
  requestPermissions = async () => {
    ///requesting permissions
    try {
      if (Platform.OS === 'android') {
        const userResponse = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return userResponse;
      }
    } catch (err) {
      Warning(err);
    }
    return null;
  };
  getCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        Geocoder.from(
          parseFloat(location.latitude),
          parseFloat(location.longitude),
        )
          .then((json) => {
            let address = '';
            /////this is what you should not bother about. This is actually removing 'unnamed road' string from the users current location string returned from this geolocation api
            for (let obj of json.results) {
              /////the better for loop from ES6
              if (
                obj.address_components[0].short_name.toLowerCase() !=
                'unnamed road'
              ) {
                if (
                  obj.formatted_address.split(', ')[0].toLowerCase() !=
                  'unnamed road'
                ) {
                  for (let [index, obj0] of obj.formatted_address
                    .split(', ')
                    .entries()) {
                    if (
                      index ===
                      obj.formatted_address.split(', ').length - 1
                    ) {
                      address += `${obj0}`;
                    } else {
                      address += `${obj0}, `;
                    }
                  }
                  break;
                }
              }
            }

            let loginLocation = this.state.loginLocation;
            loginLocation.latitude = location.latitude;
            loginLocation.longitude = location.longitude;
            loginLocation.address = address;
            this.setState({loginLocation: loginLocation}, () => {
              address = '';
              console.log(loginLocation);
            });
          })
          .catch((error) => console.warn(error));
      })
      .catch((error) => {
        const {code, message} = error;
        console.log('bruh', message);
        Alert.alert(
          message,
          'Please turn on your location.',
          [
            {
              text: '',
              onPress: () => console.log('Ask me later pressed'),
            },
            {
              text: '',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => console.log('ok')},
          ],
          {cancelable: false},
        );
      });
  };

  /////updating user settings
  updateSettings = async () => {
    const state = this.state;
    if (state.name.trim() !== '') {
      if (state.address.trim() !== '') {
        this.setState({loading: true});
        const formData = new FormData();
        formData.append('action', 'updateUser');
        formData.append('email', this.state.userData.email);
        formData.append('name', this.state.name);
        formData.append('inputAdress', this.state.address);
        formData.append('actualAddress', this.state.loginLocation.address);
        formData.append('actualLatitude', this.state.loginLocation.latitude);
        formData.append('actualLongitude', this.state.loginLocation.longitude);
        axios({
          method: 'post',
          url: 'https://peoplesitdevelopers.com/testapi/apis/',
          headers: {'Content-type': 'application/json'},
          data: formData,
        })
          .then(async (res) => {
            console.log(res);
            if (res.data.status == 200) {
              try {
                await AsyncStorage.removeItem('userData');
                await AsyncStorage.setItem(
                  'userData',
                  JSON.stringify(res.data.userData),
                );
                this.setState({
                  loading: false,
                  name: '',
                  address: '',
                  userData: res.data.userData,
                });
                Alert.alert(
                  'Success',
                  'Your info submitted successfully',
                  [
                    {
                      text: '',
                      onPress: () => console.log('Ask me later pressed'),
                    },
                    {
                      text: '',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ],
                  {cancelable: false},
                );
              } catch (e) {
                console.log(e);
                // saving error
              }
            }
          })
          .catch((e) => {
            console.log(e);
          });
        // try {
        //   await AsyncStorage.removeItem('userData');

        // } catch (e) {
        //   console.log(e);
        //   // saving error
        // }
      } else {
        alert('Enter address');
      }
    } else {
      alert('Enter name');
    }
  };
  render() {
    return (
      <Container>
        <Header
          style={{
            backgroundColor: colors.app,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Icon
            name="ios-exit-outline"
            style={{color: 'white'}}
            onPress={async () => {
              await AsyncStorage.removeItem('userData');
              Alert.alert('Hold on!', 'Are you sure want to exit the app?', [
                {
                  text: 'Cancel',
                  onPress: () => null,
                  style: 'cancel',
                },
                {text: 'YES', onPress: () => BackHandler.exitApp()},
              ]);
            }}
          />
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              textAlignVertical: 'center',
            }}>
            &copy;Demo App
          </Text>
          <Icon
            name="ios-map-outline"
            style={{color: 'white'}}
            onPress={() => {
              this.props.navigation.navigate('LocationScreen', {
                userData: this.state.userData,
              });
            }}
          />
        </Header>
        <View
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
          }}>
          <Item
            style={{
              alignSelf: 'center',
              width: '90%',
              borderColor: colors.app,
            }}>
            <Icon name="ios-person-outline" />
            <Input
              onChangeText={(txt) => {
                this.setState({name: txt});
              }}
              value={this.state.name}
              autoCapitalize="words"
              placeholder="Enter your name"
              style={{alignSelf: 'center'}}
            />
          </Item>
          <Item
            style={{
              alignSelf: 'center',
              width: '90%',
              borderColor: colors.app,
            }}>
            <Icon name="ios-location-outline" />
            <Input
              value={this.state.address}
              onChangeText={(txt) => {
                this.setState({address: txt});
              }}
              style={{alignSelf: 'center'}}
              placeholder="Enter your address"
            />
          </Item>
          <Button
            disabled={this.state.loading}
            onPress={() => {
              this.updateSettings();
            }}
            style={{
              backgroundColor: this.state.loading ? 'grey' : colors.app,
              width: '90%',
              alignSelf: 'center',
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this.state.loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{color: 'white', fontWeight: 'bold'}}>Submit</Text>
            )}
          </Button>
        </View>
        <StatusBar backgroundColor={colors.app} />
      </Container>
    );
  }
}

export default SettingsScreen;
