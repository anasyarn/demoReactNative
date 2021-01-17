import React, { useState, Fragment, createRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { headerOptions } from '../styles/header';
// import styles from '../styles/home';
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
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from 'expo-firebase-recaptcha';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from './styles';

const { Value, Text: AnimatedText } = Animated;
const CELL_COUNT = 6;
const source = {
  uri:
    'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
};

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({ hasValue, index, isFocused }) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

const PhoneVerification = (props) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [rest, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  // console.log(props.navigation.getParam('sendVerificationCode'));

  const verifyCode = async () => {
    try {
      console.log(value);
      const credential = firebase.auth.PhoneAuthProvider.credential(
        props.navigation.getParam('verificationId'),
        value
      );
      const res = await firebase.auth().signInWithCredential(credential);
      props.navigation.navigate('PhoneRegistrationComplete', {
        phoneNumber: res.user.phoneNumber,
      });
    } catch (err) {
      console.log(err);
      // props.navigation.navigate('PhoneRegistrationComplete', {
      //   phoneNumber: '123',
      // });
    }
  };

  const renderCell = ({ index, symbol, isFocused }) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell({ hasValue, index, isFocused });
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, marginHorizontal: 20 }}
      >
        <Text style={styles.title}>Verification</Text>
        <Image style={styles.icon} source={source} />
        <Text style={styles.subTitle}>
          Please enter the verification code{'\n'}
          we send to your phone number
        </Text>

        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFiledRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={renderCell}
        />
        <TouchableOpacity onPress={verifyCode} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Verify</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginLeft: 30 }}
          onPress={props.navigation.getParam('sendVerificationCode')}
        >
          <Text style={{ color: '#27ae60', fontSize: 13, fontWeight: '600' }}>
            Resend verification code via SMS
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </>
  );
};

export default connect((store) => ({ app: store.app }), {
  simpleRegister,
  i18nT,
})(PhoneVerification);
