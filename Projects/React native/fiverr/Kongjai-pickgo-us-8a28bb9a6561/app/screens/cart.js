import React, { Component, Fragment, useState } from 'react';
import {
  KeyboardAvoidingView,
  View,
  SafeAreaView,
  FlatList,
  Image,
  Animated,
  AppRegistry,
  StyleSheet,
  Picker,
  Text,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
  ScrollView,
  Easing,
} from 'react-native';
import { connect } from 'react-redux';
import { headerOptions, rightMenu } from '../styles/header';
import styles from '../styles/home';
import {
  logout,
  universalQRCodeScan,
  reserveATable,
  resetQRData,
  enterNewCard,
  updateCard,
  updateCash,
  setTipNowState,
  confirmPayment,
  claimPromotion,
  setGuestsCount,
  setTips,
  checkIn,
  loadTableData,
  setDatetime,
  companyShowData,
  setAppState,
  callAServer,
  cashNotify,
  i18nT,
  i18n,
  tableViewData,
  setPaymentMethod,
} from '../store/appActions';
import {
  setTips as setTipsUpdate,
  customerEnterSubtotal,
} from '../store/orderActions';
import {
  createReservation,
  deleteReservation,
} from '../store/actions/reservations';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';

import { RaisedTextButton } from 'react-native-material-buttons';
import MaterialTabs from 'react-native-material-tabs';
import { Platform } from 'react-native';
import {
  CreditCardInput,
  LiteCreditCardInput,
} from 'react-native-credit-card-input';
import { Dropdown } from 'react-native-material-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon, List, ListItem } from 'react-native-elements';
import moment from 'moment';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import translations from '../localization/translations';
import * as Localization from 'expo-localization';
import CurrFormat from '../components/currency-format';
import CartInfo from '../components/cart-info';
import EnterSubtotal from '../components/enter-subtotal';
import SectionList from 'react-native-tabs-section-list';

const SECTIONS = [
  {
    title: 'Burgers',
    menu: Array(5)
      .fill(0)
      .map((item, index) => ({
        title: `hello${index}`,
        description: 'hello is testting',
        price: 1020,
      })),
  },
  {
    title: 'Pizza',
    data: Array(5)
      .fill(0)
      .map((item, index) => ({
        title: `hello1${index}`,
        description: 'hello is testting',
        price: 1020,
      })),
  },
  {
    title: 'Sushi and rolls',
    data: Array(10)
      .fill(0)
      .map((item, index) => ({
        title: `hello2${index}`,
        description: 'hello is testting',
        price: 1020,
      })),
  },
  {
    title: 'Salads',
    data: Array(10)
      .fill(0)
      .map((item, index) => ({
        title: `hello3${index}`,
        description: 'hello is testting',
        price: 1020,
      })),
  },
  {
    title: 'Dessert',
    data: Array(10)
      .fill(0)
      .map((item, index) => ({
        title: `hello4${index}`,
        description: 'hello is testting',
        price: 1020,
      })),
  },
];

const locale = Localization.locale.split('-')[0];
LocaleConfig.locales['lo'] = translations.lo.calendar;
LocaleConfig.locales['en'] = translations.en.calendar;
LocaleConfig.defaultLocale = Localization.locale.split('-')[0];

if (
  translations[locale] &&
  translations[locale].calendar &&
  translations[locale].calendar.monthNames
) {
  moment.updateLocale(locale, {
    months: translations[locale].calendar.monthNames,
  });
}

class _CartInfo extends Component {
  render() {
    const { app } = this.props;
    if (!app.cartItems || app.cartItems.length == 0) return null;
    console.log('here', app.cartItems);
    return (
      <View style={{ ...styles.lineDividerTop }}>
        {app.cartItems.map((item) => (
          <View key={item.id}>
            <View style={styles.menuLineView}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  X{item.qty} {item.menu_name}
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  <CurrFormat value={item.total_amount} />
                </Text>
              </View>
            </View>
            {item.options &&
              item.options.map((option) => (
                <Text
                  key={option.id}
                  style={{ marginLeft: 30, color: '#888888' }}
                >
                  {option.menu_option_item_name} -{' '}
                  <CurrFormat value={option.price} />
                </Text>
              ))}
          </View>
        ))}
      </View>
    );
  }
}

