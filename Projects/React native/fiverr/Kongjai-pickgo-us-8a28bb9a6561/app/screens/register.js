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
import { RaisedTextButton, RaisedButton } from 'react-native-material-buttons';
import { withNextInputAutoFocusForm } from 'react-native-formik';
import * as Yup from 'yup';
import { simpleRegister, i18n, i18nT } from '../store/appActions';
import { CheckBox } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome } from '@expo/vector-icons';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
  full_name: Yup.string().max(32, i18n.t('register.yup_full_name')),
  phone: Yup.string().matches(phoneRegExp, i18n.t('register.yup_phone')),
  username: Yup.string().email(i18n.t('register.yup_email')),
  password: Yup.string()
    .required()
    .label('Password')
    .min(6, i18n.t('register.yup_password')),
  agree: Yup.boolean().oneOf([true], i18n.t('register.yup_conditions')),
});

const FormikInput = compose(
  handleTextInput,
  withNextInputAutoFocusInput
)(TextField);

const FormikCheckBox = compose(
  handleTextInput,
  withNextInputAutoFocusInput
)(CheckBox);

const Form = withNextInputAutoFocusForm(View);

class RegisterScreen extends Component {
  static navigationOptions = {
    ...headerOptions,
    title: i18n.t('register.title'),
  };

  constructor(props) {
    super(props);
    this.state = {
      agree: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
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
              const { isSubmitting, values } = props;
              return (
                <Form>
                  <FormikInput
                    disabled={isSubmitting}
                    label={i18nT('register.email_label')}
                    name="username"
                    type="email"
                  />
                  <FormikInput
                    disabled={isSubmitting}
                    label={i18nT('register.password_label')}
                    name="password"
                    type="password"
                  />
                  <FormikInput
                    disabled={isSubmitting}
                    label={i18nT('register.full_name_label')}
                    name="full_name"
                    type="text"
                  />
                  <FormikInput
                    disabled={isSubmitting}
                    label={i18nT('register.phone_label')}
                    name="phone"
                    type="text"
                    keyboardType="number-pad"
                  />

                  <View
                    style={{
                      marginLeft: 0,
                      marginRight: 0,
                      marginTop: 10,
                      marginBottom: 20,
                    }}
                  >
                    <FormikCheckBox
                      title={i18nT('register.terms')}
                      containerStyle={{
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: 10,
                        marginBottom: 5,
                        borderColor:
                          props.errors.agree && props.touched.agree
                            ? 'red'
                            : '#eeeeee',
                      }}
                      checked={props.values.agree}
                      name="agree"
                      onPress={() => {
                        props.setFieldValue('agree', !props.values.agree);
                        props.setFieldTouched('agree');
                      }}
                    />
                    {props.errors.agree && props.touched.agree ? (
                      <Text style={{ fontSize: 12, color: 'red' }}>
                        {props.errors.agree}
                      </Text>
                    ) : null}
                  </View>

                  {isSubmitting && <ActivityIndicator />}
                  {!isSubmitting && (
                    <Fragment>
                      <RaisedTextButton
                        color="#27ae60"
                        titleColor="#ffffff"
                        onPress={props.handleSubmit}
                        // title={i18nT('register.register_button')}
                        title={i18nT('register.signup_button')}
                        style={styles.itemMargin}
                      />
                      {/* <Text style={{ alignSelf: 'center', marginVertical: 5 }}>
                        OR
                      </Text>
                      <RaisedTextButton
                        color="#27ae60"
                        titleColor="#ffffff"
                        onPress={() => navigate('RegisterWithPhone')}
                        title="Continue with Phone Number"
                        style={styles.itemMargin}
                      /> */}
                      <RaisedTextButton
                        onPress={() => navigate('RegisterWithPhone')}
                        title={i18nT('register.signupwithphone_button')}
                        style={styles.itemMargin}
                      />
                      <RaisedTextButton
                        // title={i18nT('register.login_button')}
                        title={i18nT('register.signin_button')}
                        onPress={() => navigate('Login')}
                      />
                    </Fragment>
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
})(RegisterScreen);
