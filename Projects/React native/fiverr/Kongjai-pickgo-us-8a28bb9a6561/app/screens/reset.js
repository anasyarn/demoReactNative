
import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import { headerOptions } from '../styles/header';
import styles from '../styles/home';

export default class ResetScreen extends Component {

  static navigationOptions = {...headerOptions, title: 'Reset Password'}

  render() {
  	const {navigate} = this.props.navigation;
    return (
		<View style={styles.mainView}>
			<Text>Reset Password</Text>
      </View>
    );
  }
}