class _Summary extends Component {
  render() {
    const { app, i18nT } = this.props;
    if (!app.summary || !app.summary.subtotal) return null;
    return (
      <View style={{ marginBottom: 20 }}>
        {app.summary.discount > 0 && (
          <View style={styles.lineDividerTop}>
            <View style={styles.menuLineView}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {i18nT('checkout.subtotal')}
                </Text>
              </View>
              <View>
                <CurrFormat value={app.summary.subtotal / 100} />
              </View>
            </View>
            <View style={styles.menuLineView}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {i18nT('checkout.discount')}
                </Text>
              </View>
              <View>
                <CurrFormat value={app.summary.discount / 100} />
              </View>
            </View>
          </View>
        )}
        <View style={styles.lineDividerTop}>
          {app.summary.discount > 0 ? (
            <View style={styles.menuLineView}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {i18nT('checkout.new_subtotal')}
                </Text>
              </View>
              <View>
                <CurrFormat value={app.summary.discount_total / 100} />
              </View>
            </View>
          ) : (
            <View style={styles.menuLineView}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {i18nT('checkout.subtotal')}
                </Text>
              </View>
              <View>
                <CurrFormat value={app.summary.subtotal / 100} />
              </View>
            </View>
          )}
          <View style={styles.menuLineView}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                {i18nT('checkout.tax')}
              </Text>
            </View>
            <View>
              <CurrFormat value={app.summary.tax / 100} />
            </View>
          </View>
          <View style={styles.menuLineView}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                {i18nT('checkout.tips')}
              </Text>
            </View>
            <View>
              <CurrFormat value={app.summary.tips / 100} />
            </View>
          </View>
          <View style={styles.menuLineView}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                {i18nT('checkout.total')}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                <CurrFormat value={app.summary.total / 100} />
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

class _TipsList extends Component {
  render() {
    const { app, setTips, i18nT } = this.props;
    if (!app || !app.tips) return null;
    if (app.tipsList.length <= 0) return null;
    if (app.tip_now && false)
      return (
        <Fragment>
          <View style={{ flex: 1 }}>
            <Dropdown
              label={i18nT('checkout.tips')}
              data={app.tipsList}
              value={app.tipsSelected}
              onChangeText={(value) => setTips(value)}
            />
          </View>
        </Fragment>
      );
    return null;
  }
}

class _TipsListPayByCustomer extends Component {
  render() {
    const { app, setTipsUpdate, loadTableData } = this.props;
    if (app.tipsList.length <= 0 || app.tips === null) return null;

    return (
      <Fragment>
        <View style={{ flex: 1 }}>
          <Dropdown
            label="Tips"
            data={app.tipsList}
            value={
              (app.tips.type == 2 ? ' ₭' : ' ') +
              app.tipsSelected +
              (app.tips.type == 1 ? '% ' : ' ')
            }
            style={{ flexGrow: 1, flexBasis: '100%' }}
            onChangeText={(value) => {
              setTipsUpdate(value, app.order.id).then(() => {
                loadTableData(app.table.id);
              });
            }}
          />
        </View>

        {app.isTipsUpdating && (
          <ActivityIndicator
            style={{
              backgroundColor: 'rgba(255,255,255,0.5)',
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            size="large"
            color="#27ae60"
          />
        )}
      </Fragment>
    );
  }
}

class _PromoList extends Component {
  render() {
    const { app, claimPromotion, isPromotionLoading, i18nT } = this.props;
    if (!(app.promotions && app.promotions.length > 0)) return null;
    if (app.isPromotionLoading)
      return (
        <ActivityIndicator style={{ flex: 10 }} size="large" color="#27ae60" />
      );
    return (
      <View style={{ flex: 1 }}>
        {app.promotions.map((promotion) => {
          const hasPromo =
            promotion.userPromotion && promotion.userPromotion.id;

          if (hasPromo) {
            return (
              <View
                key={promotion.id}
                style={{ backgroundColor: '#eeeeee', padding: 5 }}
              >
                <View
                  style={{
                    textAlign: 'center',
                    backgroundColor: 'white',
                    padding: 10,
                  }}
                >
                  <Text
                    style={{ fontSize: 28, color: 'red', textAlign: 'center' }}
                  >
                    {promotion.name}
                  </Text>
                  <Text style={{ fontSize: 10, textAlign: 'center' }}>
                    {i18nT('checkout.promo_credit')}:{' '}
                    <CurrFormat value={promotion.userPromotion.credit} />
                  </Text>
                </View>
              </View>
            );
          } else {
            if (!promotion.amount || promotion.amount == 0) return null;
            return (
              <TouchableOpacity
                key={promotion.id}
                onPress={() => claimPromotion(promotion.id)}
                style={{ backgroundColor: '#eeeeee', padding: 5 }}
              >
                <View
                  style={{
                    textAlign: 'center',
                    backgroundColor: 'white',
                    padding: 10,
                  }}
                >
                  <Text
                    style={{ fontSize: 28, color: 'red', textAlign: 'center' }}
                  >
                    <CurrFormat value={promotion.amount} /> {promotion.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      marginTop: 10,
                      color: 'red',
                      textAlign: 'center',
                    }}
                  >
                    {i18nT('checkout.promo_claim')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
        })}
      </View>
    );
  }
}

class _CardData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newCard: {},
    };
  }

  render() {
    const {
      app,
      order,
      enterNewCard,
      updateCard,
      updateCash,
      i18nT,
    } = this.props;
    console.log('card', app.card);
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        {app.user_info &&
        app.user_info.first_name &&
        app.user_info.last_name ? (
          <Text style={styles.header2}>
            {app.user_info.first_name} {app.user_info.last_name}
          </Text>
        ) : null}

        {!app.enter_new_card ? (
          <Fragment>
            <TouchableOpacity
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 20,
              }}
              onPress={() => {
                enterNewCard(true);
              }}
            >
              <Text>
                {i18nT('checkout.change_payment')}:{' '}
                {app.card && (
                  <Fragment>
                    {/* hide type for now app.card.type */}
                    {app.card.type == 'card'
                      ? ' XXXX XXXX XXXX ' + app.card.card_number
                      : ''}
                  </Fragment>
                )}
              </Text>
              <Icon
                name="pencil"
                type="font-awesome"
                color="red"
                containerStyle={{ marginLeft: 15 }}
              />
              <Text style={{ color: 'red' }}>
                {' '}
                {i18nT('checkout.change_payment_button')}
              </Text>
            </TouchableOpacity>
          </Fragment>
        ) : (
          <Fragment>
            {!app.isStripeLoading ? (
              <Fragment>
                <CreditCardInput
                  placeholders={{
                    number: '1234 1234 1234 1234',
                    expiry: 'MM/YY',
                    cvc: 'CVC',
                  }}
                  requiresPostalCode={true}
                  onChange={(card) => this.setState({ newCard: card })}
                  validatePostalCode={(code) =>
                    code.length == 5 || code.length == 6 ? 'valid' : 'invalid'
                  }
                  labels={{
                    number: i18nT('checkout.card_number'),
                    expiry: i18nT('checkout.card_expiry'),
                    cvc: i18nT('checkout.card_cvc_ccv'),
                  }}
                />
                <Fragment>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <RaisedTextButton
                      onPress={() => enterNewCard(false)}
                      title={i18nT('checkout.card_cancel_button')}
                      style={{ flexGrow: 1, marginRight: 5 }}
                      disabled={!(app.card && app.card.id)}
                    />
                    <RaisedTextButton
                      onPress={() => {
                        updateCard(this.state.newCard);
                        setPaymentMethod('cash');
                      }}
                      title={i18nT('checkout.card_done_button')}
                      disabled={!this.state.newCard.valid}
                      style={{ flexGrow: 1, marginLeft: 5 }}
                      color="#27ae60"
                      titleColor="#ffffff"
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <RaisedTextButton
                      onPress={() => {
                        updateCash('cash');
                        setPaymentMethod('cash');
                      }}
                      title={i18nT('checkout.cash_button')}
                      style={{ flexGrow: 1, marginRight: 10 }}
                    />

                    {/* hide wallet button for now */}
                    <RaisedTextButton
                      onPress={() => {
                        updateCash('wallet');
                        setPaymentMethod('wallet');
                      }}
                      title={i18nT('checkout.wallet_button')}
                      style={{ flexGrow: 1 }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <RaisedTextButton
                      onPress={() => {
                        updateCash('onepay');
                        setPaymentMethod('onepay');
                      }}
                      title={i18nT('checkout.onepay_button')}
                      style={{ flexGrow: 1 }}
                    />
                  </View>
                </Fragment>
              </Fragment>
            ) : (
              <ActivityIndicator
                style={{ flex: 10 }}
                size="large"
                color="#27ae60"
              />
            )}
          </Fragment>
        )}
      </View>
    );
  }
}

class _ScanQRCode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasCameraPermission: null,
      lastScannedUrl: null,
    };
  }

  componentDidMount() {
    const { resetQRData } = this.props;
    this._requestCameraPermission();
    resetQRData();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = (result) => {
    if (result.data !== this.state.lastScannedUrl) {
      LayoutAnimation.spring();
      this.setState({ lastScannedUrl: result.data });
    }
  };

  render() {
    const {
      app,
      order,
      enterNewCard,
      updateCard,
      universalQRCodeScan,
    } = this.props;
    const { navigate } = this.props.navigation;
    const { hasCameraPermission } = this.state;
    if (app.lang) i18n.locale = app.lang;
    return (
      <Fragment>
        {hasCameraPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : hasCameraPermission === false ? (
          <Text style={{ color: '#fff' }}>
            Camera permission is not granted
          </Text>
        ) : (
          <View style={styles.cameraContainerStyle}>
            <BarCodeScanner
              onBarCodeScanned={universalQRCodeScan}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.bottomViewStyle}>
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={() => navigate('Home')}
              >
                <View style={styles.buttonViewStyle}>
                  <Text style={styles.buttonStyle}>
                    {i18n.t('checkout.home_button')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Fragment>
    );
  }
}

class _GuestsCount extends Component {
  render() {
    const { app, setGuestsCount, i18nT } = this.props;
    if (!app.guestsList) return null;
    if (app.guestsList.length <= 0) return null;
    return (
      <Dropdown
        label={i18nT('checkout.guests_party_size')}
        data={app.guestsList}
        value={app.guestsCount}
        containerStyle={styles.itemMargin}
        onChangeText={(value) => setGuestsCount(value)}
      />
    );
  }
}

class _TipNowState extends Component {
  render() {
    return null;
    const { app, setTipNowState, i18nT } = this.props;
    return (
      <View style={{ flex: 1, flexDirection: 'row', marginBottom: 20 }}>
        <RaisedTextButton
          onPress={() => setTipNowState(false)}
          title={i18nT('checkout.request_bill')}
          style={{ flexGrow: 1, marginRight: 5 }}
          color={!app.tip_now ? '#27ae60' : undefined}
          titleColor={!app.tip_now ? '#ffffff' : undefined}
        />
        <RaisedTextButton
          onPress={() => setTipNowState(true)}
          title={i18nT('checkout.with_tip')}
          style={{ flexGrow: 1, marginLeft: 5 }}
          color={app.tip_now ? '#27ae60' : undefined}
          titleColor={app.tip_now ? '#ffffff' : undefined}
        />
      </View>
    );
  }
}

class _CheckInButton extends Component {
  render() {
    const { app, checkIn, i18nT } = this.props;

    if (app.checkInLoading) return <ActivityIndicator />;
    return (
      <RaisedTextButton
        onPress={checkIn}
        title={
          app.tip_now && false
            ? i18nT('checkout.check_in_with_tip')
            : i18nT('checkout.check_in_with_bill')
        }
        style={styles.itemMargin}
        color="#27ae60"
        titleColor="#ffffff"
      />
    );
  }
}

const WaitingForServer = ({
  isDisabled,
  onCallServerPress,
  i18nT,
  callServerLoading,
  company,
}) => {
  return (
    <Fragment>
      <View style={{ flex: 1 }}>
        <Text style={styles.header2}>{i18nT('checkout.wait_for_server')}</Text>
        <Text style={styles.header2}>
          {i18nT('checkout.wait_for_server_thank')}
        </Text>
      </View>

      {callServerLoading ? (
        <View style={{ margin: 10 }}>
          <ActivityIndicator color="#27ae60" />
        </View>
      ) : (
        <Fragment>
          {company && company.app_notifications_on == 1 && (
            <RaisedTextButton
              title={i18nT('checkout.call_server')}
              color="#27ae60"
              titleColor="#ffffff"
              style={styles.itemMargin}
              disabled={isDisabled}
              onPress={onCallServerPress}
            />
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

class _ReserveATableButton extends Component {
  sum(key) {
    return this.props.app.cart.reduce(
      (a, b) => parseInt(a) + parseInt(b[key] || 0) * parseInt(b['count'] || 1),
      0
    );
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
  render() {
    const {
      app,
      reserveATable,
      createReservation,
      companyShowData,
      i18nT,
      reservations,
    } = this.props;
    console.log('cart data ', app.cart);
    const { navigate } = this.props.navigation;
    const objectMap = (obj) => Object.entries(obj).map(([k, v], i) => [k, i]);
    if (app.isMakeReservationLoading || reservations.loading)
      return (
        <ActivityIndicator style={{ flex: 10 }} size="large" color="#27ae60" />
      );

    return (
      <>
        {app.cart && (
          <>
            {console.log(
              'grouped',
              this.groupBy(app.cart, (c) => c.main),
              Object.entries(this.groupBy(app.cart, (c) => c.main))
            )}
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                Your Cart
              </Text>
            </View>
            {/* {Object.keys(this.groupBy(app.card, (c) => c.name)).map((item1) => (
              <>
                <View
                  style={{
                    width: '90%',
                    margin: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  // key={index}
                >
                  <Text>{`${item1.main} x${
                    item1.count ? item1.count : '1'
                  }`}</Text>
                  <Text>{this.sumItem('price', item1)}</Text>
                </View>
                <FlatList
                  data={item1}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        width: '90%',
                        margin: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text>{`${item.name} x${
                        item.count ? item.count : '1'
                      }`}</Text>
                      <Text>
                        {item.count
                          ? parseInt(item.price) * parseInt(item.count)
                          : item.price}
                      </Text>
                    </View>
                  )}
                />
              </>
            ))} */}
            <FlatList
              data={app.cart}
              renderItem={({ item }) => (
                <>
                  <Text>{item.main}</Text>
                  <View
                    style={{
                      width: '90%',
                      margin: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text>{`${item.name} x${
                      item.count ? item.count : '1'
                    }`}</Text>
                    <Text>
                      {item.count
                        ? parseInt(item.price) * parseInt(item.count)
                        : item.price}
                    </Text>
                  </View>
                </>
              )}
            />
            {/* <View
              style={{
                width: '90%',
                margin: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text>Total Count</Text>
              <Text>{app.cartCount}</Text>
            </View> */}
            <View
              style={{
                width: '90%',
                margin: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text>Total Amount</Text>
              <Text>{this.sum('price')}</Text>
            </View>
          </>
        )}
        <RaisedTextButton
          onPress={() => {
            if (!app.reserveNow && app.selectedDatetime) {
              createReservation().then((res) =>
                companyShowData(app.company.id)
              );
            } else {
              reserveATable().then((res) => navigate('List'));
            }
          }}
          title={i18nT('checkout.buttons.makeReservation')}
          style={styles.itemMargin}
          disabled={!app.reserveNow && !app.selectedDatetime}
          color="#27ae60"
          titleColor="#ffffff"
        />
      </>
    );
  }
}

class _ConfirmPaymentButton extends Component {
  render() {
    const { app, confirmPayment, cashNotify, i18nT } = this.props;
    if (app.confirmLoading) return <ActivityIndicator />;
    return (
      <RaisedTextButton
        onPress={() => {
          if (app.card.type == 'cash') {
            cashNotify(app.order.id);
          } else {
            confirmPayment();
          }
        }}
        title={i18nT('checkout.confirm_payment')}
        style={styles.itemMargin}
        color="#27ae60"
        titleColor="#ffffff"
      />
    );
  }
}

const ScanQRCode = connect(
  (state, dispatch) => ({ order: state.order, app: state.app }),
  { universalQRCodeScan, resetQRData }
)(_ScanQRCode);
const CardData = connect((state) => ({ order: state.order, app: state.app }), {
  enterNewCard,
  updateCard,
  updateCash,
  i18nT,
  setPaymentMethod,
})(_CardData);
const Summary = connect((state) => ({ order: state.order, app: state.app }), {
  i18nT,
})(_Summary);
const TipsList = connect((state) => ({ order: state.order, app: state.app }), {
  setTips,
  i18nT,
})(_TipsList);
const TipsListPayByCustomer = connect(
  (state) => ({ order: state.order, app: state.app }),
  { setTipsUpdate, loadTableData, i18nT }
)(_TipsListPayByCustomer);
const PromoList = connect((state) => ({ order: state.order, app: state.app }), {
  claimPromotion,
  i18nT,
})(_PromoList);
const GuestsCount = connect(
  (state) => ({ order: state.order, app: state.app }),
  { setGuestsCount, i18nT }
)(_GuestsCount);
const TipNowState = connect(
  (state) => ({ order: state.order, app: state.app }),
  { setTipNowState, i18nT }
)(_TipNowState);
const CheckInButton = connect(
  (state) => ({ order: state.order, app: state.app }),
  { checkIn, i18nT }
)(_CheckInButton);
const ReserveATableButton = connect(
  (state) => ({
    order: state.order,
    reservations: state.reservations,
    app: state.app,
  }),
  { reserveATable, createReservation, companyShowData, i18nT }
)(_ReserveATableButton);
const ConfirmPaymentButton = connect(
  (state) => ({ order: state.order, app: state.app }),
  { confirmPayment, cashNotify, i18nT }
)(_ConfirmPaymentButton);

const ReservationType = ({
  selectedDatetime,
  reserveNow,
  onSelected,
  nowButton,
  companyHours,
  offset,
  i18nT,
  setMode,
  mode,
  setTime,
  setDate,
  date,
  timeOffset,
}) => {
  console.log('reserve now ', reserveNow);
  // const [date, setDate] = useState(null);
  // const [timeOffset, setTime] = useState(null);
  // const [mode, setMode] = useState(null);

  const interval = 10; // minutes interval
  const fday = date
    ? moment(date).locale(locale).format('MMMM Do')
    : i18nT('checkout.day');
  const ftime = timeOffset
    ? moment(date)
        .startOf('day')
        .seconds(timeOffset * interval * 60)
        .format('h:mm a')
    : i18nT('checkout.time');
  const weekDay = date ? moment(date).day() + 1 : null;

  const dayHours = date
    ? companyHours.filter((item) => item.day == weekDay)
    : [];

  const timeList =
    mode == 'time' && date
      ? [...Array(parseInt((24 * 60) / interval)).keys()]
          .map((i) => {
            const item = moment(date)
              .startOf('day')
              .seconds(i * interval * 60);
            return {
              label: item.format('MMMM Do - h:mm a'),
              minutes: i * interval,
              value: i,
            };
          })
          .filter((item) => {
            var res = false;

            for (var i = 0; i < dayHours.length; i++) {
              var hours = dayHours[i];
              if (
                item.minutes >= hours.time_from_min &&
                item.minutes <= hours.time_to_min
              )
                res = true;
            }
            return res;
          })
      : [];
  console.warn(reserveNow, mode);
  return (
    <View>
      <View style={{ marginBottom: 20, flexDirection: 'row' }}>
        <RaisedTextButton
          style={{ flexGrow: 1, marginRight: 5 }}
          color={reserveNow ? '#27ae60' : '#cccccc'}
          titleColor={reserveNow ? '#ffffff' : null}
          onPress={() => {
            nowButton(true);
            setMode(null);
          }}
          title={i18nT('checkout.buttons.nowAtTheRestaurant')}
        />
        <RaisedTextButton
          style={{ flexGrow: 1, marginLeft: 5 }}
          color={reserveNow ? '#cccccc' : '#27ae60'}
          titleColor={reserveNow ? null : '#ffffff'}
          onPress={() => {
            nowButton(false);
            setMode('date');
          }}
          title={`${fday} / ${ftime}`}
        />
      </View>

      {!reserveNow && mode != null && (
        <View style={{ padding: 10 }}>
          {mode == 'date' && (
            <Calendar
              minDate={new Date()}
              maxDate={null}
              onDayPress={(day) => {
                setDate(day.dateString);
                onSelected(null);
                setTime(null);
                setMode('time');
              }}
              monthFormat={'yyyy MMMM'}
              renderArrow={(direction) => (
                <View style={{ backgroundColor: 'orange', padding: 5 }}>
                  <Text style={{ color: 'black' }}>
                    {direction == 'left' ? '<<' : '>>'}
                  </Text>
                </View>
              )}
              hideExtraDays={true}
              disableMonthChange={false}
              firstDay={1}
              hideDayNames={false}
              showWeekNumbers={false}
              onPressArrowLeft={(substractMonth) => substractMonth()}
              onPressArrowRight={(addMonth) => addMonth()}
              disableArrowLeft={false}
              disableArrowRight={false}
              disableAllTouchEventsForDisabledDays={true}
              markedDates={
                date
                  ? {
                      [moment(date).format('YYYY-MM-DD')]: {
                        selected: true,
                        marked: true,
                        selectedColor: 'blue',
                      },
                    }
                  : {}
              }
            />
          )}
          {mode == 'time' && (
            <View>
              <Dropdown
                label={i18nT('checkout.selectReservationTime')}
                data={timeList}
                itemCount={5}
                value={
                  timeOffset
                    ? moment(date)
                        .startOf('day')
                        .seconds(timeOffset * interval * 60)
                        .format('MMMM Do - h:mm a')
                    : ''
                }
                onChangeText={(item) => {
                  setTime(item);
                  var newDate = moment(date)
                    .startOf('day')
                    .seconds(item * interval * 60);
                  setDate(newDate);
                  onSelected(newDate);
                }}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const ReservationsList = ({ list, onPress, i18nT }) => {
  if (!list || list.length == 0) return null;

  return (
    <View style={{}}>
      <View style={{}}>
        <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 20 }}>
          {i18nT('checkout.reservationsTitle')}
        </Text>
      </View>
      <View>
        {list.map((item) => (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                i18nT('checkout.deleteReservation.alertTitle'),
                i18nT('checkout.deleteReservation.alertMessage'),
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'OK', onPress: () => onPress(item.id) },
                ],
                { cancelable: true }
              );
            }}
            key={item.id}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              padding: 10,
              marginBottom: 5,
            }}
          >
            <Text>{moment.utc(item.time).local().format('MM/DD hh:mm a')}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const AgreeMessage = ({ app }) => {
  const isOwnerCheckout = app.order && app.order.id ? true : false;
  var message = null;

  if (isOwnerCheckout) {
    message = i18nT('checkout.tip_customer_descr');
  } else {
    if (app.tip_now && false) {
      if (app.tips) {
        message = i18nT('checkout.agreed_to_add_tips', {
          tips:
            (app.tips.type == 2 ? '₭ ' : ' ') +
            app.tipsSelected +
            (app.tips.type == 1 ? '% ' : ' '),
        });
      } else {
        message = i18nT('checkout.agreed_to_no_tips');
      }
    } else {
      message = i18nT('checkout.tip_now_descr');
    }
  }

  if (message != null && message) {
    return (
      <View style={{ flex: 1, marginBottom: 20 }}>
        <Text>{message}</Text>
      </View>
    );
  } else {
    return null;
  }
};

class CheckoutScreen extends Component {
  static navigationOptions = {
    ...headerOptions,
    title: i18n.t('checkout.pleaseScanQrCode'),
    headerRight: rightMenu,
  };

  constructor(props) {
    super(props);

    this.state = {
      newCard: {},

      selectedTab: 0,
      menu: [],
      categories: [],
      data: [],
      items: [],
      full_categories: [],
      refreshing: false,
      mode: null,
      timeOffset: null,
      date: null,
    };
    this.scrollY = new Animated.Value(0);
  }

  componentDidMount() {
    const {
      resetQRData,
      navigation,
      setAppState,
      tableViewData,
      companyShowData,
    } = this.props;
    resetQRData();
    this._unsubscribe = navigation.addListener('willFocus', (data) => {
      if (
        data.state.params &&
        data.state.params.enter_new_card &&
        data.state.params.table
      ) {
        setAppState({ enter_new_card: true, table: data.state.params.table });
        tableViewData(data.state.params.table.id).then(() => {
          setAppState({ enter_new_card: true });
        });
      }
      if (data.state.params && data.state.params.company_id) {
        if (data.state.params.enter_new_card)
          setAppState({ enter_new_card: true });
        companyShowData(data.state.params.company_id).then(() => {
          if (data.state.params.enter_new_card)
            setAppState({ enter_new_card: true });
        });
        this.getMenu(data.state.params.company_id);
      }
    });
  }
  getMenu = (id) => {
    fetch(
      'http://restaurant-api.pickgo.la/api/company-info/menu-user?access_token=' +
        id,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then(async (response) => {
        // console.log("responseresponse");
        // console.log(response);
        if (response.success == true) {
          console.log(response.companyHoursToday.menuCourses);

          let cat_arr = [];
          let full_cat_arr = [];
          let menu_items_arr = [];
          let ind = 0;
          if (response.companyHoursToday.length > 0) {
            // this.setState({ menu: response.companyHoursToday[0].menuCourses })
            // if (this.state.menu.length > 0) {
            let updatedMenu = response.companyHoursToday[0].menuCourses.map(
              ({ menu: data, ...rest }) => ({ data, ...rest })

              // full_cat_arr.push(item.name);
              // if (item.menu.length > 0) {
              // 	cat_arr.push(item.name);
              // 	item.menu.map((itemMenu, indexMenu) => {
              // 		itemMenu.index = ind;
              // 		menu_items_arr.push(itemMenu);
              // 		ind = ind + 1;
              // 	})

              // }
            );
            console.log('menu_items_arr');
            console.log(menu_items_arr);
            this.setState({ menu: updatedMenu });
            // }
          }
          this.setState({ categories: cat_arr, full_categories: full_cat_arr });
        }
      })
      .catch((error) => {
        alert('Please Check Your Internet Connection');
        this.setState({ isLoading: false });
      });
  };
  UNSAFE_componentWillUnmount() {
    this._unsubscribe();
  }
  changeTab = (val) => {
    this.setState({ selectedTab: val });
    console.log(val);

    let category_name = this.state.full_categories[val];
    var topping_obj = this.state.menu.find(
      (task) => task.name === category_name
    );
    console.log('topping_obj.menu[0]');
    console.log(topping_obj.menu[0]);
    this.scrollToIndex(topping_obj.menu[0].index);
    //   console.log(this.state.menu[val].menu)
    //  this.setState({items : this.state.menu[val].menu})
  };
  getItemLayout = (data, index) => ({ length: 25, offset: 25 * index, index });
  scrollToIndex = (index) => {
    console.log('this');
    this.flatListRef.scrollToIndex({ animated: true, index: 11 });
  };

  setMode = (mode) => {
    this.setState({ mode });
  };

  render() {
    let headerHeight = this.scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [100, 0],
      extrapolate: 'clamp',
      easing: Easing.ease,
    });
    const {
      app,
      resetQRData,
      setDatetime,
      deleteReservation,
      companyShowData,
      setAppState,
      callAServer,
      i18nT,
      reserveATable,
      customerEnterSubtotal,
      checkIn,
    } = this.props;
    const isOwnerCheckout = app.order && app.order.id ? true : false;
    const props = this.props;
    const hasCardData = !app.enter_new_card;
    const { navigate } = this.props.navigation;

    const hasClaimedPromo =
      app.promotions &&
      app.promotions.filter((promo) => {
        return promo.userPromotion && promo.userPromotion.id;
      }).length > 0
        ? true
        : false;

    const hasOrder = app.order && app.order.id ? true : false;
    const hasSubtotal = app.summary && app.summary.subtotal ? true : false;
    const hasOrderPaid = app.hasOrderPaid;

    const hasReservations =
      app.reservations && app.reservations.length > 0 ? true : false;

    const hideReservation =
      app.company && app.company.app_hide_reservations > 0;
    return (
      <Fragment>
        <View style={{ height: '7%' }} />
        {app.loading ? (
          <View style={styles.mainView}>
            <ActivityIndicator size="large" color="#27ae60" />
          </View>
        ) : app.hasError && app.errorMessage ? (
          <Fragment>
            <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.mainView}>
                <Text style={{ ...styles.itemMargin, textAlign: 'center' }}>
                  {app.errorMessage}
                </Text>
                <RaisedTextButton
                  onPress={resetQRData}
                  title={i18nT('home.checkout')}
                  color="#27ae60"
                  titleColor="#ffffff"
                  style={styles.itemMargin}
                />
              </View>
            </KeyboardAwareScrollView>
          </Fragment>
        ) : app.table && app.table.id ? (
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
          >
            <View style={styles.mainView}>
              <Text style={styles.header}>
                {app.company.name} / {app.table.name}
              </Text>
              <Text style={styles.centerParagraph}>
                {app.company_user && app.company_user.location}
              </Text>

              {hasCardData && <PromoList />}

              {!hasOrderPaid && app.company.app_enter_subtotal > 0 && (
                <EnterSubtotal
                  i18nT={i18nT}
                  onConfirm={(values) => {
                    if (hasOrder) {
                      setAppState({ loading: true }).then(() => {
                        customerEnterSubtotal(app.order.id, values.amount).then(
                          (res) => {
                            navigate('Detail', { item: res.order });
                            setAppState({ loading: false });
                          }
                        );
                      });
                    } else {
                      setAppState({
                        subtotal: values.amount,
                        loading: true,
                      }).then(() => {
                        checkIn().then((res) => {
                          navigate('Detail', { item: res.order });
                          setAppState({ loading: false });
                        });
                      });
                    }
                  }}
                />
              )}

              {isOwnerCheckout ? (
                <Fragment>
                  {hasCardData && <CartInfo items={app.cartItems} />}
                  {hasCardData && <Summary />}
                  <CardData />
                  {hasCardData && <TipsListPayByCustomer />}
                  {hasCardData && <AgreeMessage app={app} />}
                  {hasCardData && hasSubtotal && <ConfirmPaymentButton />}
                  {hasCardData && !hasSubtotal && (
                    <WaitingForServer
                      company={app.company}
                      callServerLoading={app.callServerLoading}
                      i18nT={i18nT}
                      isDisabled={false}
                      onCallServerPress={() => {
                        callAServer(app.order && app.order.id);
                      }}
                    />
                  )}
                </Fragment>
              ) : (
                <Fragment>
                  <CardData />
                  {hasCardData && <TipNowState />}
                  {hasCardData && <GuestsCount />}
                  {hasCardData && <TipsList />}

                  {hasCardData && <AgreeMessage app={app} />}

                  {hasCardData && <CheckInButton />}
                </Fragment>
              )}
              <View style={{ flex: 2 }} />
            </View>
          </KeyboardAwareScrollView>
        ) : app.company && app.company.id ? (
          <View style={{ flex: 1 }}>
            {/* <View style={styles.mainView}> */}
            <Animated.View
              style={{
                height: headerHeight,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={styles.header}>{app.company.name}</Text>
              <Text style={styles.centerParagraph}>
                {app.company_user && app.company_user.location}
              </Text>
              <PromoList />
            </Animated.View>

            {/* <View > */}
            <View style={customStyles.container}>
              <SectionList
                scrollEventThrottle={0.3}
                sections={this.state.menu}
                keyExtractor={(item, index) => item.name}
                onScrollEndDrag={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
                  {
                    // useNativeDriver: false
                  }
                )}
                onScrollToTop={() => console.warn('top')}
                // onScrollToTop={() => console.warn("scroll to top")}
                // scrollEnabled={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                stickySectionHeadersEnabled={false}
                scrollToLocationOffset={50}
                tabBarStyle={customStyles.tabBar}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View style={customStyles.separator} />
                )}
                renderTab={({ name, isActive }) => (
                  <View
                    style={[
                      customStyles.tabContainer,
                      { borderBottomWidth: isActive ? 1 : 0 },
                    ]}
                  >
                    <Text
                      style={[
                        customStyles.tabText,
                        { color: isActive ? '#27ae60' : '#9e9e9e' },
                      ]}
                    >
                      {name}
                    </Text>
                  </View>
                )}
                renderSectionHeader={({ section }) => (
                  <View>
                    <View style={customStyles.sectionHeaderContainer} />
                    <Text style={customStyles.sectionHeaderText}>
                      {section.name}
                    </Text>
                  </View>
                )}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      style={customStyles.itemContainer}
                      onPress={() => navigate('ItemSelect', { data: item })}
                    >
                      <View style={{ flex: 3 }}>
                        <Text style={customStyles.itemTitle}>{item.name}</Text>
                        <Text style={customStyles.itemDescription}>
                          {item.description}
                        </Text>
                        <Text style={customStyles.itemPrice}>
                          ${item.price}
                        </Text>
                      </View>
                      {item.image && !item.image.includes('default') ? (
                        <View style={{ flex: 1 }}>
                          <Image
                            style={{ width: '100%', height: 70 }}
                            source={{
                              uri:
                                'http://pickgo.la/restaurants/uploads/' +
                                item.image,
                            }}
                            resizeMode="cover"
                          />
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                }}
                ListFooterComponent={() => (
                  <View style={{}}>
                    {hasCardData &&
                      !hasOrderPaid &&
                      app.company.app_enter_subtotal > 0 && (
                        <EnterSubtotal
                          i18nT={i18nT}
                          onConfirm={(values) => {
                            if (hasOrder) {
                              setAppState({ loading: true }).then(() => {
                                customerEnterSubtotal(
                                  app.order.id,
                                  values.amount
                                ).then((res) => {
                                  navigate('Detail', { item: res.order });
                                  setAppState({ loading: false });
                                });
                              });
                            } else {
                              setAppState({
                                subtotal: values.amount,
                                loading: true,
                              }).then(() => {
                                reserveATable().then((res) => {
                                  navigate('Detail', { item: res.order });
                                  setAppState({ loading: false });
                                });
                              });
                            }
                          }}
                        />
                      )}

                    <CardData />

                    {hasCardData && hasOrder && (
                      <WaitingForServer
                        company={app.company}
                        callServerLoading={app.callServerLoading}
                        i18nT={i18nT}
                        isDisabled={false}
                        onCallServerPress={() => {
                          callAServer(app.order && app.order.id);
                        }}
                      />
                    )}
                    {hasReservations && (
                      <ReservationsList
                        i18nT={i18nT}
                        list={app.reservations}
                        onPress={(id) =>
                          deleteReservation(id).then(() =>
                            companyShowData(app.company.id)
                          )
                        }
                      />
                    )}
                    {!hasOrder && !hasReservations && (
                      <Fragment>
                        {hasCardData && !hideReservation && <TipNowState />}
                        {hasCardData && !hideReservation && (
                          <ReservationType
                            setDate={(date) => this.setState({ date })}
                            setTime={(timeOffset) =>
                              this.setState({ timeOffset })
                            }
                            timeOffset={this.state.timeOffset}
                            date={this.state.date}
                            mode={this.state.mode}
                            setMode={this.setMode}
                            selectedDatetime={app.selectedDatetime}
                            reserveNow={app.reserveNow}
                            companyHours={app.company_hours}
                            offset={app.company_user.time_zone}
                            nowButton={(value) => {
                              setAppState({ reserveNow: value });
                            }}
                            onSelected={(selectedDatetime) => {
                              setDatetime(selectedDatetime);
                            }}
                            i18nT={i18nT}
                          />
                        )}
                        {hasCardData && !hideReservation && <GuestsCount />}
                        {hasCardData && !hideReservation && <TipsList />}
                        {hasCardData && !hideReservation && (
                          <AgreeMessage app={app} />
                        )}
                        {hasCardData && !hideReservation && (
                          <ReserveATableButton {...props} />
                        )}
                      </Fragment>
                    )}
                    <View style={{ flex: 2 }} />
                  </View>
                )}
              />
            </View>

            {/* <MaterialTabs
	  scrollable={true}
        items={this.state.categories}
        selectedIndex={this.state.selectedTab}
        onChange={(val)=> this.changeTab(val)}
        barColor="#fff"
        indicatorColor="#000"
        activeTextColor="#000"
		inactiveTextColor="#000"
      />
	<View style={{height:300}}>
	<FlatList
nestedScrollEnabled = {true}
	    ref={(ref) => { this.flatListRef = ref; }}
          keyExtractor={item => item.index}
          getItemLayout={this.getItemLayout}
	  scrollEnabled={true}
        data={this.state.items}
        renderItem={({ item, indexItems }) => (
			<TouchableOpacity key={indexItems} onPress={() => navigate('ItemSelect', {data: item}) } style={{flex:1,paddingVertical:20, borderTopColor:"#e2e2e2", borderTopWidth:1, borderBottomColor:"#e2e2e2", borderBottomWidth:1}}>
		<View style={{flexDirection:"row"}}>
			<View style={{width:"70%"}}>
				<Text style={{fontSize:18}}>{item.name}</Text>
				<Text style={{fontSize:15, color:"grey"}}>{item.description}</Text>
				<Text style={{fontSize:15, color:"grey"}}>$ {item.price}</Text>
			</View>
			<View style={{width:"30%"}}>
			{item.image ? (
				<Image style={{width:"100%", height:60, resizeMode:"cover"}} source={{uri:"https://pickgo.la/restaurants/uploads/"+item.image}}  />

			) : null}
			</View>
		</View>
	</TouchableOpacity>
        )}
      />

	</View> */}
            {/* </View> */}

            {/* </View> */}
          </View>
        ) : (
          !hasOrderPaid && <ScanQRCode navigation={props.navigation} />
        )}
      </Fragment>
    );
  }
}

export default connect((store) => ({ app: store.app }), {
  resetQRData,
  setDatetime,
  deleteReservation,
  companyShowData,
  setAppState,
  callAServer,
  i18nT,
  tableViewData,
  reserveATable,
  customerEnterSubtotal,
  checkIn,
})(CheckoutScreen);

const customStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1,
  },
  tabContainer: {
    borderBottomColor: '#27ae60',
  },
  tabText: {
    padding: 15,
    color: '#9e9e9e',
    fontSize: 18,
    fontWeight: '500',
  },
  separator: {
    height: 0.5,
    width: '96%',
    alignSelf: 'flex-end',
    backgroundColor: '#eaeaea',
  },
  sectionHeaderContainer: {
    height: 10,
    backgroundColor: '#f6f6f6',
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1,
  },
  sectionHeaderText: {
    color: '#010101',
    backgroundColor: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
    paddingTop: 25,
    paddingBottom: 5,
    paddingHorizontal: 15,
  },
  itemContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    // justifyContent: 'space-between'
  },
  itemTitle: {
    flex: 1,
    fontSize: 20,
    color: '#131313',
  },
  itemPrice: {
    fontSize: 18,
    color: '#131313',
  },
  itemDescription: {
    marginVertical: 5,
    color: '#b6b6b6',
    fontSize: 16,
  },
  itemRow: {
    // flexDirection: 'row'
  },
});
