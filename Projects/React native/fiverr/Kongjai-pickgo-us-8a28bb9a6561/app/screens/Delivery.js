/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
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
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  AsyncStorage,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import Material from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { connect } from 'react-redux';
import * as Location from 'expo-location';
import MapView, { Polyline, Marker } from 'react-native-maps';
import PolyLine from '@mapbox/polyline';
import { Icon, List, ListItem } from 'react-native-elements';
import { headerOptions, rightMenu } from '../styles/header';
import {
  logout,
  setAppState,
  i18n,
  i18nT,
  setPickupCoords,
} from '../store/appActions';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
import marker from '../../assets/map/pin.png';
import marker_img_drop from '../../assets/map/pin.png';
import marker_img_pick from '../../assets/map/box.png';
import { TextField } from 'react-native-material-textfield';

class DeliveryScreen extends Component {
  // static navigationOptions = {...headerOptions, headerRight: rightMenu, title: i18n.t('home.title')}

  constructor(props) {
    super(props);
    this.state = {
      lat: '',
      lng: '',
      region: null,
      pointCoords_values: [],
      status: '',
      current_loc: null,
      pointCoords_dropoff: { latitude: 1, longitude: 1 },
      predictions_dropoff: [],
      dropoff: '',
      address_to: '',
      pointCoords_pickup: { latitude: 1, longitude: 1 },
      predictions_pickup: [],
      pickup: '',
      address_from: '',
      userLocation: {},
      distanceInKM: 0,
      calculatingPrice: false,
      calculatedPrice: '9.99',
      cmValue: 45,
      weightValue: 2,
      timeValue: 'normal',
      tempValue: 'regular',
      name: '',
      email: '',
      index: 1,
      calculate: false,
      fetchingUserLocation: false,
    };
  }

  componentDidMount() {
    this._getLocationAsync();
    this.calculatePrice();
  }

