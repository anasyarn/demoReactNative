import React, { Component, Fragment, useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import { i18n, i18nT } from '../store/appActions';
import axios from 'axios';
import * as Location from 'expo-location';
import { connect, useSelector, useDispatch } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import { Rating } from 'react-native-elements';
import * as config from '../config/config';
import styles from '../styles/promotions';
import { headerOptions, rightMenu } from '../styles/header';
import marker from '../../assets/map/pin.png';
import CurrFormat from '../components/currency-format';
import { showMessage, hideMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Ionicons';
const allRestaurants = (app, dispatch) => {
  return new Promise((resolve, reject) => {
    //console.log('allRestaurants')
    axios
      .get('/api/promotion/index?access_token=' + app.access_token, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        showMessage({
          message: dispatch(i18nT('messages.load_table_error')),
          type: 'danger',
        });
        reject(err.response.data);
      });
  });
};

const PromotionItem = ({ item, onPress }) => {
  console.log('promotions.js', item);
  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(item)}>
      <Image
        style={styles.itemImage}
        source={{ uri: config.BASE_URL + '/uploads/' + item.image }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.itemHeader}>{item.company.name}</Text>
          {item.company_user.location ? (
            <Text style={styles.itemDesc}>{item.company_user.location}</Text>
          ) : null}
        </View>
        <View style={{ flexDirection: 'column' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Rating
              readonly
              ratingCount={5}
              startingValue={4.5}
              imageSize={10}
              style={{ paddingVertical: 10 }}
            />
            <Text> 4.5 (4)</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Icon name="ios-heart" color="red" />
            <Text> (1k)</Text>
          </View>
          <View style={{right:-30}}>
          <Text style={{ fontSize: 22, color: 'red' }}>50% OFF</Text>
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{ height: 3, width: 30, backgroundColor: 'red' }}
            ></View>
            <View
              style={{ height: 3, width: 40, backgroundColor: '#26b050' }}
            ></View>
          </View>
          </View>
          <Text style={{ fontSize: 8 }}>
            A few more visits get 50% off again
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PromotionsScreen = ({ navigation }) => {
  const app = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const { navigate } = navigation;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState('pickup');
  const [DropOff_address, setDropAddress] = useState('');

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [maps, setMaps] = useState(null);
  const [region, setRegion] = useState({});

  const [pointCoords_pickup, setpointCoords_pickup] = useState({});
  const [pointCoords, setpointCoords] = useState({});
  const [predictions_pickup, setpredictions_pickup] = useState([]);
  const [Pickup, setPickup] = useState('');
  const [address_from, setAddress_from] = useState('');
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
    if (!loading) {
      setLoading(true);

      allRestaurants(app, dispatch)
        .then((res) => {
          setItems(res.promotions);
          //console.log("res.promotions")
          //console.log(res.promotions)
          setLoading(false);
        })
        .catch((err) => {
          //console.log(err)
          setLoading(false);
        });
    }
  }, []);
  const onRegionChange = (region) => {
    setRegion(region);
    let value = {
      latitude: region.latitude,
      longitude: region.longitude,
    };
    //console.log("region");
    //console.log(region);
    getpickupMarker(value, '', 'region');
  };
  const getpickupMarker = async (
    destinationPlaceId,
    destinationName,
    pick_from
  ) => {
    try {
      setpointCoords([]);
      if (pick_from == 'id') {
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${destinationPlaceId}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`;
        const response = await fetch(apiUrl);
        const json = await response.json();
        let details = json.results[0];
        //console.log(details);
        if (details != undefined) {
          const latitude = json.results[0].geometry.location.lat;
          const longitude = json.results[0].geometry.location.lng;
          const pointCoords_pickup = {
            latitude: latitude,
            longitude: longitude,
          };
          setpointCoords_pickup(pointCoords_pickup);
          setpredictions_pickup([]);
          setPickup(destinationName);

          setAddress_from(destinationName);

          // Keyboard.dismiss();
          // maps.animateToCoordinate(pointCoords_pickup);
        } else {
          // alert("We Do Not Operate in this area")
        }
        // this.map.fitToCoordinates(pointCoords_pickup);
      }
      if (pick_from == 'region') {
        const NameApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${destinationPlaceId.latitude},${destinationPlaceId.longitude}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`;
        const response_nameApi = await fetch(NameApiUrl);
        const json_nameApi = await response_nameApi.json();

        let details = json_nameApi.results[0];
        // console.log("details");
        // console.log(details);

        if (details != undefined) {
          destinationName =
            json_nameApi.results[0].address_components[0].long_name +
            ', ' +
            json_nameApi.results[0].address_components[1].long_name +
            ', ' +
            json_nameApi.results[0].address_components[2].long_name;
          // console.log(destinationName);
          // console.log(destinationName);
          const pointCoords_pickup = {
            latitude: destinationPlaceId.latitude,
            longitude: destinationPlaceId.longitude,
          };
          setpointCoords_pickup(pointCoords_pickup);
          setpredictions_pickup([]);
          setPickup(destinationName);
          setAddress_from(destinationName);

          // Keyboard.dismiss();
        } else {
          // alert("We Do Not Operate in this area")
        }
      }
    } catch (err) {
      // alert("We Do Not Operate in this area")
    }
  };
  const onChangePickup = async (pickup) => {
    // this.setState({ pickup });
    setAddress_from(pickup);
    const apiUrl =
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0&input=' +
      pickup;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      setpredictions_pickup(json.predictions);
      console.log('json.predictions');
      console.log(json.predictions);
      //   this.setState({ predictions_pickup: json.predictions });
    } catch (err) {
      //   this.setState({status:true})
      // alert("We Do not operate in this area")
    }
  };

  const predictions_text = predictions_pickup.map(
    (prediction, index) => (
      <TouchableHighlight
        key={index}
        onPress={() =>
          getpickupMarker(
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
              fontSize: 16,
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

  if (loading)
    return (
      <View style={styles.containerCenter}>
        <ActivityIndicator />
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView stickyHeaderIndices={[page == 'delivery' ? 1 : null]}>
        <View
          style={{
            width: '100%',
            alignContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
          }}
        >
          <View style={{ width: '60%' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '50%' }}>
                <TouchableOpacity
                  onPress={() => setPage('delivery')}
                  style={{
                    width: '100%',
                    height: 40,
                    borderColor: '#e9e9e9',
                    borderWidth: 1,
                    borderRadius: 50,
                    backgroundColor: page == 'pickup' ? '#fff' : '#26b050',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: page == 'pickup' ? '#000' : '#fff',
                      textAlign: 'center',
                    }}
                  >
                    Delivery
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: '50%' }}>
                <TouchableOpacity
                  onPress={() => setPage('pickup')}
                  style={{
                    width: '100%',
                    height: 40,
                    borderColor: '#e9e9e9',
                    borderWidth: 1,
                    borderRadius: 50,
                    backgroundColor: page == 'pickup' ? '#26b050' : '#fff',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: page == 'pickup' ? '#fff' : '#000',
                      textAlign: 'center',
                    }}
                  >
                    Pickup
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {page == 'delivery' ? (
          <View style={{ width: '100%' }}>
            <TextInput
              style={{
                fontSize: 18,
                width: '100%',
                backgroundColor: '#fff',
                borderColor: '#e9e9e9',
                borderWidth: 0.8,
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderRadius: 10,
                marginTop: 20,
              }}
              onChangeText={(pickup) => onChangePickup(pickup)}
              value={address_from}
              placeholder={'Where Deliver to?'}
            />
            {predictions_pickup ? (
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
                  {predictions_text}
                </View>
              </View>
            ) : null}
          </View>
        ) : null}
        {page == 'delivery' ? (
          <View style={{ width: '100%' }}>
            {location ? (
              <View style={{ width: '100%', marginVertical: 10 }}>
                <MapView
                  showsUserLocation={true}
                  initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0222,
                    longitudeDelta: 0.0221,
                  }}
                  onRegionChangeComplete={onRegionChange}
                  // ref={map => {
                  //   setMaps(map);
                  // }}
                  // showsCompass={true}
                  rotateEnabled={false}
                  style={{ height: 200 }}
                ></MapView>
                <View
                  style={{
                    left: '50%',
                    marginLeft: -14,
                    marginTop: -110,
                    position: 'absolute',
                    top: '90%',
                    height: 32,
                    width: 32,
                  }}
                >
                  <Image
                    style={{
                      height: '100%',
                      width: '100%',
                    }}
                    source={marker}
                  />
                </View>
              </View>
            ) : null}
          </View>
        ) : null}
        {page == 'pickup'
          ? items.map((item) => {
              return (
                <PromotionItem
                  key={item.id}
                  item={item}
                  onPress={(item) => {
                    navigate('Checkout', {
                      company_id: item.cid,
                      table: null,
                      enter_new_card: false,
                      res_id: item.id,
                    });
                  }}
                />
              );
            })
          : items.map((item) =>
              item.company.delivery == 1 ? (
                <PromotionItem
                  key={item.id}
                  item={item}
                  onPress={(item) => {
                    navigate('Checkout', {
                      company_id: item.cid,
                      table: null,
                      enter_new_card: false,
                    });
                  }}
                />
              ) : null
            )}
      </ScrollView>
    </View>
  );
};

PromotionsScreen.navigationOptions = (screenProps) => ({
  title: i18n.t('home.promotions'),
  headerRight: rightMenu,
  ...headerOptions,
});

export default PromotionsScreen;
