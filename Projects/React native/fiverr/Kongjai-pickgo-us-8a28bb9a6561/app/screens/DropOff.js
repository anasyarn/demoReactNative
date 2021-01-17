
import React, { Component } from 'react';
import { View, Button, AppRegistry, StyleSheet, Text, Linking,
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
    PermissionsAndroid
 } from 'react-native';
import { connect } from 'react-redux';
import * as Location from 'expo-location';
import MapView, { Marker } from "react-native-maps";
import { Icon,List, ListItem } from "react-native-elements";
import { headerOptions, rightMenu } from '../styles/header';
import { logout, setAppState, i18n, i18nT } from "../store/appActions";
var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

import marker from "../../assets/map/pin.png";

class DropOffScreen extends Component {

	// static navigationOptions = {...headerOptions, headerRight: rightMenu, title: i18n.t('home.title')}

	constructor(props) {
        super(props);
        this.data = this.props.navigation.state.params;
        console.log("this.data");
        console.log(this.data);
        this.state = {
            lat:"",
            lng:"",
            region:null,
            pointCoords: [],
            status:"",
            pointCoords_pickup:null,
            predictions_pickup: [],
            pickup: "",
            address_from: "",
            pickup_coordinates: this.data.pickup_coords


        }
      
	}
componentDidMount(){
this._getLocationAsync();
}
_getLocationAsync = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({});
   console.log(location)

