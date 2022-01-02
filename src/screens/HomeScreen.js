import React, { Component } from 'react';
import {
  Text,
  View,
  StatusBar,
  BackHandler,
  Alert,
  FlatList,
} from 'react-native';
import { Header, Container, Button, Icon, Input, Item, ListItem } from 'native-base';
import { colors } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { countries } from "../constants/countries"
export class SettingsScreen extends Component {
  state = {
    loading: false,
    name: '',
    address: '',
    userData: {},
    loginLocation: { longitude: '', latitude: '', address: '' },
  };

  async componentDidMount() {

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

  handleLogout = () => {
    Alert.alert('Hold on!', 'Are you sure want to exit the app?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      { text: 'YES', onPress: () => logout() },
    ]);
    const logout = async () => {
      await AsyncStorage.removeItem('userData');
      BackHandler.exitApp()
    }
  }
  renderCountries = ({ item }) => {
    return (
      <ListItem>
        <Text>
          {item.name}
        </Text>
      </ListItem>
    )
  }
  render() {
    return (
      <Container>
        <Header
          style={{
            backgroundColor: colors.app,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View />
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
            name="ios-exit-outline"
            style={{ color: 'white' }}
            onPress={async () => {
              this.handleLogout()
            }}
          />
        </Header>
        <FlatList
          data={countries}
          renderItem={this.renderCountries}
          keyExtractor={(item) => item.code}
        />
        <StatusBar backgroundColor={colors.app} />
      </Container>
    );
  }
}

export default SettingsScreen;
