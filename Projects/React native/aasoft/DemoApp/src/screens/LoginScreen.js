import React, {Component} from 'react';
import {Text, View, StatusBar, ActivityIndicator, Alert} from 'react-native';
import {Header, Container, Button, Icon, Input, Item} from 'native-base';
import {colors} from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import axios from 'axios';

export class DomainScreen extends Component {
  state = {
    loading: false,
    email: 'atiqurvai@gmail.com',
    password: '1234',
    viewPass: false,
  };

  ////sending login request to api
  authenticateUser = async (state) => {
    ///here we r removing curreent screen from current router later we gonna use it
    const resetAction = CommonActions.reset({
      index: 1,
      routes: [{name: 'HomeScreen'}],
    });
    if (state.email.trim() != '') {
      if (state.password.trim() !== '') {
        this.setState({loading: true});
        const formData = new FormData();
        formData.append('action', 'userLogin');
        formData.append('email', this.state.email);
        formData.append('password', this.state.password);
        axios({
          method: 'post',
          url: 'https://peoplesitdevelopers.com/testapi/apis/',
          headers: {'Content-type': 'application/json'},
          data: formData,
        })
          .then(async (res) => {
            if (res.data.length > 0) {
              try {
                //////saving user data to local storage so you wont need to login again unless u log out
                await AsyncStorage.setItem(
                  'userData',
                  JSON.stringify(res.data[0]),
                );
                this.setState({loading: false}, () => {
                  ////this is how we r going to homescreen and popping current screen from the stack router, so that if user press back button from homescreen it will never come back to login screen again instead it should exit the app
                  this.props.navigation.dispatch(resetAction);
                });
              } catch (e) {
                console.log(e);
                // saving error
              }
              this.setState({loading: false});
            } else {
              Alert.alert(
                'Wrong email or password',
                'Please enter correct email or password',
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
                  {text: 'Done', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
              );
              this.setState({loading: false});
            }
          })
          .catch((e) => {
            alert(e);
            this.setState({loading: false});
          });
      } else {
        alert('Enter password ');
      }
    } else {
      alert('Enter email');
    }
  };
  render() {
    return (
      <Container>
        <Header style={{backgroundColor: colors.app}}>
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
            <Icon type="MaterialCommunityIcons" name="account-lock-outline" />
            <Input
              onChangeText={(txt) => {
                this.setState({email: txt});
              }}
              autoCapitalize="none"
              placeholder="Enter your email"
              style={{alignSelf: 'center'}}
              value={this.state.email}
            />
          </Item>

          <Item
            style={{
              alignSelf: 'center',
              width: '90%',
              borderColor: colors.app,
            }}>
            <Icon name="ios-key-outline" />
            <Input
              onChangeText={(txt) => {
                this.setState({password: txt});
              }}
              secureTextEntry={!this.state.viewPass}
              autoCapitalize="none"
              placeholder="Enter password"
              style={{alignSelf: 'center'}}
              value={this.state.password}
            />
            <Icon
              name={this.state.viewPass ? 'ios-eye-off' : 'ios-eye'}
              onPress={() => {
                this.setState({viewPass: !this.state.viewPass});
              }}
            />
          </Item>

          <Button
            disabled={this.state.loading}
            onPress={() => {
              this.authenticateUser(this.state);
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
              <Text style={{color: 'white', fontWeight: 'bold'}}>Login</Text>
            )}
          </Button>
        </View>
        <StatusBar backgroundColor={colors.app} />
      </Container>
    );
  }
}

export default DomainScreen;
