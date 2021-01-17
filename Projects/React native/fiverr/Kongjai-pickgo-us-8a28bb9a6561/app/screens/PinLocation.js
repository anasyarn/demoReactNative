/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Dimensions,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CheckBox } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import geolib from 'geolib';
import { FontAwesome5 } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { connect } from 'react-redux';
import * as Location from 'expo-location';
import Material from 'react-native-vector-icons/MaterialIcons';
import BottomSheet from 'react-native-bottomsheet-reanimated';
import MapView, { Polyline, Marker } from 'react-native-maps';
import PolyLine from '@mapbox/polyline';
import { Icon } from 'react-native-elements';
import {
  logout,
  setAppState,
  i18nT,
  updateCash,
  setPaymentMethod,
} from '../store/appActions';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
import marker_img_drop from '../../assets/map/pin.png';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import marker_img_pick from '../../assets/map/box.png';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { TextField } from 'react-native-material-textfield';
import marker_img_delivery from '../../assets/map/delivery.png';

class PinLocationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLocation: { latitude: 0, longitude: 0 },
      drivers: [],
      driver_ids: '',
      region: null,
      current_loc: null,
      pointCoords: [],
      status: '',
      pointCoords_pickup: null,
      predictions_pickup: [],
      pickup: '',
      address_from: '',
      pointCoords_dropoff: null,
      predictions_dropoff: [],
      dropoff: '',
      address_to: '',
      index: 1,
      pointCoords_values: [],
      cmValue: 45,
      weightValue: 2,
      timeValue: 'express',
      tempValue: 'regular',
      calculatedPrice: '',
      distanceInKM: 0,
      selectedSavedOrder: -1,
      scheduled: false,
      calculatingPrice: false,
      loading: false,
      savedOrders: [],
      focusDropOff: false,
      name: '',
      email: '',
      calculate: false,
      way: 2,
      way1: false,
      way2: false,
      switchToWay1: false,
      switchedToWay1: false,
      paymentTypes: ['Wallet', 'Card', 'Cash', 'Onepay'],
      selectPayment: false,
    };
  }

  componentDidMount() {
    this._getLocationAsync(true);
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.setState({
        userLocation: { latitude: 0, longitude: 0 },
        drivers: [],
        driver_ids: '',
        region: null,
        current_loc: null,
        pointCoords: [],
        status: '',
        pointCoords_pickup: null,
        predictions_pickup: [],
        pickup: '',
        address_from: '',
        pointCoords_dropoff: null,
        predictions_dropoff: [],
        dropoff: '',
        address_to: '',
        index: 1,
        pointCoords_values: [],
        cmValue: 45,
        weightValue: 2,
        timeValue: 'express',
        tempValue: 'regular',
        calculatedPrice: '',
        distanceInKM: 0,
        selectedSavedOrder: -1,
        scheduled: false,
        calculatingPrice: false,
        loading: false,
        savedOrders: [],
        focusDropOff: false,
        name: '',
        email: '',
        calculate: false,
        way: 2,
        way1: false,
        way2: false,
        switchToWay1: false,
        switchedToWay1: false,
        paymentTypes: ['Wallet', 'Card', 'Cash', 'Onepay'],
        selectPayment: false,
      });
    });
  }

  _getLocationAsync = async (animateToMarker = false) => {
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
        this.map.animateCamera(
          { center: location.coords, zoom: 16 },
          { duration: 100 }
        );
      }
      return location.coords;
    } catch (err) {
      this._getLocationAsync();
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
      if (json.predictions && json.predictions.length > 0) {
        this.getDropoffMarker(
          json.predictions[0].place_id,
          json.predictions[0].structured_formatting.main_text,
          'id',
          false
        );
      }
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

  getpickupMarker = async (destinationPlaceId, destinationName, pick_from) => {
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
            this.map.animateCamera(
              { center: pointCoords_pickup, zoom: 16 },
              { duration: 100 }
            );
            this.showPath(pointCoords_pickup, this.state.pointCoords_dropoff);
          }
        } else {
          this.setState({ status: true });
          // alert("We Do Not Operate in this area")
        }
        // this.map.fitToCoordinates(pointCoords_pickup);
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
            this.map.animateCamera(
              { center: pointCoords_pickup, zoom: 16 },
              { duration: 100 }
            );
            this.calculateDistance(
              pointCoords_pickup,
              this.state.pointCoords_dropoff
            );
            this.showPath(pointCoords_pickup, this.state.pointCoords_dropoff);
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

  calculateDistance = async (pickupCoords, dropoffCoords) => {
    const distance_response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=kilometers&origins=${pickupCoords.latitude},${pickupCoords.longitude}
  &destinations=${dropoffCoords.latitude},${dropoffCoords.longitude}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`);
    const json_distance = await distance_response.json();
    if (json_distance.status == 'OK') {
      const distance_in_kilometer =
        json_distance.rows[0].elements[0].distance.value;
      this.setState({
        distanceInKM: distance_in_kilometer / 1000,
      });
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
            db_map: true,
            pointCoords_values: pointCoordss,
          });
          this.map.fitToCoordinates(pointCoordss);
        } else {
          alert('Distance could not be fetched');
        }
      }
    }
  };

  getDropoffMarker = async (
    destinationPlaceId,
    destinationName,
    pick_from,
    setPickup = true
  ) => {
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
            this.map.animateCamera(
              { center: pointCoords_dropoff, zoom: 16 },
              { duration: 100 }
            );
            if (setPickup) {
              this.setState({
                pointCoords_dropoff,
                predictions_dropoff: [],
                dropoff: destinationName,
                address_to: destinationName,
              });
              Keyboard.dismiss();
              if (this.state.current_loc && this.state.current_loc.latitude) {
                this.getpickupMarker(this.state.current_loc, '', 'region');
              } else {
                const coords = await this._getLocationAsync();
                this.getpickupMarker(coords, '', 'region');
              }
            } else {
              this.setState({
                pointCoords_dropoff,
              });
              this.map.animateCamera(
                { center: pointCoords_dropoff, zoom: 16 },
                { duration: 100 }
              );
            }
          }
        } else {
          this.setState({ status: true });
        }
      }
    } catch (err) {
      this.setState({ status: true });
    }
  };

  toTitleCase = (text) => {
    return text.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  calculatePrice = async (data = null) => {
    try {
      const {
        cmValue,
        weightValue,
        timeValue,
        tempValue,
        distanceInKM,
        pickup,
        dropoff,
        pointCoords_pickup,
        pointCoords_dropoff,
        driver_ids,
      } = this.state || {};
      if (
        data ||
        (cmValue && weightValue && timeValue && tempValue && distanceInKM)
      ) {
        this.setState({ calculatingPrice: true, calculate: true });
        const response = await fetch(
          `http://restaurant-api.pickgo.la/api/order/calculate-price?access_token=${this.props.app.access_token}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: data
              ? data
              : JSON.stringify({
                  weight: weightValue,
                  size: cmValue,
                  distance: distanceInKM,
                  delivery_option: timeValue,
                  delivery_temprature: tempValue,
                  pickup_location: pickup,
                  delivery_location: dropoff,
                  driver_ids: driver_ids,
                  pickup_lat: pointCoords_pickup.latitude,
                  pickup_lng: pointCoords_pickup.longitude,
                  delivery_lat: pointCoords_dropoff.latitude,
                  delivery_lng: pointCoords_dropoff.longitude,
                  is_generate_order: 0,
                }),
          }
        );
        const resJSON = await response.json();
        if (resJSON && resJSON.success) {
          if (data) {
            this.setState({
              calculatingPrice: false,
            });
          } else {
            this.setState({
              calculatedPrice: resJSON.result.total_price,
              calculatingPrice: false,
            });
          }
          return resJSON.result.total_price;
        } else if (this.state.calculate) {
          this.calculatePrice();
          this.setState({
            calculate: false,
          });
        }
      }
      this.setState({ calculatingPrice: false });
      //remove below line later
      // this.setState({ calcultedPrice: 37.8 });
      //remove above line later
      return 0;
    } catch (err) {
      this.setState({ calculatingPrice: false });
      return 0;
    }
  };

  placeOrder = async (orderDetails) => {
    try {
      const {
        cmValue,
        weightValue,
        timeValue,
        tempValue,
        distanceInKM,
        pickup,
        dropoff,
        name,
        email,
        pointCoords_pickup,
        pointCoords_dropoff,
        driver_ids,
      } = this.state || {};
      if (driver_ids) {
        let orderInfo = null;
        if (orderDetails && orderDetails.pickup && orderDetails.dropoff) {
          orderInfo = JSON.stringify({
            weight: orderDetails.weight,
            size: orderDetails.cm,
            distance: distanceInKM,
            delivery_option: orderDetails.time,
            delivery_temprature: orderDetails.temp,
            pickup_location: orderDetails.pickup,
            delivery_location: orderDetails.dropoff,
            driver_ids: driver_ids,
            pickup_lat: orderDetails.pickupCoords.latitude,
            pickup_lng: orderDetails.pickupCoords.longitude,
            delivery_lat: orderDetails.dropoffCoords.latitude,
            delivery_lng: orderDetails.dropoffCoords.longitude,
            is_generate_order: 1,
            receiver_email: orderDetails.receiver_email,
            receiver_name: orderDetails.receiver_name,
            payment_method:
              this.props.app.card === 'cash'
                ? 2
                : this.props.app.card === 'card'
                ? 1
                : 0,
          });
        } else {
          orderInfo = JSON.stringify({
            weight: weightValue,
            size: cmValue,
            distance: distanceInKM,
            delivery_option: timeValue,
            delivery_temprature: tempValue,
            pickup_location: pickup,
            delivery_location: dropoff,
            driver_ids: driver_ids,
            pickup_lat: pointCoords_pickup.latitude,
            pickup_lng: pointCoords_pickup.longitude,
            delivery_lat: pointCoords_dropoff.latitude,
            delivery_lng: pointCoords_dropoff.longitude,
            is_generate_order: 1,
            receiver_email: email,
            receiver_name: name,
            payment_method:
              this.props.app.card === 'cash'
                ? 2
                : this.props.app.card === 'card'
                ? 1
                : 0,
          });
        }
        this.setState({ loading: true });
        const response = await fetch(
          `http://restaurant-api.pickgo.la/api/order/calculate-price?access_token=${this.props.app.access_token}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: orderInfo,
          }
        );
        const resJSON = await response.json();
        console.log(resJSON);
        if (resJSON && resJSON.success) {
          this.setState({ loading: false });
          alert('Order Placed');
          this.props.navigation.navigate('Home');
        }
      } else {
        alert('No nearby drivers found');
      }
    } catch (err) {
      alert('An error occured');
      this.setState({ loading: false });
    } finally {
      this.setState({ loading: false });
    }
  };

  saveOrder = async () => {
    this.setState({ loading: true });
    const newOrder = {
      pickupCoords: this.state.pointCoords_pickup,
      dropoffCoords: this.state.pointCoords_dropoff,
      pickup: this.state.pickup,
      dropoff: this.state.dropoff,
      weight: this.state.weightValue,
      cm: this.state.cmValue,
      time: this.state.timeValue,
      temp: this.state.tempValue,
      timeClock: new Date(),
      receiver_name: this.state.name,
      receiver_email: this.state.email,
    };
    const savedOrdersString = await AsyncStorage.getItem('saved_orders');
    let orders = [];
    if (savedOrdersString) {
      orders = JSON.parse(savedOrdersString);
      if (orders && orders.length > 0) {
        orders.push(newOrder);
      } else {
        orders.push(newOrder);
      }
    } else {
      orders.push(newOrder);
    }
    const updatedOrdersString = JSON.stringify(orders);
    await AsyncStorage.setItem('saved_orders', updatedOrdersString);
    this.setState({ loading: false });
  };

  getNearbyDrivers = async () => {
    try {
      const response = await fetch(
        'http://restaurant-api.pickgo.la/api/user/online-drivers'
      );
      const resJSON = await response.json();
      const drivers = [];
      if (resJSON && resJSON.data && resJSON.data.length > 0) {
        const pickupCoords = this.state.pointCoords_pickup;
        if (pickupCoords.latitude && pickupCoords.longitude) {
          for (let i = 0; i < resJSON.data.length; i++) {
            const driver = resJSON.data[i];
            // 71.6 km
            // driver.lat = 33.83827;
            // driver.lng = 73.03342;
            // 5.7 km
            // driver.lat = 33.63827;
            // driver.lng = 73.03342;
            if (driver.lat && driver.lng) {
              const distance_response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=kilometers&origins=${pickupCoords.latitude},${pickupCoords.longitude}
              &destinations=${driver.lat},${driver.lng}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`);
              const json_distance = await distance_response.json();
              if (
                json_distance.status == 'OK' &&
                json_distance &&
                json_distance.rows &&
                json_distance.rows.length > 0 &&
                json_distance.rows[0] &&
                json_distance.rows[0].elements &&
                json_distance.rows[0].elements.length > 0 &&
                json_distance.rows[0].elements[0] &&
                json_distance.rows[0].elements[0].distance
              ) {
                if (
                  json_distance.rows[0].elements[0].distance.value === 0 ||
                  json_distance.rows[0].elements[0].distance.value / 1000 <= 30
                ) {
                  drivers.push(driver);
                }
              }
            }
          }
          const driver_ids = drivers.map((driver) => driver.user_id).join(',');
          this.setState({ drivers: resJSON.data, driver_ids });
        }
      } else {
        this.setState({ drivers: [], driver_ids: '' });
      }
    } catch (err) {
      this.setState({ drivers: [], driver_ids: '' });
      console.log(err);
    }
  };

  checkSavedOrders = async () => {
    this.getNearbyDrivers();
    this.calculatePrice();
    const { email_address, first_name, last_name } =
      this.props.app.user_info || {};
    this.setState({
      name: `${first_name} ${last_name}`,
      email: email_address,
    });
    this.setState({ loading: true });
    const savedOrdersString = await AsyncStorage.getItem('saved_orders');
    if (savedOrdersString) {
      const orders = JSON.parse(savedOrdersString);
      if (orders && orders.length > 0) {
        const updatedSavedOrders = [];
        for (let i = 0; i < orders.length; i++) {
          const order = orders[i];
          const data = JSON.stringify({
            weight: order.weight,
            size: order.cm,
            distance: this.state.distanceInKM,
            delivery_option: order.time,
            delivery_temprature: order.temp,
            pickup_location: order.pickup,
            delivery_location: order.dropoff,
            pickup_lat: order.pickupCoords && order.pickupCoords.latitude,
            pickup_lng: order.pickupCoords && order.pickupCoords.longitude,
            delivery_lat: order.dropoffCoords && order.dropoffCoords.latitude,
            delivery_lng: order.dropoffCoords && order.dropoffCoords.longitude,
            is_generate_order: 0,
          });
          const totalPrice = await this.calculatePrice(data);
          updatedSavedOrders.push({ ...order, price: `₭ ${totalPrice}` });
        }
        this.setState({ savedOrders: updatedSavedOrders });
        this.setState({ index: 3 });
        this.setState({ loading: false });
      } else {
        this.setState({ index: 2 });
        this.setState({ loading: false });
      }
    } else {
      this.setState({
        index: 2,
        loading: false,
      });
    }
  };

  onRegionChange = (region) => {
    this.setState({
      region,
      switchedToWay1: true,
    });
    if (this.state.index === 1) {
      this.getDropOffMarkerWay1(region, '', 'region');
    } else if (this.state.index === 2) {
      this.getpickupMarkerWay1(region, '', 'region');
    }
  };

  getDropOffMarkerWay1 = async (
    destinationPlaceId,
    destinationName,
    pick_from
  ) => {
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

  getpickupMarkerWay1 = async (
    destinationPlaceId,
    destinationName,
    pick_from
  ) => {
    try {
      this.setState({
        pointCoords: [],
      });
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

  showPathWay1 = async (pickupCoords, dropoffCoords) => {
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

  calculatePriceWay1 = async () => {
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
      const distance = await this.calculateDistanceReturn(
        this.state.pointCoords_pickup,
        this.state.pointCoords_dropoff
      );
      this.setState({ distanceInKM: distance });
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
            }),
          }
        );
        const resJSON = await response.json();
        if (resJSON && resJSON.success) {
          this.setState({
            calculatedPrice: resJSON.result.total_price,
            calculatingPrice: false,
          });
        } else if (this.state.calculate) {
          this.calculatePriceWay1();
          this.setState({
            calculate: false,
          });
        }
      }
      this.setState({ calculatingPrice: false });
    } catch (err) {
      this.setState({ calculatingPrice: false });
    }
  };

  calculateDistanceReturn = async (pickupCoords, dropoffCoords) => {
    const distance_response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=kilometers&origins=${pickupCoords.latitude},${pickupCoords.longitude}
  &destinations=${dropoffCoords.latitude},${dropoffCoords.longitude}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`);
    const json_distance = await distance_response.json();
    if (json_distance.status == 'OK') {
      const distance_in_kilometer =
        json_distance.rows[0].elements[0].distance.value;
      return distance_in_kilometer / 1000;
    } else {
      alert('Distance could not be fetched');
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
      // { label: 'Normal', value: 'normal' },
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
    const {
      app,
      order,
      enterNewCard,
      updateCard,
      updateCash,
      i18nT,
    } = this.props;
    const predictions_pickup = this.state.predictions_pickup.map(
      (prediction) => (
        <TouchableHighlight
          key={prediction.id}
          onPress={() => {
            if (this.state.way === 2) {
              this.setState({ focusDropOff: false });
              this.getpickupMarker(
                prediction.place_id,
                prediction.structured_formatting.main_text,
                'id'
              );
            } else {
              this.getpickupMarkerWay1(
                prediction.place_id,
                prediction.structured_formatting.main_text,
                'id'
              );
            }
          }}
          style={{
            borderBottomWidth: 1,
            borderColor: '#efefef',
            paddingVertical: 5,
          }}
        >
          <View>
            <Text
              style={{
                backgroundColor: '#fff',
                padding: 8,
                fontSize: 15,
              }}
            >
              {prediction.structured_formatting.main_text}
            </Text>
          </View>
        </TouchableHighlight>
      ),
      <Text>Pickup</Text>
    );

    const predictions_dropoff = this.state.predictions_dropoff.map(
      (prediction) => (
        <TouchableHighlight
          key={prediction.id}
          onPress={() => {
            if (this.state.way === 2) {
              this.setState({ focusDropOff: false });
              this.getDropoffMarker(
                prediction.place_id,
                prediction.structured_formatting.main_text,
                'id'
              );
            } else {
              this.getDropOffMarkerWay1(
                prediction.place_id,
                prediction.structured_formatting.main_text,
                'id'
              );
            }
          }}
          style={{
            borderBottomWidth: 1,
            borderColor: '#efefef',
            paddingVertical: 5,
          }}
        >
          <View>
            <Text
              style={{
                backgroundColor: '#fff',
                padding: 8,
                fontSize: 15,
              }}
            >
              {prediction.structured_formatting.main_text}
            </Text>
          </View>
        </TouchableHighlight>
      ),
      <Text>Dropoff</Text>
    );

    return this.state.way === 2 ? (
      <View style={{ flex: 1 }}>
        <View
          style={{
            position: 'absolute',
            top: '5%',
            left: '3%',
            right: '3%',
            zIndex: 1,
          }}
        >
          {this.state.index > 1 ? (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  marginRight: 5,
                  paddingVertical: 5,
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  elevation: 5,
                }}
                onPress={() => {
                  if (
                    this.state.savedOrders &&
                    this.state.savedOrders.length > 0
                  ) {
                    this.setState({ index: 1 });
                  } else {
                    const newIndex = this.state.index - 1;
                    if (newIndex >= 1) {
                      this.setState({ index: newIndex });
                    }
                  }
                }}
              >
                <MaterialIcons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  elevation: 5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
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
          ) : null}
        </View>
        <View style={{ flex: 0.55 }}>
          {!this.state.way2 ? (
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
                  source={marker_img_drop}
                />
              </View>
            </View>
          ) : null}
          <MapView
            showsUserLocation={true}
            initialRegion={{
              latitude: this.state.userLocation.latitude,
              longitude: this.state.userLocation.longitude,
              latitudeDelta: 0.0222,
              longitudeDelta: 0.0221,
            }}
            onTouchStart={() => {
              if (!this.state.way2) {
                this.setState({ switchToWay1: true });
              }
            }}
            onRegionChangeComplete={(region) => {
              if (this.state.switchToWay1) {
                console.log(region);
                this.setState({ way: 1, way1: true, way2: false, index: 1 });
                setTimeout(() => {
                  this.fullMap.animateCamera(
                    { center: region, zoom: 16 },
                    { duration: 100 }
                  );
                  this.onRegionChange(region);
                }, 1000);
              }
            }}
            rotateEnabled={false}
            ref={(map) => {
              this.map = map;
            }}
            style={{ flex: 1 }}
          >
            {this.state.drivers && this.state.drivers.length > 0
              ? this.state.drivers.map((driver, index) => (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: driver.lat ? parseFloat(driver.lat) : 0,
                      longitude: driver.lng ? parseFloat(driver.lng) : 0,
                    }}
                  >
                    <View style={{ marginBottom: -2 }}>
                      <Image
                        source={marker_img_delivery}
                        style={{ height: 40, width: 40 }}
                      />
                    </View>
                  </Marker>
                ))
              : null}
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
        <BottomSheet
          bottomSheerColor="transparent"
          initialPosition={'47%'}
          ref={(sheet) => (this.bottomSheet = sheet)}
          snapPoints={['47%%', '60%', '70%']}
          enabledInnerScrolling={true}
          enabledContentGestureInteraction={false}
          header={null}
          body={
            <View
              style={{
                marginTop: '-5%',
                backgroundColor: '#fff',
                borderTopRightRadius: 25,
                borderTopLeftRadius: 25,
                paddingVertical: 10,
                height: '100%',
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
              {this.state.index === 1 ? (
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  style={{ flex: 1, marginVertical: 5, marginHorizontal: 20 }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 5,
                    }}
                  >
                    <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                      {`Hey, ${this.props.app.user_info.first_name} ${this.props.app.user_info.last_name}`}
                    </Text>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('Delivery')}
                    >
                      <Image source={marker_img_drop} />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      marginTop: 10,
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: '#e6e6e6',
                      paddingVertical: 5,
                      paddingHorizontal: 5,
                    }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <View
                        style={{
                          width: '15%',
                          alignContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <MaterialIcons size={30} color="green" name="place" />
                      </View>
                      <View
                        style={{
                          width: '85%',
                          alignContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <TextInput
                          style={{
                            fontSize: 15,
                            width: '100%',
                            backgroundColor: '#fff',
                            height: 35,
                          }}
                          onFocus={() => {
                            this.bottomSheet.snapTo(2);
                            this.setState({
                              focusDropOff: true,
                              way1: false,
                              way2: true,
                            });
                          }}
                          onChangeText={(dropoff) =>
                            this.onChangeDropoff(dropoff)
                          }
                          value={this.state.dropoff}
                          placeholder={'Where Deliver to'}
                        />
                      </View>
                    </View>
                  </View>
                  {this.state.predictions_dropoff ? (
                    <ScrollView
                      keyboardShouldPersistTaps="handled"
                      style={{
                        flex: 1,
                        backgroundColor: '#fff',
                      }}
                    >
                      {predictions_dropoff}
                    </ScrollView>
                  ) : null}
                  {this.state.dropoff ? (
                    <>
                      <View
                        style={{
                          width: '100%',
                          marginTop: 10,
                          borderWidth: 1,
                          borderRadius: 10,
                          borderColor: '#e6e6e6',
                          paddingVertical: 5,
                          paddingHorizontal: 5,
                        }}
                      >
                        <View style={{ flexDirection: 'row' }}>
                          <View
                            style={{
                              width: '15%',
                              alignContent: 'center',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Image
                              source={marker_img_pick}
                              style={{ height: 24, width: 24 }}
                            />
                          </View>
                          <View
                            style={{
                              width: '85%',
                              alignContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <TextInput
                              style={{
                                fontSize: 15,
                                width: '100%',
                                backgroundColor: '#fff',
                                height: 35,
                              }}
                              onFocus={() =>
                                this.setState({ focusDropOff: true })
                              }
                              onChangeText={(pickup) =>
                                this.onChangePickup(pickup)
                              }
                              value={this.state.pickup}
                              placeholder={'Pickup Location'}
                            />
                          </View>
                        </View>
                      </View>
                      {this.state.predictions_pickup ? (
                        <ScrollView
                          keyboardShouldPersistTaps="handled"
                          style={{
                            flex: 1,
                            backgroundColor: '#fff',
                          }}
                        >
                          {predictions_pickup}
                        </ScrollView>
                      ) : null}
                    </>
                  ) : null}
                  {this.state.pointCoords_dropoff &&
                    this.state.pointCoords_dropoff.latitude &&
                    this.state.pointCoords_pickup &&
                    this.state.pointCoords_pickup.latitude && (
                      <TouchableOpacity
                        onPress={() => {
                          this.checkSavedOrders();
                          this.bottomSheet.snapTo(1);
                        }}
                        style={{
                          backgroundColor: '#8a43fb',
                          paddingVertical: 10,
                          borderRadius: 25,
                          marginVertical: 10,
                        }}
                      >
                        {this.state.loading ? (
                          <ActivityIndicator color={'#fff'} />
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
                    )}
                </ScrollView>
              ) : this.state.index === 2 ? (
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  style={{ flex: 1, marginVertical: 5, marginHorizontal: 20 }}
                >
                  <TextField
                    label={'Receiver`s Email'}
                    value={this.state.email}
                    onChangeText={(email) => this.setState({ email })}
                    type="email"
                  />
                  <TextField
                    label={'Receiver`s Name'}
                    value={this.state.name}
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
                      onPress={() => this.setState({ selectPayment: true })}
                    >
                      {console.log(this.props.app.card.type)}
                      {this.props.app.card && this.props.app.card.type ? (
                        <>
                          {this.props.app.card.type === 'onepay' && (
                            <>
                              <Material
                                name="payment"
                                size={24}
                                color="#8a43fb"
                              />
                              <Text style={{ paddingLeft: 5 }}>One Pay</Text>
                            </>
                          )}
                          {this.props.app.card.type === 'cash' && (
                            <Text>Cash</Text>
                          )}
                          {this.props.app.card.type === 'wallet' && (
                            <Text>Wallet</Text>
                          )}
                          {this.props.app.card.type === 'card' && (
                            <>
                              <FontAwesome
                                name="cc-visa"
                                size={24}
                                color="#8a43fb"
                              />
                              <Text style={{ paddingLeft: 5 }}>
                                {() => {
                                  const cardnum = this.props.app.card
                                    .card_number.split['-'];
                                  return cardnum[cardnum.length - 1];
                                }}
                              </Text>
                            </>
                          )}
                        </>
                      ) : (
                        <Text>Select Payment Method</Text>
                      )}
                      <AntDesign name="caretdown" size={10} />
                    </TouchableOpacity>
                    {this.state.selectPayment && (
                      <View
                        style={{
                          width: Dimensions.get('screen').width,
                          height: 250,
                          position: 'absolute',
                          top: -120,
                          left: 0,
                          right: 0,
                          backgroundColor: '#fff',
                          zIndex: 10,
                          elevation: 10,
                        }}
                      >
                        <FlatList
                          data={this.state.paymentTypes}
                          renderItem={({ item, index }) => (
                            <TouchableOpacity
                              style={{
                                padding: 10,
                                borderBottomWidth: 1,
                                borderColor: 'lightgrey',
                              }}
                              onPress={async () => {
                                await updateCash(item.toLowerCase());
                                await setPaymentMethod(item.toLowerCase());
                                this.setState({ selectPayment: false });
                              }}
                            >
                              <Text>{item}</Text>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    )}
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
                      >{`₭ ${this.state.calculatedPrice}`}</Text>
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
                  {this.state.calculatedPrice &&
                  !this.state.calculatingPrice ? (
                    <TouchableOpacity
                      onPress={async () => {
                        if (this.state.scheduled) {
                          await this.saveOrder();
                          console.log('card selected', this.props.app.card);
                          if (this.props.app.card) {
                            await this.placeOrder();
                          } else {
                            this.props.navigation.navigate('Checkout', {
                              // company_id: order.company.id,
                              table: null,
                              enter_new_card: true,
                            });
                          }
                        } else {
                          console.log('card selected', this.props.app.card);
                          if (this.props.app.card) {
                            await this.placeOrder();
                          } else {
                            this.props.navigation.navigate('Checkout', {
                              // company_id: order.company.id,
                              table: null,
                              enter_new_card: true,
                            });
                          }
                        }
                      }}
                      style={{
                        backgroundColor: '#8a43fb',
                        paddingVertical: 10,
                        borderRadius: 25,
                        marginVertical: 10,
                      }}
                      disabled={this.state.loading}
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
                          {`Confirm & Pay`}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ) : null}
                </ScrollView>
              ) : (
                <View
                  style={{ flex: 1, marginVertical: 5, marginHorizontal: 20 }}
                >
                  {/* <ScrollView
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                    style={{ flex: 0.35 }}
                    showsVerticalScrollIndicator={false}
                  > */}
                  {this.state.savedOrders &&
                    this.state.savedOrders.map((order, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={{
                            borderLeftColor: '#8a43fb',
                            borderLeftWidth:
                              this.state.selectedSavedOrder === index ? 5 : 0,
                            backgroundColor: 'white',
                            marginVertical: 3,
                            marginHorizontal: 2,
                            borderRadius: 10,
                            padding: 5,
                            elevation: 2,
                          }}
                          onPress={() =>
                            this.setState({ selectedSavedOrder: index })
                          }
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <MaterialCommunityIcons
                              name="truck-delivery"
                              size={40}
                              color="#8a43fb"
                              style={{ flex: 0.2 }}
                            />
                            <View style={{ flex: 0.6 }}>
                              <Text>{`${order.weight}KG, ${
                                order.cm
                              }CM, ${this.toTitleCase(order.temp)}`}</Text>
                              <Text style={{ fontSize: 10 }}>
                                {this.toTitleCase(order.time)}
                              </Text>
                            </View>
                            <View style={{ flex: 0.2 }}>
                              <Text>{order.price}</Text>
                              <Text style={{ fontSize: 10 }}>
                                {moment(order.timeClock).format('hh:mm a')}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  {/* </ScrollView> */}
                  <View
                    style={{
                      // flex: 0.25,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginTop: 10,
                    }}
                  >
                    {this.state.selectedSavedOrder > -1 ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.placeOrder(
                            this.state.savedOrders[
                              this.state.selectedSavedOrder
                            ]
                          );
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: '#8a43fb',
                          paddingHorizontal: 8,
                          paddingVertical: 5,
                          borderRadius: 25,
                          marginRight: 5,
                        }}
                        disabled={this.state.loading}
                      >
                        {this.state.loading ? (
                          <ActivityIndicator color={'#fff'} />
                        ) : (
                          <Text
                            style={{
                              textAlign: 'center',
                              color: '#fff',
                              fontSize: 22,
                            }}
                          >
                            {`Select & Confirm`}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      onPress={() => {
                        this.calculatePrice();
                        this.setState({ index: 2 });
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: '#8a43fb',
                        paddingHorizontal: 8,
                        paddingVertical: 5,
                        borderRadius: 25,
                      }}
                      disabled={this.state.loading}
                    >
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#fff',
                          fontSize: 22,
                        }}
                      >
                        Make new order
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          }
        />
      </View>
    ) : (
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
                    this.props.navigation.navigate('Home');
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
                    setTimeout(() => {
                      this.fullMap.animateCamera(
                        { center: this.state.pointCoords_dropoff, zoom: 16 },
                        { duration: 100 }
                      );
                    }, 1000);
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
                  setTimeout(() => {
                    this.fullMap.animateCamera(
                      { center: this.state.pointCoords_pickup, zoom: 16 },
                      { duration: 100 }
                    );
                  }, 1000);
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
              onPress={async () => {
                this.setState(
                  { index: 2, fetchingUserLocation: true },
                  async () => {
                    const coords =
                      this.state.userLocation &&
                      this.state.userLocation.latitude &&
                      this.state.userLocation.longitude
                        ? this.state.userLocation
                        : await this._getLocationAsync();
                    this.fullMap.animateCamera(
                      { center: coords, zoom: 16 },
                      { duration: 100 }
                    );
                    this.onRegionChange(coords);
                    this.setState({ fetchingUserLocation: false });
                  }
                );
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
              onPress={async () => {
                const { email_address, first_name, last_name } =
                  this.props.app.user_info || {};
                this.setState({
                  index: 3,
                  name: `${first_name} ${last_name}`,
                  email: email_address,
                });
                setTimeout(async () => {
                  this.showPathWay1(
                    this.state.pointCoords_pickup,
                    this.state.pointCoords_dropoff
                  );
                  this.calculatePriceWay1();
                  this.getNearbyDrivers();
                }, 1000);
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
                initialRegion={{
                  latitude: 0,
                  longitude: 0,
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
            <BottomSheet
              bottomSheerColor="transparent"
              initialPosition={'47%'}
              snapPoints={['47%', '70%']}
              header={null}
              body={
                <View
                  style={{
                    height: '100%',
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
                          // navigate('Calculation', {
                          //   pickup_coordinates: this.state.pointCoords_pickup,
                          //   dropoff_coordinates: this.state.pointCoords_dropoff,
                          //   distance_in_km: this.state.distanceInKM,
                          // });
                        }}
                        style={{ width: '100%', alignItems: 'center' }}
                      >
                        <Text style={{ color: '#63b7d1', fontSize: 12 }}>
                          Package Details
                        </Text>
                      </TouchableOpacity>
                      <TextField
                        label={'Receiver`s Email'}
                        value={this.state.email}
                        onChangeText={(email) => this.setState({ email })}
                        type="email"
                      />
                      <TextField
                        label={'Receiver`s Name'}
                        value={this.state.name}
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
                                  this.calculatePriceWay1();
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
                                  this.calculatePriceWay1();
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
                                  this.calculatePriceWay1();
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
                                  this.calculatePriceWay1();
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
                        onPress={() => this.setState({ selectPayment: true })}
                      >
                        {console.log(this.props.app.card.type)}
                        {this.props.app.card && this.props.app.card.type ? (
                          <>
                            {this.props.app.card.type === 'onepay' && (
                              <>
                                <Material
                                  name="payment"
                                  size={24}
                                  color="#8a43fb"
                                />
                                <Text style={{ paddingLeft: 5 }}>One Pay</Text>
                              </>
                            )}
                            {this.props.app.card.type === 'cash' && (
                              <Text>Cash</Text>
                            )}
                            {this.props.app.card.type === 'wallet' && (
                              <Text>Wallet</Text>
                            )}
                            {this.props.app.card.type === 'card' && (
                              <>
                                <FontAwesome
                                  name="cc-visa"
                                  size={24}
                                  color="#8a43fb"
                                />
                                <Text style={{ paddingLeft: 5 }}>
                                  {() => {
                                    const cardnum = this.props.app.card
                                      .card_number.split['-'];
                                    return cardnum[cardnum.length - 1];
                                  }}
                                </Text>
                              </>
                            )}
                          </>
                        ) : (
                          <Text>Select Payment Method</Text>
                        )}
                        <AntDesign name="caretdown" size={10} />
                      </TouchableOpacity>
                      {this.state.selectPayment && (
                        <View
                          style={{
                            width: Dimensions.get('screen').width,
                            height: 250,
                            position: 'absolute',
                            top: -120,
                            left: 0,
                            right: 0,
                            backgroundColor: '#fff',
                            zIndex: 10,
                            elevation: 10,
                          }}
                        >
                          <FlatList
                            data={this.state.paymentTypes}
                            renderItem={({ item, index }) => (
                              <TouchableOpacity
                                style={{
                                  padding: 10,
                                  borderBottomWidth: 1,
                                  borderColor: 'lightgrey',
                                }}
                                onPress={async () => {
                                  await updateCash(item.toLowerCase());
                                  await setPaymentMethod(item.toLowerCase());
                                  this.setState({ selectPayment: false });
                                }}
                              >
                                <Text>{item}</Text>
                              </TouchableOpacity>
                            )}
                          />
                        </View>
                      )}
                      {this.state.calculatingPrice ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <ActivityIndicator color="#000" />
                          <Text style={{ marginLeft: 5 }}>
                            Calculating Price
                          </Text>
                        </View>
                      ) : this.state.calculatedPrice ? (
                        <Text
                          style={{ fontSize: 18, fontWeight: 'bold' }}
                        >{`₭ ${this.state.calculatedPrice}`}</Text>
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
                          onPress={async () => {
                            if (this.state.scheduled) {
                              await this.saveOrder();
                              await this.placeOrder();
                            } else {
                              this.placeOrder();
                            }
                          }}
                          style={{
                            flex: 1,
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
                              Confirm Payment
                            </Text>
                          )}
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </ScrollView>
                </View>
              }
            />
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
                  source={marker_img_drop}
                />
              </View>
            </View>
            <MapView
              initialRegion={{
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0222,
                longitudeDelta: 0.0221,
              }}
              onRegionChangeComplete={(region) => {
                if (this.state.switchedToWay1) {
                  this.onRegionChange(region);
                }
              }}
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
    justifyContent: 'center',
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
  updateCash,
})(PinLocationScreen);
