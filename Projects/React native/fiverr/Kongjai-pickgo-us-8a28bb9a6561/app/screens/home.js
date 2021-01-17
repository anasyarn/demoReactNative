import React, { Component } from 'react';
import {
  View,
  Button,
  AppRegistry,
  StyleSheet,
  Text,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { headerOptions, rightMenu } from '../styles/header';
import styles from '../styles/home';
import { logout, setAppState, i18n, i18nT } from '../store/appActions';
import { RaisedTextButton } from 'react-native-material-buttons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
// import Entypo from 'react-native-vector-icons/Entypo';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Ionicons, Entypo } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dropdown } from 'react-native-material-dropdown';
import * as config from '../config/config';

class HomeScreen extends Component {
  // static navigationOptions = {title: i18n.t('home.title')}

  constructor(props) {
    super(props);
    this.state = {
      showLanguageChange: false,
    };
    this.onPress = this.onPress.bind(this);
  }

  onSuccess = (e) => {};

  onPress() {
    const { setAppState } = this.props;
    console.log(this.props.onPress);
    setAppState({
      table: {},
      table_id: null,
      company_id: null,
      company: {},
    }).then(() => this.props.navigation.navigate('Checkout', {}));
  }

  render() {
    const { navigate } = this.props.navigation;
    const { app, logout, setAppState, i18nT } = this.props;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, marginTop: 40 }}
      >
        {/* <View style={styles.mainView}>
          <RaisedTextButton
            onPress={() => {
              setAppState({table: {}, table_id: null, company_id: null, company: {}});
              navigate('Checkout', {table: null, enter_new_card: false, company_id: null})
            }}
            title={i18nT('home.checkout')}
            color="#27ae60"
            titleColor="#ffffff"
            style={styles.itemMargin}
          />
          <RaisedTextButton
            onPress={() => { navigate('Promotions')}}
            title={i18nT('home.promotions')}
            style={styles.itemMargin}
          />
          <RaisedTextButton
            onPress={() => { navigate('Wallet')}}
            title={i18nT('home.wallet')}
            style={styles.itemMargin}
          />
          <RaisedTextButton
            onPress={() => { navigate('List')}}
            title={i18nT('home.orders')}
            style={styles.itemMargin}
          />
          <RaisedTextButton
            onPress={() => { navigate('PinLocation')}}
            title={i18nT('home.delivery')}
            style={styles.itemMargin}
          />
          <RaisedTextButton
            onPress={logout}
            title={i18nT('home.logout')}
          />

          <Dropdown
            label={i18nT('home.language')}
            data={config.LANGUAGES.map(lang => ({label: i18nT('languages.' + lang), value: lang}))}
            value={i18nT('languages.' + app.lang)}
            onChangeText={lang => {
              setAppState({lang: lang})
            }}
          />
        </View> */}
        <KeyboardAwareScrollView
          enableOnAndroid={false}
          contentContainerStyle={{
            flexGrow: 1,
            flex: 1,
            marginTop: '3%',
            marginHorizontal: '2%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#2bae6a',
              height: 150,
              justifyContent: 'space-evenly',
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 3,
                height: 3,
              },
              shadowOpacity: 0.3,
              width: '100%',
            }}
          >
            <TouchableOpacity
              onPress={this.onPress}
              style={{
                //   paddingLeft: '15%',
                alignItems: 'center',
              }}
            >
              <AntIcon size={40} name="scan1" color="#fff" />
              <View style={{ marginLeft: '3%' }}>
                <Text style={{ color: '#fff', fontSize: 18 }}>Scan Pay</Text>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{
                paddingLeft: '15%',
                alignItems: 'center',
              }}
              // onPress={() => { navigate('Wallet')}}
            >
              <AntIcon size={40} name="wallet" color="#fff" />
              <View style={{ marginLeft: '3%' }}>
                <Text style={{ color: '#fff', fontSize: 18 }}>
                  {i18nT('home.wallet')}
                </Text>
                <Text style={{ color: 'lightgray' }}>₭ 0.00</Text>
              </View>
            </TouchableOpacity> */}
          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            alignItems: 'center',
            // justifyContent: 'center',
            flex: 2,
            // borderTopLeftRadius: 10,
            // borderTopRightRadius: 10,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {
              width: 3,
              height: 3,
            },
            shadowOpacity: 0.3,
            paddingVertical: 20,
          }}
        >
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#efefef',
              borderRadius: 10,
              paddingVertical: 20,
              marginHorizontal: 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: '100%',
                pading: 10,
              }}
            >
              {/* <TouchableOpacity
                onPress={() => navigate('Promotions', {})}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <View
                  style={{
                    padding: 5,
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 20,
                    backgroundColor: 'green',
                  }}
                >
                  <MaterialIcons size={25} color="#fff" name="restaurant" />
                </View>
                <Text style={{ fontSize: 18, marginLeft: 10 }}>
                  {i18nT('home.promotions')}
                </Text>
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <View
                  style={{
                    padding: 5,
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 20,
                    backgroundColor: 'red',
                  }}
                >
                  <MaterialCommunityIcons size={25} color="#fff" name="tag" />
                </View>
                <Text style={{ fontSize: 18, marginLeft: 10 }}>Shop</Text>
              </TouchableOpacity> */}
            </View>
          </View>
          {/* <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              // height: 700,
            }}
          >
            <TouchableOpacity
              style={screenStyles.buttonStyle}
              onPress={() => {
                navigate('List');
              }}
            >
              <AntIcon name="creditcard" size={30} color="brown" />
              <Text>{i18nT('home.orders')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={screenStyles.buttonStyle}
              onPress={() => this.props.navigation.navigate('Checkout')}
            >
              <AntIcon name="shoppingcart" size={30} color="red" />
              <Text>{i18nT('home.checkout')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('PinLocation')}
              style={screenStyles.buttonStyle}
            >
              <FeatherIcon name="package" size={30} color="brown" />
              <Text>{i18nT('home.delivery')}</Text>
            </TouchableOpacity>
          </View> */}
          {/* <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              // height: 700,
            }}
          >
            <TouchableOpacity
              style={screenStyles.buttonStyle}
              // onPress={() => props.navigation.navigate('History')}
            >
              <FontistoIcon name="blood-drop" size={30} color="green" />
              <Text>Utilities</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={screenStyles.buttonStyle}
              // onPress={() => props.navigation.navigate('OrderRequest')}
            >
              <AntIcon name="mobile1" size={30} color="blue" />
              <Text>Mobile Topup</Text>
            </TouchableOpacity>
            <TouchableOpacity style={screenStyles.buttonStyle}>
              <Entypo name="ticket" size={30} color="red" />
              <Text>Buy Tickets</Text>
            </TouchableOpacity>
          </View> */}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              // height: 700,
            }}
          >
            {/* <TouchableOpacity
              style={screenStyles.buttonStyle}
              onPress={() => props.navigation.navigate('History')}
            >
              <FeatherIcon name="grid" size={30} color="brown" />
              <Text>Catering</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={screenStyles.buttonStyle}
              // onPress={() => props.navigation.navigate('OrderRequest')}
            >
              <MaterialCommunityIcons
                name="office-building"
                size={30}
                color="red"
              />
              <Text>Jobs</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('InviteScreen')}
              style={screenStyles.buttonStyle}
            >
              <FontAwesome name="user-plus" size={30} color="green" />
              <Text>Invite</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({ showLanguageChange: true })}
              style={screenStyles.buttonStyle}
            >
              <Entypo name="globe" size={30} color="green" />
              <Text>{i18nT('home.language')}</Text>
              {/* <Dropdown
            label={i18nT('home.language')}
            data={config.LANGUAGES.map(lang => ({label: i18nT('languages.' + lang), value: lang}))}
            value={i18nT('languages.' + app.lang)}
            onChangeText={lang => {
              setAppState({lang: lang})
              console.log(lang)
            }}
          ></Dropdown> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={logout}
              style={{ ...screenStyles.buttonStyle }}
            >
              <View
                style={{
                  backgroundColor: 'grey',
                  borderRadius: 18,
                  width: 35,
                  height: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons size={25} color="#fff" name="exit-to-app" />
              </View>
              <Text>Log out</Text>
            </TouchableOpacity>
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
                {config.LANGUAGES.map((lang) => (
                  <TouchableOpacity
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
        </View>
        <View
          style={{
            //   alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            marginTop: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {
              width: 3,
              height: 3,
            },
            shadowOpacity: 0.3,
            marginBottom: 40,
          }}
        >
          {/* <TouchableOpacity
            onPress={logout}
            style={{ ...screenStyles.buttonStyle }}
          >
            <View
              style={{
                backgroundColor: 'grey',
                borderRadius: 18,
                width: 35,
                height: 35,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons size={25} color="#fff" name="exit-to-app" />
            </View>
            <Text>Log out</Text>
          </TouchableOpacity> */}
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const screenStyles = StyleSheet.create({
  buttonStyle: {
    paddingVertical: 20,
    width: '33.33%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 100,
    backgroundColor: '#fff',
    borderWidth: 0.25,
    borderColor: '#efefef',
  },
});

export default connect((store) => ({ app: store.app }), {
  logout,
  setAppState,
  i18nT,
})(HomeScreen);
