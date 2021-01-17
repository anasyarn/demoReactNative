import React, { Component } from 'react';
import {
  View,
  Button,
  AppRegistry,
  StyleSheet,
  Text,
  Linking,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { headerOptions, rightMenu } from '../styles/header';
import styles from '../styles/home';
import {
  logout,
  setAppState,
  i18n,
  i18nT,
  updateCart,
} from '../store/appActions';
import { RaisedTextButton } from 'react-native-material-buttons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-material-dropdown';
import * as config from '../config/config';
import { CheckBox, Icon } from 'react-native-elements';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { SafeAreaView } from 'react-navigation';

var radio_props = [
  { label: 'param1', value: 0 },
  { label: 'param2', value: 1 },
];
class ItemSelect extends Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    const { loadOrder, navigation } = this.props;

    this.state = {
      item: navigation.state.params.menu,
      extras: navigation.state.params.menu.menuOptions,
      count: 1,
      cartData: [],
      res_id: this.props.navigation.state.params.cid,
      cid: this.props.navigation.state.params.cid,
      instructions: '',
    };
    this.scrollY = new Animated.Value(0);
  }
  componentDidMount() {
    // console.log('AppCart: ', this.props.app.cart);
    // console.log('this.state.item', this.state.item);
    // console.log(this.state.extras);
    // this.props.updateCart({
    //   cart: null,
    //   cartCount: 0,
    // });
  }

  checkTopping = (option_id, id) => {
    const extras = this.state.extras.slice();
    const topping_obj_index = extras.findIndex((task) => task.id === option_id);
    if (topping_obj_index > -1) {
      let topping_item_obj_index = null;
      for (
        let toi_index = 0;
        toi_index < extras[topping_obj_index].option_items.length;
        toi_index++
      ) {
        if (extras[topping_obj_index].option_items[toi_index].id === id) {
          topping_item_obj_index = toi_index;
        } else {
          extras[topping_obj_index].option_items[toi_index]['checked'] = false;
        }
      }
      if (topping_item_obj_index || topping_item_obj_index === 0) {
        if (
          extras[topping_obj_index].option_items[topping_item_obj_index][
            'checked'
          ]
        ) {
          extras[topping_obj_index].option_items[topping_item_obj_index][
            'checked'
          ] = false;
        } else {
          extras[topping_obj_index].option_items[topping_item_obj_index][
            'checked'
          ] = true;
        }
      }
      this.setState({ extras: extras });
    }
  };
  checkToppingMultiple = (option_id, id) => {
    var topping_obj = this.state.extras.find((task) => task.id === option_id);
    //   console.log("runtime_object");
    //   console.log(topping_obj);
    if (topping_obj) {
      // topping_obj.option_items.map((itemMenu, indexMenu)=>{
      // 	itemMenu['checked'] = false;
      // })
      var topping_item_obj = topping_obj.option_items.find(
        (task) => task.id === id
      );
      //   console.log('topping_item_obj');
      //   console.log(topping_item_obj);
      if (topping_item_obj && topping_item_obj.checked) {
        topping_item_obj['checked'] = false;
      } else {
        topping_item_obj['checked'] = true;
      }
      topping_item_obj.name = this.state.item.name;
      topping_item_obj.mainPrice = this.state.item.price;
      topping_item_obj.res_id = this.state.res_id;
      // console.log('topping_item_obj', topping_item_obj);
      let data = [...this.state.cartData];
      data.push(topping_item_obj);
      data = data.filter((d) => d.checked !== false);
      this.setState({
        cartData: data,
      });
      this.setState({ extras: this.state.extras });
    }
  };
  onSuccess = (e) => {};

  updateCount = (updatedCount) => {
    let { count } = this.state;
    if (updatedCount >= 1) this.setState({ count: updatedCount });
    if (updatedCount >= 1) {
      let data = [...this.state.cartData];
      data.forEach((d) => (d.count = updatedCount));
      // console.log(data);
      this.setState({ cartData: data });
    }
  };

  sum(key) {
    return this.state.cartData.reduce(
      (a, b) => parseInt(a) + parseInt(b[key] || 0),
      0
    );
  }

  handleCartUpdate() {
    try {
      console.log('got here');
      console.log('Extras: ', this.state.extras, this.state.item);
      const { item = {}, extras = [], cid = null, count = 1 } =
        this.state || {};
      const request = {
        addons: [],
        amount: item.price,
        cid: cid,
        menu_id: item.id,
        qty: count,
        // message: this.state.instructions,
      };
      let items = {},
        sum = parseInt(parseInt(item.price) * count);
      extras.map((option_obj, option_obj_index) => {
        items[`${option_obj.id}`] = [];
        option_obj.option_items.map(
          (option_item_obj, option_item_obj_index) => {
            if (option_item_obj['checked']) {
              sum += parseInt(parseInt(option_item_obj.price) * count);
              items[`${option_obj.id}`].push(option_item_obj.id);
            }
          }
        );
      });
      request.items = items;
      request.sum = sum;
      console.log('requesttt', request);
      this.props.updateCart(request).then(() => {
        this.props.navigation.pop();
      });

      // const { app } = this.props || {};
      // const { cart = [] } = app || {};
      // console.log('CartData: ', cart, this.state.res_id);
      // if (cart && cart.length > 0) {
      //   return;
      //   const cartItemIndex = cart.findIndex(
      //     (cartItem) => cartItem.res_id === this.state.res_id
      //   );
      //   if (cartItemIndex > -1) {
      //     Alert.alert(
      //       'Update Cart',
      //       'Do you want to update previous cart or make new cart?',
      //       [
      //         {
      //           text: 'Create New',
      //           onPress: () => {
      //             this.props.updateCart({
      //               cart: this.state.cartData,
      //               cartCount: this.state.count,
      //             });
      //             this.props.navigation.pop();
      //           },
      //         },
      //         {
      //           text: 'Add to Existing',
      //           onPress: () => {
      //             const cartData = [...cart, ...this.state.cartData];
      //             const count = this.props.app.cartCount + this.state.count;
      //             this.props.updateCart({
      //               cart: cartData,
      //               cartCount: count,
      //             });
      //             this.props.navigation.pop();
      //           },
      //         },
      //       ]
      //     );
      //   } else {
      //     const cartData = [...cart, ...this.state.cartData];
      //     const count = this.props.app.cartCount + this.state.count;
      //     this.props.updateCart({
      //       cart: cartData,
      //       cartCount: count,
      //     });
      //     this.props.navigation.pop();
      //   }
      // } else {
      //   console.log(
      //     'NotCartDataFound: ',
      //     this.state.cartData,
      //     this.state.count
      //   );
      //   // this.props.updateCart({
      //   //   cart: this.state.cartData,
      //   //   cartCount: count,
      //   // });
      //   // this.props.navigation.pop();
      // }

      // if (
      //   this.props.app.cart &&
      //   this.props.app.cart[0] &&
      //   this.props.app.cart[0].res_id !== this.state.res_id
      // ) {
      //   Alert.alert(
      //     'Update Cart',
      //     'Do you want to update previous cart or make new cart?',
      //     [
      //       {
      //         text: 'Create New',
      //         onPress: () => {
      //           // console.log(this.state.cartData);
      //           this.props.updateCart({
      //             cart: this.state.cartData,
      //             cartCount: this.state.count,
      //           });
      //           this.props.navigation.pop();
      //         },
      //       },
      //       {
      //         text: 'Add to Existing',
      //         onPress: () => {
      //           const data = [...this.props.app.cart];
      //           data.concat(this.state.cartData);
      //           const count = this.props.app.cartCount + this.state.count;
      //           this.props.updateCart({
      //             cart: data,
      //             cartCount: count,
      //           });
      //           this.props.navigation.pop();
      //         },
      //       },
      //     ]
      //   );
      // } else {
      //   const data = [...this.props.app.cart];
      //   data.concat(this.state.cartData);
      //   const count = this.props.app.cartCount + this.state.count;
      //   this.props.updateCart({
      //     cart: data,
      //     cartCount: count,
      //   });
      //   this.props.navigation.pop();
      // }
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { app, logout, setAppState, i18nT, updateCart } = this.props;
    let headerHeight = this.scrollY.interpolate({
      inputRange: [0, 160],
      outputRange: [0, 60],
      extrapolate: 'clamp',
      easing: Easing.ease,
    });
    let opacity = this.scrollY.interpolate({
      inputRange: [0, 30, 60],
      outputRange: [0, 0.5, 1],
    });

    const getTotal = (data) => {
      let amount = 0;
      console.log(data);
      data.forEach((d) => {
        d.option_items.forEach((i) => {
          if (i.checked) {
            console.log(i.price);
            amount = amount + parseInt(i.price);
          }
        });
      });
      console.log(amount);
      return parseInt(amount);
    };

    return (
      <View style={{ marginTop: 30, flex: 1 }}>
        <Animated.View
          style={{
            width: '100%',
            height: headerHeight,
            flexDirection: 'row',
            paddingHorizontal: 20,
            backgroundColor: 'transparent',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#f4f4f4',
            opacity: opacity,
          }}
        >
          <TouchableOpacity
            style={{ paddingHorizontal: 10, backgroundColor: '#fff' }}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image
              source={require('../../assets/arrow-back.png')}
              style={{ height: 20, width: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '95%',
            }}
          >
            <Text
              style={{ paddingHorizontal: 20, fontSize: 20, fontWeight: '700' }}
            >
              {this.state.item.name}
            </Text>
            <Text
              style={{ paddingHorizontal: 20, fontSize: 20, fontWeight: '700' }}
            >
              {this.state.item.price}
            </Text>
          </View>
        </Animated.View>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            {
              useNativeDriver: false,
            }
          )}
          bounces={false}
        >
          <View style={{ flex: 1 }}>
            <View style={{ width: '100%', height: 200 }}>
              {this.state.item.image ? (
                <Image
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                  source={{
                    uri:
                      'http://pickgo.la/restaurants/uploads/' +
                      this.state.item.image,
                  }}
                />
              ) : null}
              <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  position: 'absolute',
                  top: 10,
                  left: 10,
                }}
                onPress={() => this.props.navigation.goBack()}
              >
                <Image
                  source={require('../../assets/arrow-back.png')}
                  style={{ height: 20, width: 20 }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.mainView}>
              <View style={{ flex: 1, paddingVertical: 10 }}>
                <View style={{ width: '100%' }}>
                  <Text
                    style={{
                      paddingBottom: 10,
                      fontSize: 22,
                      fontWeight: '700',
                    }}
                  >
                    {this.state.item.name}
                  </Text>
                  <Text style={{ fontSize: 15, color: 'grey' }}>
                    {this.state.item.description}
                  </Text>
                </View>
              </View>
            </View>

            {this.state.extras.length > 0
              ? this.state.extras.map((item, index) => {
                  return (
                    <View key={index} style={{ width: '100%' }}>
                      <View
                        style={{
                          width: '100%',
                          paddingVertical: 10,
                          backgroundColor: '#f5f5f5',
                        }}
                      >
                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ width: '60%', padding: 10 }}>
                            <Text
                              style={{
                                color: '#000',
                                fontSize: 18,
                                fontWeight: 'bold',
                              }}
                            >
                              {item.title}
                            </Text>
                          </View>
                          {item.is_required == 0 ? (
                            <View style={{ width: '40%', padding: 10 }}>
                              <Text
                                style={{
                                  color: 'green',
                                  fontSize: 14,
                                  fontWeight: 'bold',
                                  textAlign: 'right',
                                }}
                              >
                                Optional
                              </Text>
                            </View>
                          ) : (
                            <View style={{ width: '40%', padding: 10 }}>
                              <Text
                                style={{
                                  color: 'green',
                                  fontSize: 14,
                                  fontWeight: 'bold',
                                  textAlign: 'right',
                                }}
                              >
                                Required
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      {item.option_items.length > 0 && item.type == 0
                        ? item.option_items.map((topping, topping_index) => {
                            return (
                              <TouchableOpacity
                                key={topping_index}
                                style={{ width: '100%' }}
                                onPress={() =>
                                  this.checkTopping(topping.oid, topping.id)
                                }
                              >
                                <View style={{ flexDirection: 'row' }}>
                                  <View style={{ width: '20%' }}>
                                    <CheckBox
                                      checked={topping.checked}
                                      onPress={() =>
                                        this.checkTopping(
                                          topping.oid,
                                          topping.id
                                        )
                                      }
                                      size={18}
                                    />
                                  </View>
                                  <View
                                    style={{ width: '60%', paddingTop: 13 }}
                                  >
                                    <Text>{topping.name}</Text>
                                  </View>
                                  <View
                                    style={{ width: '20%', paddingTop: 13 }}
                                  >
                                    <Text>₭ {topping.price}</Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            );
                          })
                        : item.option_items.map((topping, topping_index) => {
                            return (
                              <TouchableOpacity
                                key={topping_index}
                                style={{ width: '100%' }}
                                onPress={() =>
                                  // this.checkToppingMultiple(
                                  //   topping.oid,
                                  //   topping.id
                                  // )
                                  this.checkTopping(topping.oid, topping.id)
                                }
                              >
                                <View style={{ flexDirection: 'row' }}>
                                  <View style={{ width: '20%' }}>
                                    <CheckBox
                                      checked={topping.checked}
                                      onPress={() =>
                                        // this.checkToppingMultiple(
                                        //   topping.oid,
                                        //   topping.id
                                        // )
                                        this.checkTopping(
                                          topping.oid,
                                          topping.id
                                        )
                                      }
                                      size={18}
                                    />
                                  </View>
                                  <View
                                    style={{ width: '60%', paddingTop: 13 }}
                                  >
                                    <Text>{topping.name}</Text>
                                  </View>
                                  <View
                                    style={{ width: '20%', paddingTop: 13 }}
                                  >
                                    <Text>₭ {topping.price}</Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                    </View>
                  );
                })
              : null}

            <View style={{ width: '100%' }}>
              <View
                style={{
                  width: '100%',
                  paddingVertical: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: '100%',
                    padding: 10,
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <Text
                    style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}
                  >
                    Special Instructions
                  </Text>
                </View>
                <View
                  style={{
                    width: '90%',
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f5f5f5',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <TextInput
                    style={{
                      width: '100%',
                      paddingVertical: 15,
                      color: 'gray',
                    }}
                    placeholder="Any notes? You may charged for extras"
                    multiline={true}
                    onChangeText={(value) =>
                      this.setState({
                        instructions: value,
                      })
                    }
                  />
                </View>
                <View
                  style={{
                    width: '90%',
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f5f5f5',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.updateCount(this.state.count + 1)}
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: '#f5f5f5',
                      marginHorizontal: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                      {' '}
                      +{' '}
                    </Text>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 20 }}>{this.state.count}</Text>
                  <TouchableOpacity
                    onPress={() => this.updateCount(this.state.count - 1)}
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: '#f5f5f5',
                      marginHorizontal: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                      {' '}
                      -{' '}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            height: 80,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            paddingVertical: 10,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <TouchableOpacity
            onPress={() => this.handleCartUpdate()}
            style={{
              width: '90%',
              height: '80%',
              backgroundColor: '#27ae60',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 18 }}>
              Add {this.state.count} to cart{' '}
              {parseInt(this.state.item.price) +
                parseInt(getTotal(this.state.extras))}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect((store) => ({ app: store.app }), {
  logout,
  setAppState,
  i18nT,
  updateCart,
})(ItemSelect);