  _getLocationAsync = async (animateToMarker = true) => {
    this.setState({ fetchingUserLocation: true });
    try {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }
      const location = await Location.getCurrentPositionAsync({});
      this.setState({
        userLocation: location.coords,
      });
      if (animateToMarker) {
        this.fullMap.animateCamera(
          { center: location.coords, zoom: 15 },
          { duration: 100 }
        );
      }
      this.setState({ fetchingUserLocation: false });
      return location.coords;
    } catch (err) {
      this._getLocationAsync();
    }
  };

  calculateDistance = async (pickupCoords, dropoffCoords) => {
    const distance_response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=kilometers&origins=${pickupCoords.latitude},${pickupCoords.longitude}
  &destinations=${dropoffCoords.latitude},${dropoffCoords.longitude}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`);
    const json_distance = await distance_response.json();
    if (json_distance.status == 'OK') {
      const distance_in_kilometer =
        json_distance.rows[0].elements[0].distance.value;
      this.setState({
        distanceInKM: distance_in_kilometer,
      });
    } else {
      alert('Distance could not be fetched');
    }
  };

  calculateDistanceReturn = async (pickupCoords, dropoffCoords) => {
    const distance_response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=kilometers&origins=${pickupCoords.latitude},${pickupCoords.longitude}
  &destinations=${dropoffCoords.latitude},${dropoffCoords.longitude}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`);
    const json_distance = await distance_response.json();
    if (json_distance.status == 'OK') {
      const distance_in_kilometer =
        json_distance.rows[0].elements[0].distance.value;
      console.log(distance_in_kilometer);
      return distance_in_kilometer / 1000;
    } else {
      alert('Distance could not be fetched');
    }
  };

  showPath = async (pickupCoords, dropoffCoords) => {
    let from_lat = pickupCoords.latitude;
    let from_lng = pickupCoords.longitude;
    let to_lat = dropoffCoords.latitude;
    let to_lng = dropoffCoords.longitude;
    const responses = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${from_lat},${from_lng}&destination=${to_lat},${to_lng}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`
    );
    let json_destinations = await responses.json();
    if (json_destinations.status == 'ZERO_RESULTS') {
      this.setState({ status: true });
    } else {
      const points = PolyLine.decode(
        json_destinations.routes[0].overview_polyline.points
      );
      const pointCoordss = points.map((point) => {
        return { latitude: point[0], longitude: point[1] };
      });
      if (pointCoordss) {
        const distance_response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=kilometers&origins=${from_lat},${from_lng}
    &destinations=${to_lat},${to_lng}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`);
        let json_distance = await distance_response.json();
        if (json_distance.status == 'OK') {
          const distance_in_kilometer =
            json_distance.rows[0].elements[0].distance.text;
          this.setState({
            distance_in_km: distance_in_kilometer,
            pointCoords_values: pointCoordss,
          });
          this.smallMap.fitToCoordinates(pointCoordss, {
            edgePadding: { top: 10, left: 10, right: 10, bottom: 10 },
          });
        } else {
          alert('Distance could not be fetched');
        }
      }
    }
  };

  onRegionChange = (region) => {
    this.setState({
      region,
    });
    if (this.state.index === 1) {
      this.getDropOffMarker(region, '', 'region');
    } else if (this.state.index === 2) {
      this.getpickupMarker(region, '', 'region');
    }
  };

  onChangeDropoff = async (dropoff) => {
    this.setState({ dropoff });
    const apiUrl =
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0&input=' +
      dropoff;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      this.setState({ predictions_dropoff: json.predictions });
    } catch (err) {
      this.setState({ status: true });
      // alert("We Do not operate in this area")
    }
  };

  onChangePickup = async (pickup) => {
    this.setState({ pickup });
    const apiUrl =
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0&input=' +
      pickup;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      this.setState({ predictions_pickup: json.predictions });
    } catch (err) {
      this.setState({ status: true });
      // alert("We Do not operate in this area")
    }
  };

  getDropOffMarker = async (destinationPlaceId, destinationName, pick_from) => {
    try {
      this.setState({
        pointCoords: [],
      });
      if (pick_from == 'id') {
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${destinationPlaceId}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`;
        const response = await fetch(apiUrl);
        const json = await response.json();
        let details = json.results[0];
        if (details != undefined) {
          let other_detail = details.address_components.find(
            (item) => item.long_name == 'Pakistan'
          );
          if (!other_detail) {
            other_detail = details.address_components.find(
              (item) => item.long_name == 'Skardu'
            );
          }
          if (!other_detail) {
            other_detail = details.address_components.find(
              (item) => item.long_name == 'Gilgit'
            );
          }
          if (!other_detail) {
            other_detail = 'other';
          }
          let country_name_from = other_detail.long_name;
          if (json.status == 'ZERO_RESULTS') {
            this.setState({ status: true });
          } else if (json.status == 'INVALID_REQUEST') {
            this.setState({
              status: true,
            });
          } else {
            this.setState({
              status: false,
              country_from: country_name_from,
            });
            const latitude = json.results[0].geometry.location.lat;
            const longitude = json.results[0].geometry.location.lng;
            const pointCoords_dropoff = {
              latitude: latitude,
              longitude: longitude,
            };
            this.setState({
              pointCoords_dropoff,
              predictions_dropoff: [],
              dropoff: destinationName,
              address_to: destinationName,
            });
            Keyboard.dismiss();
            this.fullMap.animateCamera(
              { center: pointCoords_dropoff, zoom: 15 },
              { duration: 100 }
            );
          }
        } else {
          this.setState({ status: true });
          // alert("We Do Not Operate in this area")
        }
      }
      if (pick_from == 'region') {
        const NameApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${destinationPlaceId.latitude},${destinationPlaceId.longitude}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`;
        const response_nameApi = await fetch(NameApiUrl);
        const json_nameApi = await response_nameApi.json();

        let details = json_nameApi.results[0];

        if (details != undefined) {
          let other_detail = details.address_components.find(
            (item) => item.long_name == 'Pakistan'
          );
          if (!other_detail) {
            other_detail = details.address_components.find(
              (item) => item.long_name == 'Skardu'
            );
          }
          if (!other_detail) {
            other_detail = details.address_components.find(
              (item) => item.long_name == 'Gilgit'
            );
          }
          if (!other_detail) {
            other_detail = 'other';
          }
          let country_name_from = other_detail.long_name;
          if (json_nameApi.status == 'ZERO_RESULTS') {
            this.setState({
              status: true,
            });
          } else if (json_nameApi.status == 'INVALID_REQUEST') {
            this.setState({
              status: true,
            });
          } else {
            this.setState({
              status: false,
              country_from: country_name_from,
            });
            destinationName = json_nameApi.results[0].formatted_address;
            const pointCoords_dropoff = {
              latitude: destinationPlaceId.latitude,
              longitude: destinationPlaceId.longitude,
            };
            this.setState({
              pointCoords_dropoff,
              predictions_dropoff: [],
              dropoff: destinationName,
              address_to: destinationName,
            });
            Keyboard.dismiss();
          }
        } else {
          this.setState({ status: true });
          // alert("We Do Not Operate in this area")
        }
      }
    } catch (err) {
      this.setState({ status: true });
      // alert("We Do Not Operate in this area")
    }
  };

  getpickupMarker = async (destinationPlaceId, destinationName, pick_from) => {
    try {
      this.setState({
        pointCoords: [],
      });
      console.log('here called');
      if (pick_from == 'id') {
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${destinationPlaceId}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`;
        const response = await fetch(apiUrl);
        const json = await response.json();
        let details = json.results[0];
        console.log(details);
        if (details != undefined) {
          let other_detail = details.address_components.find(
            (item) => item.long_name == 'Pakistan'
          );
          if (!other_detail) {
            other_detail = details.address_components.find(
              (item) => item.long_name == 'Skardu'
            );
          }
          if (!other_detail) {
            other_detail = details.address_components.find(
              (item) => item.long_name == 'Gilgit'
            );
          }
          if (!other_detail) {
            other_detail = 'other';
          }
          let country_name_from = other_detail.long_name;
          if (json.status == 'ZERO_RESULTS') {
            this.setState({ status: true });
          } else if (json.status == 'INVALID_REQUEST') {
            this.setState({
              status: true,
            });
          } else {
            this.calculatePrice();
            this.setState({
              status: false,
              country_from: country_name_from,
            });
            const latitude = json.results[0].geometry.location.lat;
            const longitude = json.results[0].geometry.location.lng;
            const pointCoords_pickup = {
              latitude: latitude,
              longitude: longitude,
            };
            this.setState({
              pointCoords_pickup,
              predictions_pickup: [],
              pickup: destinationName,
              address_from: destinationName,
            });
            Keyboard.dismiss();
            this.fullMap.animateCamera(
              { center: pointCoords_pickup, zoom: 15 },
              { duration: 100 }
            );
          }
        } else {
          this.setState({ status: true });
          // alert("We Do Not Operate in this area")
        }
      }
      if (pick_from == 'region') {
        const NameApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${destinationPlaceId.latitude},${destinationPlaceId.longitude}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`;
        const response_nameApi = await fetch(NameApiUrl);
        const json_nameApi = await response_nameApi.json();

        let details = json_nameApi.results[0];

        if (details != undefined) {
          let other_detail = details.address_components.find(
            (item) => item.long_name == 'Pakistan'
          );
          if (!other_detail) {
            other_detail = details.address_components.find(
              (item) => item.long_name == 'Skardu'
            );
          }
          if (!other_detail) {
            other_detail = details.address_components.find(
              (item) => item.long_name == 'Gilgit'
            );
          }
          if (!other_detail) {
            other_detail = 'other';
          }
          let country_name_from = other_detail.long_name;
          if (json_nameApi.status == 'ZERO_RESULTS') {
            this.setState({
              status: true,
            });
          } else if (json_nameApi.status == 'INVALID_REQUEST') {
            this.setState({
              status: true,
            });
          } else {
            this.setState({
              status: false,
              country_from: country_name_from,
            });
            destinationName = json_nameApi.results[0].formatted_address;
            const pointCoords_pickup = {
              latitude: destinationPlaceId.latitude,
              longitude: destinationPlaceId.longitude,
            };
            this.setState({
              pointCoords_pickup,
              predictions_pickup: [],
              pickup: destinationName,
              address_from: destinationName,
            });
            Keyboard.dismiss();
          }
        } else {
          this.setState({ status: true });
          // alert("We Do Not Operate in this area")
        }
      }
    } catch (err) {
      this.setState({ status: true });
      // alert("We Do Not Operate in this area")
    }
  };

  calculatePrice = async () => {
    try {
      const {
        cmValue,
        weightValue,
        timeValue,
        tempValue,
        distanceInKM,
        pickup,
        dropoff,
      } = this.state || {};
      console.log(
        pickup,
        this.state.pointCoords_pickup,
        this.state.pointCoords_dropoff
      );
      const distance = await this.calculateDistanceReturn(
        this.state.pointCoords_pickup,
        this.state.pointCoords_dropoff
      );
      console.log(distance);
      if (cmValue && weightValue && timeValue && tempValue) {
        this.setState({ calculatingPrice: true, calculate: true });
        const response = await fetch(
          `http://restaurant-api.pickgo.la/api/order/calculate-price?access_token=Leli9NWs1LPd7covQV3Okjeq62prGBZuaDxzXoEuUbNGE5KRiOHhgnTlJS7YFS0P-2`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              weight: weightValue,
              size: cmValue,
              distance: distance,
              delivery_option: timeValue ? timeValue : 'express',
              delivery_temprature: tempValue,
              pickup_location: pickup,
              delivery_location: dropoff,
              driver_ids: '4,5,6,7',
            }),
          }
        );
        const resJSON = await response.json();
        console.log('price', resJSON);
        if (resJSON && resJSON.success) {
          this.setState({
            calculatedPrice: resJSON.result.total_price,
            calculatingPrice: false,
          });
        } else if (this.state.calculate) {
          this.calculatePrice();
          this.setState({
            calculate: false,
          });
        }
      }
      //remove below line later
      // this.setState({ calcultedPrice: 37.8 });
      //remove above line later
      this.setState({ calculatingPrice: false });
    } catch (err) {
      this.setState({ calculatingPrice: false });
    }
  };

  dropDownData = {
    cm: [
      { label: '45 CM', value: 45 },
      { label: '50 CM', value: 50 },
      { label: '55 CM', value: 55 },
      { label: '60 CM', value: 60 },
      { label: '65 CM', value: 65 },
    ],
    weight: [
      { label: '2 KG', value: 2 },
      { label: '10 KG', value: 10 },
      { label: '50 KG', value: 50 },
      { label: '150 KG', value: 150 },
      { label: '300 KG', value: 300 },
    ],
    time: [
      { label: 'ASAP', value: 'express' },
      { label: 'Normal', value: 'normal' },
      { label: 'Next Day', value: 'next day' },
      { label: '2 Days', value: '2 days' },
      { label: '5 Days', value: '5 days' },
    ],
    temp: [
      { label: 'Regular', value: 'regular' },
      { label: 'Frozen', value: 'frozen' },
    ],
  };

  render() {
    const { navigate } = this.props.navigation;
    const { app, logout, setAppState, i18nT } = this.props;
    const predictions_dropoff = this.state.predictions_dropoff.map(
      (prediction, index) => (
        <TouchableHighlight
          key={index}
          onPress={() =>
            this.getDropOffMarker(
              prediction.place_id,
              prediction.structured_formatting.main_text,
              'id'
            )
          }
        >
          <View>
            <Text
              style={{
                backgroundColor: '#fff',
                padding: 8,
                fontSize: 15,
                borderWidth: 0.3,
              }}
            >
              {prediction.structured_formatting.main_text}
            </Text>
          </View>
        </TouchableHighlight>
      ),
      <Text>Dropoff</Text>
    );

    const predictions_pickup = this.state.predictions_pickup.map(
      (prediction, index) => (
        <TouchableHighlight
          key={index}
          onPress={() =>
            this.getpickupMarker(
              prediction.place_id,
              prediction.structured_formatting.main_text,
              'id'
            )
          }
        >
          <View>
            <Text
              style={{
                backgroundColor: '#fff',
                padding: 8,
                fontSize: 15,
                borderWidth: 0.3,
              }}
            >
              {prediction.structured_formatting.main_text}
            </Text>
          </View>
        </TouchableHighlight>
      ),
      <Text>Pickup</Text>
    );

    return (
      <View style={{ flex: 1 }}>
        {this.state.index === 1 ? (
          <>
            <View
              style={{
                position: 'absolute',
                top: '18%',
                left: '3%',
                right: '3%',
                zIndex: 2,
              }}
            >
              {this.state.predictions_dropoff ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#fff',
                    }}
                  >
                    {predictions_dropoff}
                  </View>
                </View>
              ) : null}
            </View>
            <View
              style={{
                position: 'absolute',
                top: '8%',
                left: '3%',
                right: '3%',
                zIndex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 5,
                  paddingVertical: 8,
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  elevation: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigate('PinLocation');
                  }}
                  style={{ marginRight: 5, flex: 0.1 }}
                >
                  <Icon
                    name="arrow-left"
                    type="font-awesome"
                    size={18}
                    color="#26b050"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flex: 0.7,
                    alignItems: 'center',
                  }}
                >
                  <TextInput
                    style={{
                      fontSize: 12,
                      width: '100%',
                    }}
                    editable={!this.state.fetchingUserLocation}
                    onChangeText={(dropoff) => this.onChangeDropoff(dropoff)}
                    value={this.state.dropoff}
                    placeholder={'Drop off Location'}
                    selection={{ start: 0 }}
                  />
                </View>
                <View style={{ flex: 0.2 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ width: '50%' }}>
                      <Icon
                        name="search"
                        size={18}
                        type="font-awesome"
                        color="#26b050"
                      />
                    </View>
                    <View style={{ width: '50%' }}>
                      <Icon
                        name="compass"
                        type="font-awesome"
                        size={22}
                        color="#26b050"
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : this.state.index === 2 ? (
          <>
            <View
              style={{
                position: 'absolute',
                top: '18%',
                left: '3%',
                right: '3%',
                zIndex: 2,
              }}
            >
              {this.state.predictions_pickup ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#fff',
                    }}
                  >
                    {predictions_pickup}
                  </View>
                </View>
              ) : null}
            </View>
            <View
              style={{
                position: 'absolute',
                top: '8%',
                left: '3%',
                right: '3%',
                zIndex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 5,
                  paddingVertical: 8,
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  elevation: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ index: 1 });
                  }}
                  style={{ marginRight: 5, flex: 0.1 }}
                >
                  <Icon
                    name="arrow-left"
                    type="font-awesome"
                    size={18}
                    color="#26b050"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flex: 0.7,
                    alignItems: 'center',
                  }}
                >
                  <TextInput
                    style={{
                      fontSize: 12,
                      width: '100%',
                    }}
                    editable={!this.state.fetchingUserLocation}
                    onChangeText={(pickup) => this.onChangePickup(pickup)}
                    value={this.state.pickup}
                    placeholder={'Pick up Location'}
                    selection={{ start: 0 }}
                  />
                </View>
                <View style={{ flex: 0.2 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ width: '50%' }}>
                      <Icon
                        name="search"
                        size={18}
                        type="font-awesome"
                        color="#26b050"
                      />
                    </View>
                    <View style={{ width: '50%' }}>
                      <Icon
                        name="compass"
                        type="font-awesome"
                        size={22}
                        color="#26b050"
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View
            style={{
              position: 'absolute',
              top: '6%',
              left: '3%',
              right: '3%',
              zIndex: 1,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 5,
                paddingVertical: 8,
                backgroundColor: '#fff',
                borderRadius: 5,
                elevation: 5,
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({ index: 2 });
                }}
                style={{ marginRight: 5, flex: 0.1 }}
              >
                <Icon
                  name="arrow-left"
                  type="font-awesome"
                  size={18}
                  color="#26b050"
                />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 0.9,
                }}
              >
                <Text
                  style={{ flex: 0.45, textAlign: 'center' }}
                  numberOfLines={1}
                >
                  {this.state.pickup}
                </Text>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 0.1,
                  }}
                >
                  <MaterialIcons name="arrow-forward" size={18} color="black" />
                </View>
                <Text
                  style={{ flex: 0.45, textAlign: 'center' }}
                  numberOfLines={1}
                >
                  {this.state.dropoff}
                </Text>
              </View>
            </View>
          </View>
        )}
        {this.state.index === 1 ? (
          <View
            style={{
              position: 'absolute',
              left: '5%',
              right: '5%',
              bottom: '3.5%',
              zIndex: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ index: 2 });
                this._getLocationAsync();
              }}
              style={{
                backgroundColor: '#8a43fb',
                paddingVertical: 5,
                borderRadius: 25,
              }}
              disabled={this.state.fetchingUserLocation}
            >
              {this.state.fetchingUserLocation ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <ActivityIndicator
                    style={{ alignSelf: 'center' }}
                    color={'#fff'}
                  />
                  <Text style={{ color: '#fff', marginLeft: 10 }}>
                    Fetching Current Location for Dropoff
                  </Text>
                </View>
              ) : (
                <Text
                  style={{ textAlign: 'center', color: '#fff', fontSize: 22 }}
                >
                  DROP OFF HERE
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}
        {this.state.index === 2 ? (
          <View
            style={{
              position: 'absolute',
              left: '5%',
              right: '5%',
              bottom: '3.5%',
              zIndex: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.showPath(
                  this.state.pointCoords_pickup,
                  this.state.pointCoords_dropoff
                );
                this.calculatePrice();
                this.setState({ index: 3 });
              }}
              style={{
                backgroundColor: '#8a43fb',
                paddingVertical: 5,
                borderRadius: 25,
              }}
              disabled={this.state.fetchingUserLocation}
            >
              {this.state.fetchingUserLocation ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <ActivityIndicator
                    style={{ alignSelf: 'center' }}
                    color={'#fff'}
                  />
                  <Text style={{ color: '#fff', marginLeft: 10 }}>
                    Fetching Current Location for Pickup
                  </Text>
                </View>
              ) : (
                <Text
                  style={{ textAlign: 'center', color: '#fff', fontSize: 22 }}
                >
                  PICK UP HERE
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}
        {this.state.pointCoords_dropoff &&
        this.state.pointCoords_dropoff.latitude &&
        this.state.pointCoords_pickup &&
        this.state.pointCoords_pickup.latitude &&
        this.state.index === 3 ? (
          <>
            <View style={{ flex: 0.55 }}>
              <MapView
                showsUserLocation={true}
                initialRegion={{
                  latitude: this.state.lat,
                  longitude: this.state.lng,
                  latitudeDelta: 0.0222,
                  longitudeDelta: 0.0221,
                }}
                rotateEnabled={false}
                ref={(map) => {
                  this.smallMap = map;
                }}
                style={{ flex: 1 }}
              >
                {this.state.pointCoords_pickup &&
                this.state.pointCoords_pickup.latitude ? (
                  <Marker coordinate={this.state.pointCoords_pickup}>
                    <View style={{ marginBottom: 10 }}>
                      <Image source={marker_img_pick} />
                    </View>
                  </Marker>
                ) : null}
                {this.state.pointCoords_dropoff &&
                this.state.pointCoords_dropoff.latitude ? (
                  <Marker coordinate={this.state.pointCoords_dropoff}>
                    <View style={{ marginBottom: 10 }}>
                      <Image source={marker_img_drop} />
                    </View>
                  </Marker>
                ) : null}
                {this.state.pointCoords_values &&
                this.state.pointCoords_values.length > 0 ? (
                  <Polyline
                    coordinates={this.state.pointCoords_values}
                    strokeWidth={4}
                    strokeColor="#26b050"
                  />
                ) : null}
              </MapView>
            </View>
            <View
              style={{
                flex: 0.45,
                marginTop: '-5%',
                backgroundColor: '#fff',
                borderTopRightRadius: 25,
                borderTopLeftRadius: 25,
                paddingVertical: 10,
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <View
                  style={{
                    backgroundColor: 'lightgray',
                    height: 5,
                    width: 50,
                    borderRadius: 25,
                  }}
                />
              </View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, marginVertical: 5, marginHorizontal: 20 }}
              >
                <View
                  style={{
                    borderBottomColor: '#e9e9e9',
                    borderBottomWidth: 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      navigate('Calculation', {
                        pickup_coordinates: this.state.pointCoords_pickup,
                        dropoff_coordinates: this.state.pointCoords_dropoff,
                        distance_in_km: this.state.distanceInKM,
                      });
                    }}
                    style={{ width: '100%', alignItems: 'center' }}
                  >
                    <Text style={{ color: '#63b7d1', fontSize: 12 }}>
                      Package Details
                    </Text>
                  </TouchableOpacity>
                  <TextField
                    label={'Receiver`s Email'}
                    onChangeText={(email) => this.setState({ email })}
                    type="email"
                  />
                  <TextField
                    label={'Receiver`s Name'}
                    onChangeText={(name) => this.setState({ name })}
                  />
                  <View
                    style={{
                      borderBottomColor: '#e9e9e9',
                      borderBottomWidth: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ fontWeight: '600', width: '25%' }}>
                      Size
                    </Text>
                    <View
                      style={{
                        width: '75%',
                        alignItems: 'flex-end',
                      }}
                    >
                      <RNPickerSelect
                        value={this.state.cmValue}
                        placeholder={{
                          label: 'Select CM',
                          value: null,
                          color: '#9EA0A4',
                        }}
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
                        items={this.dropDownData.cm}
                        onValueChange={(value) => {
                          this.setState(
                            {
                              cmValue: value,
                            },
                            () => {
                              this.calculatePrice();
                            }
                          );
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      borderBottomColor: '#e9e9e9',
                      borderBottomWidth: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ fontWeight: '600', width: '25%' }}>
                      Weight
                    </Text>
                    <View
                      style={{
                        // marginLeft: 10,
                        width: '75%',
                        alignItems: 'flex-end',
                      }}
                    >
                      <RNPickerSelect
                        value={this.state.weightValue}
                        placeholder={{
                          label: 'Select Weight',
                          value: null,
                          color: '#9EA0A4',
                        }}
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
                        items={this.dropDownData.weight}
                        onValueChange={(value) => {
                          this.setState(
                            {
                              weightValue: value,
                            },
                            () => {
                              this.calculatePrice();
                            }
                          );
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      borderBottomColor: '#e9e9e9',
                      borderBottomWidth: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ fontWeight: '600', width: '25%' }}>
                      Option
                    </Text>
                    <View
                      style={{
                        // marginLeft: 10,
                        width: '75%',
                        alignItems: 'flex-end',
                      }}
                    >
                      <RNPickerSelect
                        value={this.state.timeValue}
                        placeholder={{
                          label: 'Select Time',
                          value: null,
                          color: '#9EA0A4',
                        }}
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
                        items={this.dropDownData.time}
                        onValueChange={(value) => {
                          console.log(value);
                          this.setState(
                            {
                              timeValue: value,
                            },
                            () => {
                              this.calculatePrice();
                            }
                          );
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      borderBottomColor: '#e9e9e9',
                      borderBottomWidth: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ fontWeight: '600', width: '25%' }}>
                      Temperature
                    </Text>
                    <View
                      style={{
                        // marginLeft: 10,
                        width: '75%',
                        alignItems: 'flex-end',
                      }}
                    >
                      <RNPickerSelect
                        value={this.state.tempValue}
                        placeholder={{
                          label: 'Select Temp',
                          value: null,
                          color: '#9EA0A4',
                        }}
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
                        items={this.dropDownData.temp}
                        onValueChange={(value) => {
                          this.setState(
                            {
                              tempValue: value,
                            },
                            () => {
                              this.calculatePrice();
                            }
                          );
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginHorizontal: 10,
                    marginVertical: 20,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {/* <FontAwesome name="cc-visa" size={24} color="#8a43fb" />
                    <Text style={{ paddingLeft: 5 }}>8846</Text> */}
                    {this.props.app.card &&
                      this.props.app.card.type === 'onepay' && (
                        <>
                          <Material name="payment" size={24} color="#8a43fb" />
                          <Text style={{ paddingLeft: 5 }}>One Pay</Text>
                        </>
                      )}
                    {this.props.app.card &&
                      this.props.app.card.type === 'cash' && <Text>Cash</Text>}
                    {this.props.app.card &&
                      this.props.app.card.type === 'wallet' && (
                        <Text>Wallet</Text>
                      )}
                    {this.props.app.card &&
                      this.props.app.card.type === 'card' && (
                        <>
                          <FontAwesome
                            name="cc-visa"
                            size={24}
                            color="#8a43fb"
                          />
                          <Text style={{ paddingLeft: 5 }}>8846</Text>
                        </>
                      )}
                    <AntDesign name="caretdown" size={10} />
                  </TouchableOpacity>
                  {this.state.calculatingPrice ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <ActivityIndicator color="#000" />
                      <Text style={{ marginLeft: 5 }}>Calculating Price</Text>
                    </View>
                  ) : this.state.calculatedPrice ? (
                    <Text
                      style={{ fontSize: 18, fontWeight: 'bold' }}
                    >{`$ ${this.state.calculatedPrice}`}</Text>
                  ) : null}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <CheckBox
                      containerStyle={{ padding: 0, margin: 0 }}
                      checkedColor={'#8a43fb'}
                      checked={this.state.scheduled}
                      onPress={() => {
                        this.setState({ scheduled: !this.state.scheduled });
                      }}
                      size={20}
                    />
                    <Text style={{ paddingLeft: 5, marginLeft: -10 }}>
                      Save Order
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginBottom: 15,
                  }}
                >
                  {this.state.calculatedPrice &&
                  !this.state.calculatingPrice ? (
                    <TouchableOpacity
                      onPress={() => {
                        alert('Order Confirmed');
                        this.props.navigation.pop();
                      }}
                      style={{
                        flex: 0.4,
                        backgroundColor: '#8a43fb',
                        paddingHorizontal: 8,
                        paddingVertical: 5,
                        borderRadius: 25,
                        marginRight: 5,
                      }}
                    >
                      {this.state.loading ? (
                        <ActivityIndicator
                          style={{ alignSelf: 'center' }}
                          color={'#fff'}
                        />
                      ) : (
                        <Text
                          style={{
                            textAlign: 'center',
                            color: '#fff',
                            fontSize: 22,
                          }}
                        >
                          Confirm
                        </Text>
                      )}
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    // onPress={() => {
                    //   navigate('Calculation', {
                    //     pickup_coordinates: this.state.pointCoords_pickup,
                    //     dropoff_coordinates: this.state.pointCoords_dropoff,
                    //     distance_in_km: this.state.distanceInKM,
                    //   });
                    // }}
                    style={{
                      flex: 0.6,
                      backgroundColor: '#8a43fb',
                      paddingHorizontal: 2,
                      paddingVertical: 5,
                      borderRadius: 25,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#fff',
                        fontSize: 22,
                      }}
                    >
                      Confirm Payment
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                position: 'absolute',
                top: '46%',
                left: '46%',
                zIndex: 1,
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  style={{
                    height: 30,
                    width: 30,
                  }}
                  source={marker}
                />
              </View>
            </View>
            <MapView
              initialRegion={{
                latitude: this.state.lat,
                longitude: this.state.lng,
                latitudeDelta: 0.0222,
                longitudeDelta: 0.0221,
              }}
              onRegionChangeComplete={this.onRegionChange}
              rotateEnabled={false}
              ref={(map) => {
                this.fullMap = map;
              }}
              style={{ flex: 1 }}
              pitchEnabled={!this.state.fetchingUserLocation}
              zoomEnabled={!this.state.fetchingUserLocation}
              scrollEnabled={!this.state.fetchingUserLocation}
            />
          </>
        )}
      </View>

      // <View style={styles.mainbody}>
      //   <MapView
      //     // showsUserLocation={true}
      //     initialRegion={{
      //       latitude: this.state.lat,
      //       longitude: this.state.lng,
      //       latitudeDelta: 0.0222,
      //       longitudeDelta: 0.0221,
      //     }}
      //     onRegionChangeComplete={this.onRegionChange}
      //     // showsCompass={true}
      //     rotateEnabled={false}
      //     ref={(map) => {
      //       this.map = map;
      //     }}
      //     style={styles.map}
      //   ></MapView>

      //   <View style={styles.markerFixed}>
      //     <Image style={styles.marker} source={marker} />
      //   </View>

      //   <View
      //     style={{
      //       position: 'absolute',
      //       top: 120,
      //     }}
      //   >
      //     {this.state.predictions_pickup ? (
      //       <View
      //         style={{
      //           flex: 1,
      //           justifyContent: 'center',
      //           alignItems: 'center',
      //           flexDirection: 'column',
      //         }}
      //       >
      //         <View
      //           style={{
      //             width: deviceWidth,
      //             backgroundColor: '#fff',
      //           }}
      //         >
      //           {predictions_pickup}
      //         </View>
      //       </View>
      //     ) : null}
      //   </View>

      //   <View
      //     style={{
      //       position: 'absolute',
      //       top: 80,
      //       width: deviceWidth,
      //       backgroundColor: '#fff',
      //       paddingVertical: 10,
      //     }}
      //   >
      //     <View style={{ flexDirection: 'row' }}>
      //       <TouchableOpacity
      //         onPress={() => {
      //           navigate('PinLocation');
      //         }}
      //         style={{ width: '20%' }}
      //       >
      //         <Icon
      //           name="arrow-left"
      //           type="font-awesome"
      //           size={22}
      //           color="#26b050"
      //         />
      //       </TouchableOpacity>
      //       <View style={{ width: '60%' }}>
      //         <TextInput
      //           style={{
      //             fontSize: 12,
      //             fontSize: 12,
      //             width: '100%',
      //             backgroundColor: '#fff',
      //           }}
      //           onChangeText={(pickup) => this.onChangePickup(pickup)}
      //           value={this.state.pickup}
      //           placeholder={'Drop off Location'}
      //         />
      //       </View>
      //       <View style={{ width: '20%' }}>
      //         <View style={{ flexDirection: 'row' }}>
      //           <View style={{ width: '50%' }}>
      //             <Icon
      //               name="search"
      //               size={22}
      //               type="font-awesome"
      //               color="#26b050"
      //             />
      //           </View>
      //           <View style={{ width: '50%' }}>
      //             <Icon
      //               name="compass"
      //               type="font-awesome"
      //               size={22}
      //               color="#26b050"
      //             />
      //           </View>
      //         </View>
      //       </View>
      //     </View>
      //   </View>

      //   <View
      //     style={{
      //       position: 'absolute',
      //       bottom: 30,
      //       width: deviceWidth,
      //       alignContent: 'center',
      //       alignItems: 'center',
      //     }}
      //   >
      //     <TouchableOpacity
      //       // onPress={() => console.log(this.state.pointCoords_pickup)}
      //       // onPress={() => {
      //       //   console.log(this.state)
      //       //   navigate('DropOff',{pickup_coords:this.state.pointCoords_pickup})
      //       //   }}
      //       onPress={() => {
      //         console.log(this.state);
      //         navigate('DirectionsDefault', {
      //           dropoff_coordinates: this.state.pointCoords_pickup,
      //           pickup_coordinates: this.state.current_loc,
      //         });
      //       }}
      //       style={{
      //         width: '90%',
      //         backgroundColor: '#26b050',
      //         paddingVertical: 10,
      //       }}
      //     >
      //       <Text style={{ textAlign: 'center', color: '#fff', fontSize: 22 }}>
      //         DROP OFF HERE
      //       </Text>
      //     </TouchableOpacity>
      //   </View>
      // </View>
    );
  }
}
export default connect((store) => ({ app: store.app }), {
  logout,
  setAppState,
  i18nT,
})(DeliveryScreen);
