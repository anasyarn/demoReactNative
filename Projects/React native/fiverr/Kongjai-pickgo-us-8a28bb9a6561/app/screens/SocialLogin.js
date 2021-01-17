import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { headerOptions } from '../styles/header';
import styles from '../styles/home';
import { simpleRegister, login, i18n, i18nT } from '../store/appActions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showMessage } from 'react-native-flash-message';
import * as AppAuth from 'expo-app-auth';
import * as Facebook from 'expo-facebook';
import axios from 'axios';
import * as config from '../config/config';

class SocialLogin extends Component {
  static navigationOptions = ({ navigation }) => {
    const type = navigation.getParam('type', null);
    return {
      ...headerOptions,
      title: i18n.t(
        type
          ? type === 'google'
            ? 'login.google_title'
            : 'login.facebook_title'
          : 'login.title'
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      agree: false,
      email: '',
      name: '',
    };
  }

  componentDidMount = async () => {
    setTimeout(() => {
      try {
        const type = this.props.navigation.getParam('type', null);
        if (['facebook', 'google'].includes(type)) {
          if (type === 'google') {
            this.authGoogle();
          } else if (type === 'facebook') {
            this.authFacebook();
          }
        }
      } catch (error) {
        this.onAuthFailed();
      }
    }, 1000);
  };

  authGoogle = () => {
    try {
      AppAuth.authAsync({
        issuer: 'https://accounts.google.com',
        scopes: ['profile', 'email'],
        clientId:
          '361448633168-cnbsemr6k5a6a6p6bcn5g608nljq5jnq.apps.googleusercontent.com',
      }).then(
        (result) => {
          if (result && result.accessToken) {
            fetch(
              `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${result.accessToken}`
            )
              .then((res) => res.json())
              .then((userDetails) => {
                if (userDetails && userDetails.email && userDetails.name) {
                  this.tryAuth(userDetails);
                } else {
                  this.onAuthFailed();
                }
              });
          }
        },
        () => this.onAuthFailed()
      );
    } catch (error) {
      this.onAuthFailed();
    }
  };

  authFacebook = () => {
    try {
      Facebook.initializeAsync('180665883797601').then(
        () => {
          Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile', 'email'],
          }).then(
            (result) => {
              if (result && result.token) {
                fetch(
                  `https://graph.facebook.com/me?fields=id,name,email&access_token=${result.token}`
                )
                  .then((res) => res.json())
                  .then((userDetails) => {
                    if (userDetails && userDetails.email && userDetails.name) {
                      this.tryAuth(userDetails);
                    } else {
                      this.onAuthFailed();
                    }
                  });
              } else {
                this.onAuthFailed();
              }
            },
            () => this.onAuthFailed()
          );
        },
        () => this.onAuthFailed()
      );
    } catch (error) {
      this.onAuthFailed();
    }
  };

  tryAuth = (userInfo) => {
    try {
      const type = this.props.navigation.getParam('type', null);
      if (type) {
        let request = { full_name: userInfo.name };
        const { login } = this.props;
        if (type === 'facebook') {
          request.username = userInfo.id;
          request.password = userInfo.id;
        } else if (type === 'google') {
          request.username = userInfo.sub;
          request.password = userInfo.sub;
        }
        axios({
          method: 'post',
          url: `${config.API_URL}/api/user/login`,
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify(request),
        }).then(
          (response) => {
            if (response.data && response.data.access_token) {
              login(request);
            } else {
              () => this.tryRegister(request);
            }
          },
          () => this.tryRegister(request)
        );
      }
    } catch (error) {
      this.onAuthFailed();
    }
  };

  tryRegister = (userInfo) => {
    try {
      const { simpleRegister, navigation } = this.props;
      simpleRegister({
        ...userInfo,
        agree: true,
      }).then(
        () => {
          navigation.navigate('Promotions', {
            table: null,
            enter_new_card: false,
            company_id: null,
          });
        },
        () => {
          this.onAuthFailed();
        }
      );
    } catch (error) {
      this.onAuthFailed();
    }
  };

  onAuthFailed = () => {
    showMessage({
      message: 'Authentication failed',
      type: 'danger',
    });
    this.props.navigation.pop();
    return;
  };

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.mainView}>
          <ActivityIndicator color="#000" />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default connect((store) => ({ app: store.app }), {
  simpleRegister,
  login,
  i18nT,
})(SocialLogin);
