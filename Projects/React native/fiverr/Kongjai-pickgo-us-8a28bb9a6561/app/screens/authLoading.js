
import React from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator,
  View,
} from 'react-native';
import styles from '../styles/home';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.props.navigation.navigate(this.props.app.isLoggedIn ? 'App' : 'Login');
  }

  render() {
    return (
      <View style={styles.mainView}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }
}

export default connect(store => ({ app: store.app }), {}) (AuthLoadingScreen);
