import React, { Component } from 'react';
import {
  View,
  Clipboard,
  Platform,
  StyleSheet,
  Text,
  Linking,
  TouchableOpacity,
  ToastAndroid,
  Share,
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
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Fontisto, Entypo, Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Share from 'react-native-share';

import Toast from 'react-native-simple-toast';
import { image1 } from '../../assets/pickgo.js';

class InviteTeamScreen extends Component {
  // static navigationOptions = {title: i18n.t('home.title')}

  constructor(props) {
    super(props);
    this.state = {
      showLanguageChange: false,
      message:
        'Hello please download this app Pickgo and get exciting experience it is really easy to use this app. https://pickgo.la/restaurants/main/register_business/3/7766776. Please use my invite code ',
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
    const shareOptions = {
      title: 'Invite Friends',
      message: this.state.message,
      url: image1,
    };
    const { navigate } = this.props.navigation;
    const { app, logout, setAppState, i18nT } = this.props;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, marginTop: 40 }}
      >
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
                // borderWidth: 2,
                // borderColor: 'green',
                padding: 5,
                paddingVertical: 10,
                // borderRadius: 50,
                // elevation: 20,
                backgroundColor: '#2bae6a',
                width: 100,
                height: 100,
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 15 }}>Invited</Text>
              <FontAwesome name="user-plus" size={30} color="white" />
              <Text style={{ color: '#fff', fontSize: 15 }}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.onPress}
              style={{
                //   paddingLeft: '15%',
                alignItems: 'center',
                // borderWidth: 2,
                // borderColor: 'green',
                padding: 5,
                paddingVertical: 10,
                // borderRadius: 50,
                // elevation: 20,
                backgroundColor: '#2bae6a',
                width: 100,
                height: 100,
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 15 }}>Pending</Text>
              <FontAwesome5Icon name="user-clock" size={30} color="white" />
              <Text style={{ color: '#fff', fontSize: 15 }}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.onPress}
              style={{
                //   paddingLeft: '15%',
                alignItems: 'center',
                // borderWidth: 2,
                // borderColor: 'green',
                padding: 5,
                paddingVertical: 10,
                // borderRadius: 50,
                // elevation: 20,
                backgroundColor: '#2bae6a',
                width: 100,
                height: 100,
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 15 }}>Completed</Text>
              <FeatherIcon name="user-check" size={30} color="white" />
              <Text style={{ color: '#fff', fontSize: 15 }}>0</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
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
            onPress={() =>
              Linking.openURL(
                `whatsapp://send?text=${this.state.message}${app.user.username}`
              )
                .then(() => console.log('Whatsapp opened.'))
                .catch(() => alert('Please install whatsapp.'))
            }
            style={screenStyles.buttonStyle}
          >
            <FontAwesome name="whatsapp" size={30} color="#25D366" />
            <Text>Whatsapp</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `fb://send?text=${this.state.message}${app.user.username}.`
              )
                .then(() => console.log('facebook opened.'))
                .catch(() => alert('Please install facebook.'))
            }
            style={screenStyles.buttonStyle}
          >
            <Entypo name="facebook" size={30} color="#4267B2" />
            <Text>Facebook Invite</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `fb-messenger://share?link=https://pickgo.la/restaurants/main/register_business/3/7766776`
              )
                .then(() => console.log('Messenger opened.'))
                .catch(() => alert('Please install messenger app.'))
            }
            style={screenStyles.buttonStyle}
          >
            <Fontisto name="messenger" size={30} color="#006AFF" />
            <Text>Messenger</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `mailto:support@domain.com?subject=PickGo US&body=${this.state.message}${app.user.username}.`
              )
                .then(() => console.log('Gmail opened.'))
                .catch(() => alert('Please install gmail.'))
            }
            style={screenStyles.buttonStyle}
          >
            <MaterialCommunityIcons name="gmail" size={30} color="#D44638" />
            <Text>Email</Text>
          </TouchableOpacity>
        </View>
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
            onPress={() =>
              Platform.OS === 'ios'
                ? Linking.openURL(
                    `smsto:&body=${this.state.message}${app.user.username}`
                  ).then(() => console.log('Messages opened.'))
                : Linking.openURL(
                    `smsto:?body=${this.state.message}${app.user.username}`
                  ).then(() => console.log('Messages opened.'))
            }
            style={screenStyles.buttonStyle}
          >
            <AntIcon name="message1" size={30} color="#25D366" />
            <Text>SMS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Share.share(shareOptions)}
            style={screenStyles.buttonStyle}
          >
            <Feather name="more-horizontal" size={30} color="#25D366" />
            <Text>Other Options</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(
                'https://pickgo.la/restaurants/main/register/3/1234'
              );
              Toast.show('Link Copied.', ToastAndroid.SHORT);
            }}
            style={{
              //   paddingLeft: '15%',
              alignItems: 'center',
              // borderWidth: 2,
              // borderColor: 'green',
              padding: 5,
              paddingVertical: 10,
              // borderRadius: 50,
              // elevation: 20,
              // backgroundColor: '#2bae6a',
              width: 100,
              height: 100,
              justifyContent: 'center',
            }}
          >
            <MaterialCommunityIcons
              name="content-copy"
              size={30}
              color="#2bae6a"
            />
            <Text style={{ fontSize: 12 }}>Invite Download</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `fb://send?text=Hello please download this app Pickgo and get exciting experience it is really easy to use this app. https://pickgo.la/restaurants/main/register_business/3/7766776. Please use my invite code.`
                )
                  .then(() => console.log('facebook opened.'))
                  .catch(() => alert('Please install facebook.'))
              }
              style={screenStyles.buttonStyle}
            >
              <Entypo name="facebook" size={30} color="#4267B2" />
              <Text>Facebook Invite</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `fb-messenger://user-thread?text=Hello please download this app Pickgo and get exciting experience it is really easy to use this app. https://pickgo.la/restaurants/main/register_business/3/7766776. Please use my invite code.`
                )
                  .then(() => console.log('Messenger opened.'))
                  .catch(() => alert('Please install messenger app.'))
              }
              style={screenStyles.buttonStyle}
            >
              <Fontisto name="messenger" size={30} color="#006AFF" />
              <Text>Messenger Invite</Text>
            </TouchableOpacity> */}
        </View>
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
          {/* <View
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
              <TouchableOpacity
                onPress={() => navigate('Promotions', {})}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ fontSize: 18, marginLeft: 10 }}>
                  Become Sale Representative
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
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
              onPress={() => {
                Clipboard.setString(
                  'https://pickgo.la/restaurants/main/register_business/3/7766776'
                );
                Toast.show('Link Copied.', ToastAndroid.SHORT);
              }}
              style={{
                //   paddingLeft: '15%',
                alignItems: 'center',
                // borderWidth: 2,
                // borderColor: 'green',
                padding: 5,
                paddingVertical: 10,
                // borderRadius: 50,
                // elevation: 20,
                // backgroundColor: '#2bae6a',
                width: 100,
                height: 100,
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons
                name="content-copy"
                size={30}
                color="#2bae6a"
              />
              <Text style={{ fontSize: 12 }}>Sale</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(
                  'https://pickgo.la/restaurants/main/register/3/1234'
                );
                Toast.show('Link Copied.', ToastAndroid.SHORT);
              }}
              style={{
                //   paddingLeft: '15%',
                alignItems: 'center',
                // borderWidth: 2,
                // borderColor: 'green',
                padding: 5,
                paddingVertical: 10,
                // borderRadius: 50,
                // elevation: 20,
                // backgroundColor: '#2bae6a',
                width: 100,
                height: 100,
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons
                name="content-copy"
                size={30}
                color="#2bae6a"
              />
              <Text style={{ fontSize: 12 }}>Invite Team</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(
                  'https://pickgo.la/restaurants/main/register/3/1234'
                );
                Toast.show('Link Copied.', ToastAndroid.SHORT);
              }}
              style={{
                //   paddingLeft: '15%',
                alignItems: 'center',
                // borderWidth: 2,
                // borderColor: 'green',
                padding: 5,
                paddingVertical: 10,
                // borderRadius: 50,
                // elevation: 20,
                // backgroundColor: '#2bae6a',
                width: 100,
                height: 100,
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons
                name="content-copy"
                size={30}
                color="#2bae6a"
              />
              <Text style={{ fontSize: 12 }}>Invite Download</Text>
            </TouchableOpacity>
          </View> */}
          {/* <View
            style={{
              padding: 10,
              width: '100%',
              // flexDirection: 'row',
              // alignItems: 'center',
              marginTop: 20,
            }}
          >
            <Text style={{ fontSize: 12 }}>Sale Link:</Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  'https://pickgo.la/restaurants/main/register_business/3/7766776'
                )
              }
            >
              <Text
                style={{
                  fontSize: 12,
                  color: 'blue',
                  // marginLeft: 15,
                  textDecorationLine: 'underline',
                  width: '100%',
                }}
              >
                https://pickgo.la/restaurants/main/register_business/3/7766776
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              padding: 10,
              width: '100%',
              // flexDirection: 'row',
              // alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 12, marginTop: 10 }}>
              Invitation Team Link:
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  'https://pickgo.la/restaurants/main/register/3/1234'
                )
              }
            >
              <Text
                style={{
                  fontSize: 12,
                  color: 'blue',
                  // marginLeft: 15,
                  textDecorationLine: 'underline',
                  width: '100%',
                }}
              >
                https://pickgo.la/restaurants/main/register/3/1234
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              padding: 10,
              width: '100%',
              // flexDirection: 'row',
              paddingBottom: 50,
            }}
          >
            <Text style={{ fontSize: 12, marginTop: 10 }}>
              Invitation Download Link:
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  'https://pickgo.la/restaurants/main/register/3/1234'
                )
              }
            >
              <Text
                style={{
                  fontSize: 12,
                  color: 'blue',
                  // marginLeft: 5,
                  textDecorationLine: 'underline',
                  width: '100%',
                }}
              >
                https://pickgo.la/restaurants/main/register/3/1234
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const screenStyles = StyleSheet.create({
  buttonStyle: {
    paddingVertical: 20,
    width: '33.33%',
    justifyContent: 'center',
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
})(InviteTeamScreen);
