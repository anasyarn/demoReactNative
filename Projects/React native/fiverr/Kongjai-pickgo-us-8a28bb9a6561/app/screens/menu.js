import React, { Component, Fragment } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { connect } from 'react-redux';

import styles from '../styles/menu';
import { headerOptions, rightMenu } from '../styles/header';

class MenuScreen extends Component {
  static navigationOptions = {...headerOptions, title: 'Menu', headerRight: rightMenu}

  render() {
    const {  } = this.props;
    return (
      <View><Text></Text></View>
    );
  }
}

export default connect(state => ({
  app: state.app
}), {}) (MenuScreen);

