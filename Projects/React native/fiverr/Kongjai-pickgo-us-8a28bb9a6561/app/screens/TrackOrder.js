/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import MapView, { Polyline, Marker } from 'react-native-maps';
import PolyLine from '@mapbox/polyline';
import { logout, setAppState, i18nT } from '../store/appActions';
import { ScrollView } from 'react-native-gesture-handler';
import marker_img_drop from '../../assets/map/pin.png';
import marker_img_pick from '../../assets/map/box.png';
import marker_img_driver from '../../assets/map/delivery.png';
import person from '../../assets/person.png';
import * as config from '../config/config';

class TrackOrderScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordsPickup: null,
      coordsDropoff: null,
      coordsDriver: null,
      coordsPickupToDropoff: [],
      coordsDriverToPickup: [],
      coordsDriverToDropoff: [],
      orderInfo: '',
      driverInfo: null,
      pathShown: false,
      distanceInKM: '',
      estimatedTime: '',
      fromto: 'driver_to_pickup',
    };
  }

  fancyTimeFormat = (seconds) => {
    try {
      const hrs = ~~(seconds / 3600);
      const mins = ~~((seconds % 3600) / 60);
      const secs = ~~seconds % 60;
      let stringTime = '';
      if (hrs > 0) {
        stringTime += `${hrs} hrs`;
      }
      if (mins > 0) {
        stringTime += ` ${mins} mins`;
      }
      if (secs > 0) {
        stringTime += ` ${secs} secs`;
      }
      return stringTime;
    } catch (err) {
      return '0 secs';
    }
  };

  componentDidMount = () => {
    const orderInfo = this.props.navigation.getParam('orderInfo', null);
    if (orderInfo && orderInfo.id) {
      const coordsPickup = {
          latitude: parseFloat(orderInfo.pickup_lat),
          longitude: parseFloat(orderInfo.pickup_lng),
        },
        coordsDropoff = {
          latitude: parseFloat(orderInfo.delivery_lat),
          longitude: parseFloat(orderInfo.delivery_lng),
        };
      this.setState({
        orderInfo,
        coordsPickup,
        coordsDropoff,
      });
      this.showPath(coordsPickup, coordsDropoff);
      if (orderInfo.order_status && orderInfo.order_status === '2') {
        this.setState({ fromto: 'driver_to_pickup' });
      } else if (orderInfo.order_status && orderInfo.order_status === '4') {
        this.setState({ fromto: 'driver_to_dropoff' });
      }
      if (orderInfo.driver_id) {
        this.timeInterval = setInterval(() => {
          this.beginUpdatingDriverLocation(orderInfo.driver_id);
        }, 5000);
      }
    }
  };

  componentWillUnmount = () => {
    clearInterval(this.timeInterval);
  };

  beginUpdatingDriverLocation = async (driver_id) => {
    try {
      const response = await fetch(
        `http://restaurant-api.pickgo.la/api/user/user-details?driver_id=${driver_id}`
        // `http://restaurant-api.pickgo.la/api/user/user-details?driver_id=450`
      );
      const resJSON = await response.json();
      if (resJSON && resJSON.result && resJSON.result.uid) {
        const driver = resJSON.result;
        if (driver.lat && driver.lng) {
          const driverCoords = {
            latitude: parseFloat(driver.lat),
            longitude: parseFloat(driver.lng),
          };
          this.setState({ coordsDriver: driverCoords, driverInfo: driver });
          const to =
            this.state.fromto === 'driver_to_pickup'
              ? this.state.coordsPickup
              : this.state.coordsDropoff;
          if (to && to.latitude && to.longitude) {
            this.showPath(driverCoords, to, this.state.fromto);
            this.calculateDistance(driverCoords, to);
            this.calculateEstimatedTime(driverCoords);
          }
        }
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  showPath = async (from, to, fromto = 'pickup_to_dropoff') => {
    const from_lat = from.latitude;
    const from_lng = from.longitude;
    const to_lat = to.latitude;
    const to_lng = to.longitude;
    const responses = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${from_lat},${from_lng}&destination=${to_lat},${to_lng}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`
    );
    const json_destinations = await responses.json();
    if (json_destinations.status == 'ZERO_RESULTS') {
      this.setState({ status: true });
    } else {
      const points = PolyLine.decode(
        json_destinations.routes[0].overview_polyline.points
      );
      const pointCoordss = points.map((point) => {
        return { latitude: point[0], longitude: point[1] };
      });
      if (pointCoordss && pointCoordss.length > 0) {
        if (!this.state.pathShown) {
          this.map.fitToCoordinates(pointCoordss);
        }
        if (fromto === 'pickup_to_dropoff') {
          this.setState({ coordsPickupToDropoff: pointCoordss });
        } else if (fromto === 'driver_to_pickup') {
          this.map.animateCamera({ center: from, zoom: 14 }, { duration: 100 });
          this.setState({
            coordsDriverToPickup: pointCoordss,
            pathShown: true,
          });
        } else if (fromto === 'driver_to_dropoff') {
          this.map.animateCamera({ center: from, zoom: 14 }, { duration: 100 });
          this.setState({ coordsPickupToDropoff: pointCoordss });
        }
      }
    }
  };

  calculateEstimatedTime = async (driverCoords) => {
    let formattedTime = 0;
    if (this.state.fromto === 'driver_to_pickup') {
      const driverToPickupTime = await this.calculateDistanceReturn(
        driverCoords,
        this.state.coordsPickup
      );
      const pickupToDropoffTime = await this.calculateDistanceReturn(
        this.state.coordsPickup,
        this.state.coordsDropoff
      );
      const time = driverToPickupTime + pickupToDropoffTime;
      formattedTime = this.fancyTimeFormat(time);
    } else if (this.state.fromto === 'driver_to_dropoff') {
      const driverToDropoffTime = await this.calculateDistanceReturn(
        driverCoords,
        this.state.coordsDropoff
      );
      formattedTime = this.fancyTimeFormat(driverToDropoffTime);
    }
    this.setState({ estimatedTime: formattedTime });
  };

  calculateDistanceReturn = async (from, to) => {
    if (
      from &&
      from.latitude &&
      from.longitude &&
      to &&
      to.latitude &&
      to.longitude
    ) {
      const distance_response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=kilometers&origins=${from.latitude},${from.longitude}
      &destinations=${to.latitude},${to.longitude}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`);
      const json_distance = await distance_response.json();
      if (json_distance.status == 'OK') {
        if (
          json_distance &&
          json_distance.rows &&
          json_distance.rows.length > 0 &&
          json_distance.rows[0] &&
          json_distance.rows[0].elements &&
          json_distance.rows[0].elements.length > 0 &&
          json_distance.rows[0].elements[0] &&
          json_distance.rows[0].elements[0].duration &&
          json_distance.rows[0].elements[0].distance
        ) {
          return json_distance.rows[0].elements[0].duration.value;
        } else {
          return 0;
        }
      } else {
        alert('Distance could not be fetched');
        return 0;
      }
    } else {
      return 0;
    }
  };

  calculateDistance = async (from, to) => {
    if (
      from &&
      from.latitude &&
      from.longitude &&
      to &&
      to.latitude &&
      to.longitude
    ) {
      const distance_response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=kilometers&origins=${from.latitude},${from.longitude}
  &destinations=${to.latitude},${to.longitude}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`);
      const json_distance = await distance_response.json();
      if (json_distance.status == 'OK') {
        if (
          json_distance &&
          json_distance.rows &&
          json_distance.rows.length > 0 &&
          json_distance.rows[0] &&
          json_distance.rows[0].elements &&
          json_distance.rows[0].elements.length > 0 &&
          json_distance.rows[0].elements[0] &&
          json_distance.rows[0].elements[0].duration &&
          json_distance.rows[0].elements[0].distance
        ) {
          const distance = json_distance.rows[0].elements[0].distance.value;
          if (this.state.fromto === 'driver_to_pickup' && distance < 300) {
            this.setState({
              fromto: 'driver_to_dropoff',
              coordsPickupToDropoff: [],
              coordsDriverToPickup: [],
            });
          }
        }
      } else {
        alert('Distance could not be fetched');
      }
    }
  };

  toTitleCase = (text) => {
    return text.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  render() {
    const { driverInfo, estimatedTime, orderInfo, fromto } = this.state || {};
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.55 }}>
          <MapView
            showsUserLocation={true}
            initialRegion={{
              latitude: 0,
              longitude: 0,
              latitudeDelta: 0.0222,
              longitudeDelta: 0.0221,
            }}
            rotateEnabled={false}
            ref={(map) => {
              this.map = map;
            }}
            style={{ flex: 1 }}
          >
            {this.state.coordsPickup &&
            this.state.coordsPickup.latitude &&
            this.state.coordsPickup.longitude ? (
              <Marker coordinate={this.state.coordsPickup}>
                <View style={{ marginBottom: 10 }}>
                  <Image source={marker_img_pick} />
                </View>
              </Marker>
            ) : null}
            {this.state.coordsDropoff &&
            this.state.coordsDropoff.latitude &&
            this.state.coordsDropoff.longitude ? (
              <Marker coordinate={this.state.coordsDropoff}>
                <View style={{ marginBottom: 10 }}>
                  <Image source={marker_img_drop} />
                </View>
              </Marker>
            ) : null}
            {this.state.coordsDriver &&
            this.state.coordsDriver.latitude &&
            this.state.coordsDriver.longitude ? (
              <Marker coordinate={this.state.coordsDriver}>
                <View style={{ marginBottom: -2 }}>
                  <Image
                    source={marker_img_driver}
                    style={{ height: 40, width: 40 }}
                  />
                </View>
              </Marker>
            ) : null}
            {this.state.coordsPickupToDropoff &&
            this.state.coordsPickupToDropoff.length > 0 ? (
              <Polyline
                coordinates={this.state.coordsPickupToDropoff}
                strokeWidth={4}
                strokeColor="#26b050"
              />
            ) : null}
            {this.state.coordsDriverToPickup &&
            this.state.coordsDriverToPickup.length > 0 ? (
              <Polyline
                coordinates={this.state.coordsDriverToPickup}
                strokeWidth={4}
                strokeColor="#26b050"
              />
            ) : null}
            {this.state.coordsDriverToDropoff &&
            this.state.coordsDriverToDropoff.length > 0 ? (
              <Polyline
                coordinates={this.state.coordsDriverToDropoff}
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
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              marginTop: 10,
              marginBottom: 5,
              marginHorizontal: 20,
            }}
          >
            {orderInfo && orderInfo.id ? (
              <>
                {orderInfo.order_status &&
                (orderInfo.order_status === '1' ||
                  orderInfo.order_status === '5' ||
                  orderInfo.order_status === '3') ? (
                  <>
                    {orderInfo.order_status === '5' ? (
                      <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 25 }}>
                          Order Delivery Completed
                        </Text>
                        <View
                          style={{
                            marginVertical: 10,
                            height: 5,
                            borderRadius: 10,
                            backgroundColor: '#15aa38',
                          }}
                        />
                      </View>
                    ) : orderInfo.order_status === '3' ? (
                      <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 25 }}>
                          Order Cancelled
                        </Text>
                        <View
                          style={{
                            marginVertical: 10,
                            height: 5,
                            borderRadius: 10,
                            backgroundColor: 'red',
                          }}
                        />
                      </View>
                    ) : (
                      <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 25 }}>
                          Pending Request
                        </Text>
                        <View
                          style={{
                            marginVertical: 10,
                            height: 5,
                            borderRadius: 10,
                            backgroundColor: 'lightgray',
                          }}
                        />
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    {driverInfo && driverInfo.uid ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                        }}
                      >
                        <Image
                          source={
                            driverInfo.picture
                              ? {
                                  uri:
                                    config.BASE_URL +
                                    '/uploads/' +
                                    driverInfo.picture,
                                }
                              : person
                          }
                          style={{
                            height: 60,
                            width: 60,
                            borderRadius: 50,
                            marginRight: 10,
                          }}
                        />
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <View
                            style={{
                              alignItems: 'flex-start',
                              justifyContent: 'space-between',
                              flex: 0.6,
                            }}
                          >
                            <Text>Delivery by</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                              {`${this.state.driverInfo.first_name} ${this.state.driverInfo.last_name}`}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                              flex: 0.4,
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 10,
                              }}
                            >
                              <MaterialCommunityIcons
                                name="chat"
                                size={24}
                                color="#8a43fb"
                              />
                              <Text style={{ color: '#8a43fb' }}>Message</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <MaterialIcons
                                name="call"
                                size={24}
                                color="#8a43fb"
                              />
                              <Text style={{ color: '#8a43fb' }}>Call</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ) : null}
                    <View style={{ marginTop: 20 }}>
                      <Text>Estimated Delivery Time</Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                        {orderInfo &&
                        orderInfo.id &&
                        orderInfo.delivery_option === '1'
                          ? estimatedTime
                            ? estimatedTime
                            : ''
                          : orderInfo.delivery_option_value}
                      </Text>
                      <View
                        style={{
                          marginVertical: 5,
                          height: 5,
                          borderRadius: 10,
                          backgroundColor: 'lightgray',
                        }}
                      >
                        <View
                          style={{
                            position: 'absolute',
                            backgroundColor: '#15aa38',
                            borderRadius: 10,
                            top: 0,
                            bottom: 0,
                            right: `${100 - 45}%`, //45 is dynamic percentage here
                            left: 0,
                          }}
                        />
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text>
                          {orderInfo.order_status &&
                          orderInfo.order_status === '2'
                            ? 'Driver Accepted'
                            : orderInfo.order_status === '3'
                            ? 'Picked Up and Begin Delivery'
                            : ''}
                        </Text>
                      </View>
                    </View>
                    <View style={{ marginTop: 20 }}>
                      <Text style={{ fontWeight: 'bold' }}>
                        Contact-free delivery
                      </Text>
                      <Text>Driver will drop off order, then notify you.</Text>
                    </View>
                  </>
                )}
              </>
            ) : null}
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default connect((store) => ({ app: store.app }), {
  logout,
  setAppState,
  i18nT,
})(TrackOrderScreen);
