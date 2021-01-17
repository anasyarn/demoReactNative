import React, { Component, Fragment } from 'react';
import {
  View,
  Button,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { headerOptions } from '../styles/header';
import styles from '../styles/home';

import {
  handleTextInput,
  withNextInputAutoFocusInput,
} from 'react-native-formik';
import { Formik } from 'formik';
import { TextField } from 'react-native-material-textfield';
import { RaisedButton, RaisedTextButton } from 'react-native-material-buttons';
import { withNextInputAutoFocusForm } from 'react-native-formik';
import * as Yup from 'yup';
import { login, reset, i18n, i18nT, setAppState } from '../store/appActions';
import * as AppAuth from 'expo-app-auth';
import * as Facebook from 'expo-facebook';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Dropdown } from 'react-native-material-dropdown';
import * as config from '../config/config';

const validationSchema = Yup.object().shape({
  username: Yup.string().required().email(i18nT('list.email_format')),
  password: Yup.string().required(),
});

const MyInput = compose(
  handleTextInput,
  withNextInputAutoFocusInput
)(TextField);

const Form = withNextInputAutoFocusForm(View);

class LoginScreen extends Component {
  static navigationOptions = { ...headerOptions, title: i18n.t('login.title') };

  constructor(props) {
    super(props);
    this.state = {
      showLanguageChange: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    props.reset();
  }

  handleSubmit(user, actions) {
    const { login } = this.props;
    login(user).then(
      () => {},
      (error) => {
        actions.setFieldError('username', error);
        actions.setFieldError('password', error);
      }
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    const { app, i18nT, setAppState } = this.props;
    return (
      <View style={styles.mainView}>
        <Formik
          onSubmit={this.handleSubmit}
          validationSchema={validationSchema}
          render={(props) => {
            return (
              <Form>
                <MyInput
                  disabled={app.loading}
                  label={i18nT('login.email_label')}
                  name="username"
                  type="email"
                />
                <MyInput
                  disabled={app.loading}
                  label={i18nT('login.password_label')}
                  name="password"
                  type="password"
                />

                {app.loading && <ActivityIndicator />}

                {!app.loading && (
                  <Fragment>
                    <RaisedTextButton
                      color="#27ae60"
                      titleColor="#ffffff"
                      onPress={props.handleSubmit}
                      // title={i18nT('login.login_button')}
                      title={i18nT('login.signin_button')}
                      disabled={app.loading}
                    />
                    <Text style={{ alignSelf: 'center', marginVertical: '5%' }}>
                      OR
                    </Text>
                    {/* <RaisedButton
                      color="#27ae60"
                      titleColor="#ffffff"
                      onPress={() => navigate('RegisterWithPhone')}
                      style={{
                        ...styles.itemMargin,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <FontAwesome
                        name="phone"
                        style={{ marginRight: 5 }}
                        size={20}
                        color="#fff"
                      />
                      <Text style={{ color: '#fff', textAlign: 'center' }}>
                        CONTINUE WITH PHONE NUMBER
                      </Text>
                    </RaisedButton> */}
                    <RaisedButton
                      color="#ee3739"
                      titleColor="#ffffff"
                      onPress={() =>
                        navigate('SocialLogin', { type: 'google' })
                      }
                      style={{
                        ...styles.itemMargin,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <AntDesign
                        name="googleplus"
                        size={24}
                        style={{ marginRight: 5 }}
                        color="#fff"
                      />
                      <Text style={{ color: '#fff', textAlign: 'center' }}>
                        {i18nT('login.signinwithgoogle_button')}
                      </Text>
                    </RaisedButton>
                    <RaisedButton
                      color="#2b5c94"
                      titleColor="#ffffff"
                      onPress={() =>
                        navigate('SocialLogin', { type: 'facebook' })
                      }
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <EvilIcons name="sc-facebook" size={24} color="#fff" />
                      <Text style={{ color: '#fff', textAlign: 'center' }}>
                        {i18nT('login.signinwithfb_button')}
                      </Text>
                    </RaisedButton>
                    <Text style={{ alignSelf: 'center', marginVertical: '4%' }}>
                      {i18nT('login.donthaveanaccount')}
                    </Text>
                    <RaisedTextButton
                      // title={i18nT('login.register_button')}
                      title={i18nT('login.signup_button')}
                      onPress={() => navigate('Register')}
                    />
                  </Fragment>
                )}
              </Form>
            );
          }}
        />
        <Dropdown
          containerStyle={{ marginTop: 30 }}
          label={i18nT('home.language')}
          data={config.LANGUAGES.map((lang) => ({
            label: i18nT('languages.' + lang),
            value: lang,
          }))}
          value={i18nT('languages.' + app.lang)}
          onChangeText={(lang) => {
            setAppState({ lang: lang });
            console.log(lang);
          }}
        ></Dropdown>
        {this.state.showLanguageChange && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 10,
              backgroundColor: '#fff',
            }}
          >
            {config.LANGUAGES.map((lang, index) => (
              <TouchableOpacity
                key={index}
                style={{ marginVertical: 10 }}
                onPress={() => {
                  this.setState({
                    showLanguageChange: false,
                  });
                  setAppState({ lang: lang });
                  console.log(lang);
                }}
              >
                <Text style={{ fontSize: 15 }}>
                  {i18nT('languages.' + lang)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }
}

export default connect((store) => ({ app: store.app }), {
  login,
  reset,
  i18nT,
  setAppState,
})(LoginScreen);