    this.setState({
      lat: location.coords.latitude,
      lng: location.coords.longitude
    });
  };
	onSuccess = (e) => {
	}
    onRegionChange = region => {
        if (!this.state.done) {
          this.setState({
            region
          });
          let value = {
            latitude: region.latitude,
            longitude: region.longitude
          };
          this.getpickupMarker(value, "", "region");
        } else {
        }
      };
      onChangePickup = async pickup => {
        this.setState({ pickup });
        const apiUrl =
          "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0&input=" +
          pickup;
        try {
          const result = await fetch(apiUrl);
          const json = await result.json();
          this.setState({ predictions_pickup: json.predictions });
        } catch (err) {
          this.setState({status:true})
          // alert("We Do not operate in this area")
        }
      };
      getpickupMarker = async (destinationPlaceId, destinationName, pick_from) => {
        try {
          this.setState({
            pointCoords: []
          });
          if (pick_from == "id") {
            const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${destinationPlaceId}&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`;
            const response = await fetch(apiUrl);
            const json = await response.json();
            let details = json.results[0];
            console.log(details);
            if(details != undefined){
      
              if (json.status == "ZERO_RESULTS") {
                this.setState({ status: true });
              } else if (json.status == "INVALID_REQUEST") {
                this.setState({
                  status: true
                });
              }  else {
                this.setState({
                  status: false,
                  country_from: ""
                });
                const latitude = json.results[0].geometry.location.lat;
                const longitude = json.results[0].geometry.location.lng;
                const pointCoords_pickup = {
                  latitude: latitude,
                  longitude: longitude
                };
                this.setState({
                  pointCoords_pickup,
                  predictions_pickup: [],
                  pickup: destinationName,
                  address_from: destinationName
                });
                Keyboard.dismiss();
                this.map.animateToCoordinate(pointCoords_pickup);
              }
            }
            else {
              this.setState({status:true})
              // alert("We Do Not Operate in this area")
            }
            // this.map.fitToCoordinates(pointCoords_pickup);
          }
          if (pick_from == "region") {
            const NameApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
              destinationPlaceId.latitude
            },${
              destinationPlaceId.longitude
            }&key=AIzaSyClWP2Dx_O_bsAdrxbQu6_zBOuxBY_qrh0`;
            const response_nameApi = await fetch(NameApiUrl);
            const json_nameApi = await response_nameApi.json();
    
            
            let details = json_nameApi.results[0];
    
            
    if(details != undefined){
     
      if (json_nameApi.status == "ZERO_RESULTS") {
        this.setState({
          status: true
        });
      } else if (json_nameApi.status == "INVALID_REQUEST") {
        this.setState({
          status: true
        });
      }  else {
        this.setState({
          status: false,
          country_from: ""
        });
        destinationName = json_nameApi.results[0].formatted_address;
        const pointCoords_pickup = {
          latitude: destinationPlaceId.latitude,
          longitude: destinationPlaceId.longitude
        };
        this.setState({
          pointCoords_pickup,
          predictions_pickup: [],
          pickup: destinationName,
          address_from: destinationName
        });
        Keyboard.dismiss();
      }
    }
    else {
      this.setState({status:true})
      // alert("We Do Not Operate in this area")
    }
          }
        } catch (err) {
          this.setState({status:true})
          // alert("We Do Not Operate in this area")
        }
      };
      
	render() {
		const { navigate } = this.props.navigation;
        const { app, logout, setAppState, i18nT } = this.props
        const predictions_pickup = this.state.predictions_pickup.map(
            prediction => (
              <TouchableHighlight
                key={prediction.id}
                onPress={() =>
                  this.getpickupMarker(
                    prediction.place_id,
                    prediction.structured_formatting.main_text,
                    "id"
                  )
                }
              >
                <View>
                  <Text
                    style={{
                      backgroundColor: "#fff",
                      padding: 8,
                      fontSize: 16,
                      borderWidth: 0.3
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

<View style={styles.mainbody}>
              
              <MapView
              showsUserLocation={true}
                  initialRegion={{
                    latitude: this.state.lat,
      longitude: this.state.lng,
      latitudeDelta: 0.9222,
      longitudeDelta: 0.9221,
                  }}
                  onRegionChangeComplete={this.onRegionChange}
                  // showsCompass={true}
                  ref={map => {
                    this.map = map;
                  }}
                  style={styles.map}
                >
              
                </MapView>
             
                <View style={styles.markerFixed}>
                    <Image style={styles.marker} source={marker} />
                  </View>
              
              <View
                style={{
                  position: "absolute",
                  top:120
                }}
              >
              {this.state.predictions_pickup ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column"
                  }}
                >
                  <View
                    style={{
                      width: deviceWidth,
                      backgroundColor: "#fff"
                    }}
                  >
                    {predictions_pickup}
                    
                  </View>
                </View>
              ) : null}
             
              
              </View>

              <View style={{position:"absolute", top:80, width:deviceWidth, backgroundColor:"#fff", paddingVertical:10}}>
                          <View style={{flexDirection:"row"}}>
                          <TouchableOpacity onPress={() => {navigate('Delivery')}} style={{width:"20%"}}>
                           <Icon
								name='arrow-left'
								type='font-awesome'
                                size={22}
								color='#26b050'
							/>
                           </TouchableOpacity>
                           <View style={{width:"60%"}}>
                           <TextInput
                          style={{
                           fontSize:12,
                            width:"100%",
                            backgroundColor: "#fff"
                          }}
                          onChangeText={pickup => this.onChangePickup(pickup)}
                          value={this.state.pickup}
                          placeholder={"Drop off Location"}
                        />
                           </View>
                           <View style={{width:"20%"}}>
                               <View style={{flexDirection:"row"}}>
                                   <View style={{width:"50%"}}>
                                   <Icon
								name='search'
                                size={22}
								type='font-awesome'
                                color='#26b050'
							/>
                                   </View>
                                   <View style={{width:"50%"}}>
                                   <Icon
								name='compass'
								type='font-awesome'
                                size={22}
								color='#26b050'
							/>
                                   </View>
                               </View>
                           </View>
                          </View>
             </View>
            

            
            
              <View style={{position:"absolute", bottom:30, width:deviceWidth, alignContent:"center", alignItems:"center"}}>
              <TouchableOpacity onPress={() => { navigate('Directions',{pickup_coordinates: this.state.pickup_coordinates, dropoff_coordinates : this.state.pointCoords_pickup}) }} style={{width:"90%", backgroundColor:"#26b050", paddingVertical:10}}>
                            <Text style={{textAlign:"center", color:"#fff", fontSize:22}}>Drop Off HERE</Text>
                          </TouchableOpacity>
             </View>
            </View>
       
		);
	}
}
const styles = {
    MyPinContainer: {
      zIndex: 9,
      flex: 1,
      position: "absolute",
      width: 45,
      height: 45,
      backgroundColor: "#fff",
      left: deviceWidth - 70,
      top: "15%",
      borderRadius: 50,
      shadowColor: "#000000",
      elevation: 7,
      shadowRadius: 5,
      shadowOpacity: 1.0,
      justifyContect: "center",
      alignItem: "center",
      alignContent: "center"
    },
    markerFixed: {
      left: "50%",
      marginLeft: -14,
      marginTop: -110,
      position: "absolute",
      top: "60%",
      height: 32,
      width: 32
    },
    marker: {
      height: "100%",
      width: "100%"
    },
    mainbody: {
      flex: 1,
      justifyContent: "center"
    },
    mainContainer: {
      flex: 1.0,
      backgroundColor: "white"
    },
    safeAreaStyle: {
      flex: 1.0,
      backgroundColor: "#FFF"
    },
    headerContainer: {
      height: 44,
      flexDirection: "row",
      justifyContect: "center",
      backgroundColor: "#EDEDED"
    },
    headerTitle: {
      flex: 1.0,
      textAlign: "center",
      alignSelf: "center",
      color: "#000"
    },
    menuButton: {
      paddingLeft: 8,
      paddingRight: 8,
      width: 50,
      alignSelf: "center",
      tintColor: "#000"
    },
    menuContainer: {
      flex: 1.0,
      backgroundColor: "#EDEDED"
    },
    menuTitleContainer: {
      alignContent: "flex-start",
      height: 60,
      width: "100%",
      flexDirection: "row",
      justifyContect: "flex-start",
      paddingLeft: 5
    },
    menuTitle: {
      color: "#000000",
      fontSize: 17
    },
    profileImg: {
      height: 50,
      width: 50,
      borderRadius: 25
    },
    drawerMenuHeader: {
      flexDirection: "row",
      borderBottomWidth: 0.5,
      paddingBottom: 15,
      borderBottomColor: "#808080"
    },
    map: {
      height: (deviceHeight * 2) / 2
    },
    maps: {
      height: (deviceHeight * 2) / 3.5
    }
  };
export default connect(store => ({ app: store.app }), { logout, setAppState, i18nT })(DropOffScreen);

