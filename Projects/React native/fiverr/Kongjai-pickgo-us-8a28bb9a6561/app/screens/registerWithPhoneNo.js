import React, { Component, Fragment, createRef } from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
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
import { RaisedTextButton } from 'react-native-material-buttons';
import { withNextInputAutoFocusForm } from 'react-native-formik';
import * as Yup from 'yup';
import { simpleRegister, i18n, i18nT } from '../store/appActions';
import { CheckBox } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from '../config/firebase';
import { countryCodes } from '../config/settings';
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from 'expo-firebase-recaptcha';
import { Dropdown } from 'react-native-material-dropdown';
import PhoneInput from 'react-native-phone-number-input';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
  phone: Yup.string(),
});

const FormikInput = compose(
  handleTextInput,
  withNextInputAutoFocusInput
)(TextField);

const FormikCheckBox = compose(
  handleTextInput,
  withNextInputAutoFocusInput
)(CheckBox);

const firebaseConfig = {
  apiKey: 'AIzaSyAEpCcvVn-uvAhDmGucDnDZNDKvpmeiyRA',
  authDomain: 'pickgo-1498514382578.firebaseapp.com',
  databaseURL: 'https://pickgo-1498514382578.firebaseio.com',
  projectId: 'pickgo-1498514382578',
  storageBucket: 'pickgo-1498514382578.appspot.com',
  messagingSenderId: '361448633168',
  appId: '1:361448633168:web:b7fb150102239a6914b255',
  measurementId: 'G-YCL9BWZ5SC',
};

const Form = withNextInputAutoFocusForm(View);

class registerWithPhoneNoScreen extends Component {
  static navigationOptions = {
    ...headerOptions,
    title: i18n.t('register.title'),
  };

  constructor(props) {
    super(props);
    this.state = {
      agree: false,
      selectedCode: '+856',
      showCodeField: false,
      code: '',
      verificationId: '',
      success: null,
      pickerData: null,
      value: '',
      disabled: true,
    };
    this.phoneRef = React.createRef(null);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.recaptchaVerifier = createRef(null);
  }

  async sendVerificationCode() {
    const { navigation } = this.props;
    const phoneProvider = new firebase.auth.PhoneAuthProvider();

    const verificationId = await phoneProvider.verifyPhoneNumber(
      this.state.value,
      this.recaptchaVerifier.current
    );
    this.setState({
      verificationId: verificationId,
      // showCodeField: true,
    });
    navigation.navigate('PhoneVerification', {
      verificationId: verificationId,
      sendVerificationCode: async () => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        const verificationId = await phoneProvider.verifyPhoneNumber(
          this.state.value,
          this.recaptchaVerifier.current
        );
        this.setState({
          verificationId: verificationId,
        });
      },
    });
  }
  async verifyCode() {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        this.state.verificationId,
        this.state.code
      );
      this.setState({
        success: true,
        showCodeField: false,
      });
    } catch (err) {
      this.setState({
        success: false,
        showCodeField: false,
      });
    }
  }

  handleSubmit(user, actions) {
    const { simpleRegister, navigation } = this.props;
    simpleRegister(user).then(
      (res) => {
        actions.setSubmitting(false);
        navigation.navigate('Promotions', {
          table: null,
          enter_new_card: false,
          company_id: null,
        });
      },
      (err) => {
        actions.setSubmitting(false);
        for (var key in err.messages) {
          let field = key;
          if (field == '_agree') field = 'agree';
          actions.setFieldError(field, err.messages[key].join(', '));
        }
      }
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    const { app, i18nT } = this.props;
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.mainView}>
          <Formik
            onSubmit={this.handleSubmit}
            validationSchema={validationSchema}
            initialValues={{
              agree: true,
            }}
            render={(props) => {
              const { isSubmitting } = props;
              return (
                <Form>
                  <PhoneInput
                    // ref={this.phoneRef}
                    defaultValue={this.state.value}
                    defaultCode="LA"
                    onChangeFormattedText={(text) => {
                      if (this.state.value.length > 7) {
                        this.setState({
                          disabled: false,
                        });
                      }
                      this.setState({
                        value: text,
                      });
                    }}
                    // withDarkTheme
                    withShadow
                    autoFocus
                    containerStyle={{ width: '100%' }}
                  />
                  <FirebaseRecaptchaVerifierModal
                    ref={this.recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                    attemptInvisibleVerification={true}
                  />
                  {isSubmitting && <ActivityIndicator />}
                  {!isSubmitting && (
                    <View style={{ marginTop: 50 }}>
                      <RaisedTextButton
                        color="#27ae60"
                        titleColor="#ffffff"
                        onPress={() => this.sendVerificationCode()}
                        // title="Verify"
                        title={i18nT('register.verify')}
                        disabled={this.state.disabled}
                        style={styles.itemMargin}
                      />
                      <RaisedTextButton
                        onPress={() => this.sendVerificationCode()}
                        // title="Sign Up With E-Mail"
                        title={i18nT('register.signupwithemail_button')}
                        disabled={this.state.disabled}
                        style={styles.itemMargin}
                      />
                    </View>
                  )}
                </Form>
              );
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default connect((store) => ({ app: store.app }), {
  simpleRegister,
  i18nT,
})(registerWithPhoneNoScreen);
