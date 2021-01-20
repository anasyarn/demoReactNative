import React, {Component} from 'react';
import {Text, View, StatusBar, StyleSheet} from 'react-native';
import MapView, {Polyline, Marker} from 'react-native-maps';

export class SettingsScreen extends Component {
  state = {
    loading: false,
    domainName: '',
    interval: '',
    opId: '',
    userData: {},
    region: {
      latitude: 23.804801677432614,
      longitude: 90.40766284277802,
      latitudeDelta: 0.0082,
      longitudeDelta: 0.0082,
    },
    marker: true,
  };

  componentDidMount() {
    if (
      this.props.route.params.userData.actual_latitude != '' &&
      this.props.route.params.userData.actual_longitude != ''
    ) {
      let {region} = this.state;
      region.latitude = eval(this.props.route.params.userData.actual_latitude);
      region.longitude = eval(
        this.props.route.params.userData.actual_longitude,
      );
      this.setState({
        userData: this.props.route.params.userData,
        region: region,
      });
    } else {
      this.setState({
        userData: this.props.route.params.userData,
        marker: false,
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          region={this.state.region}
          mapType="hybrid"
          onRegionChange={(reg) => {
            console.log(reg);
          }}
          style={styles.map}
          showsCompass={false}
          showsMyLocationButton={true}>
          {this.state.marker ? (
            <Marker
              coordinate={this.state.region}
              title="User"
              description="User current Location"
            />
          ) : null}
        </MapView>
        <StatusBar backgroundColor={'transparent'} translucent={true} />
      </View>
    );
  }
}

export default SettingsScreen;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
