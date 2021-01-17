import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { headerOptions, rightMenu } from '../styles/header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  loadOrder,
  setTips,
  confirm,
  setOrderState,
  customerEnterSubtotal,
  cancelOrderByCustomer,
  onepay,
} from '../store/orderActions';
import CheckBox from '@react-native-community/checkbox';
import {
  enterNewCard,
  updateCard,
  callAServer,
  cashNotify,
  i18n,
  i18nT,
} from '../store/appActions';
import styles from '../styles/home';
import { RaisedTextButton } from 'react-native-material-buttons';
import CurrFormat from '../components/currency-format';
import {
  CreditCardInput,
  LiteCreditCardInput,
} from 'react-native-credit-card-input';
import CartInfo from '../components/cart-info';
import EnterSubtotal from '../components/enter-subtotal';
import { Icon } from 'react-native-elements';

const ErrorScreen = ({
  message,
  i18nT,
  navigate,
  onBackPress,
  onChangeMethod,
}) => {
  return (
    <View style={styles.mainView}>
      <Text style={{ textAlign: 'center' }}>{message}</Text>

      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <RaisedTextButton
          onPress={onBackPress}
          title={i18nT('detail.back_to_order_button')}
          style={{ flexGrow: 1, marginBottom: 20 }}
        />
        {/*
        <RaisedTextButton
          onPress={() => navigate('Wallet')}
          title={i18nT('detail.check_your_wallet')}
          style={{flexGrow: 1, marginBottom: 20}}
        />
        */}
        <RaisedTextButton
          onPress={onChangeMethod}
          title={i18nT('detail.change_payment_method_button')}
          style={{ flexGrow: 1 }}
          color="#27ae60"
          titleColor="#ffffff"
        />
      </View>
    </View>
  );
};

class OrderDetail extends Component {
  static navigationOptions = {
    ...headerOptions,
    title: i18n.t('detail.title'),
    headerRight: rightMenu,
  };

  constructor(props) {
    super(props);

    this.state = {
      newCard: {},
      termsAndConditions: true,
    };
  }

  componentDidMount() {
    const { loadOrder, navigation } = this.props;
    loadOrder(navigation.getParam('item').id);
  }

  cardChange = (card) => {
    this.setState({ newCard: card });
  };

  render() {
    const {
      order,
      app,
      enterNewCard,
      updateCard,
      setTips,
      confirm,
      callAServer,
      cashNotify,
      i18nT,
      setOrderState,
      customerEnterSubtotal,
      loadOrder,
      cancelOrderByCustomer,
      onepay,
    } = this.props;
    const { navigate } = this.props.navigation;
    const canBeCanceled =
      order && order.item && order.item.type == 3 && order.item.tbl_id == -1;
    return (
      <Fragment>
        {order.isDetailLoading && (
          <View style={styles.mainView}>
            <ActivityIndicator size="large" color="#27ae60" />
          </View>
        )}

        {order.hasError && (
          <ErrorScreen
            message={order.errorMessage}
            navigate={navigate}
            i18nT={i18nT}
            onBackPress={() => setOrderState({ hasError: false })}
            onChangeMethod={() =>
              navigate('Checkout', {
                table: order.table,
                enter_new_card: true,
                company_id: null,
              })
            }
          />
        )}

        {!order.isDetailLoading &&
          !order.hasError &&
          order.item &&
          order.company && (
            <KeyboardAwareScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              enableOnAndroid={true}
            >
              <View style={styles.detailView}>
                <Text style={styles.header}>{order.company.name}</Text>
                {order.company.location && (
                  <Text>{order.company.location}</Text>
                )}

                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {i18nT('detail.order')}: #{order.item.c_oid}
                  </Text>
                  {order.isPending && (
                    <Text style={styles.tableCell2}>
                      i18nT('detail.pending')
                    </Text>
                  )}
                  {order.isProcessing && (
                    <Text style={styles.tableCell2}>
                      {order.isWaitingServer
                        ? i18nT('detail.waiting_for_server')
                        : i18nT('detail.processing')}
                    </Text>
                  )}
                  {order.isPaid && (
                    <Text style={styles.tableCell2}>
                      {i18nT('detail.paid')}
                    </Text>
                  )}
                </View>

                {order.table && (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>
                      {i18nT('detail.table')}: {order.table.name}
                    </Text>
                  </View>
                )}

                {order.card && !order.isPaid && (
                  <View style={{ ...styles.tableRow }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 20,
                      }}
                      onPress={() => {
                        navigate('Checkout', {
                          company_id: order.company.id,
                          table: null,
                          enter_new_card: true,
                        });
                      }}
                    >
                      {app.user_info && (
                        <Text style={styles.tableCell}>
                          {app.user_info.first_name} {app.user_info.last_name}
                        </Text>
                      )}
                      {order.card.type != 'cash' && (
                        <Text style={styles.tableCell2}>
                          {/* hide type for now order.card.type */} XXXX XXXX
                          XXXX {order.card.card_number}
                        </Text>
                      )}
                      {order.card.type == 'cash' && (
                        <Text style={styles.tableCell2}>
                          {i18nT('detail.pay_by_cash')}
                        </Text>
                      )}

                      <Icon
                        name="pencil"
                        type="font-awesome"
                        color="red"
                        containerStyle={{ marginLeft: 15 }}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {order.isNeedEnterCard ? (
                  <Fragment>
                    {!app.isStripeLoading ? (
                      <View style={{ marginTop: 20 }}>
                        <CreditCardInput
                          placeholders={{
                            number: '1234 1234 1234 1234',
                            expiry: 'MM/YY',
                            cvc: 'CVC',
                          }}
                          requiresPostalCode={true}
                          onChange={this.cardChange}
                          validatePostalCode={(code) =>
                            code.length == 5 || code.length == 6
                              ? 'valid'
                              : 'invalid'
                          }
                        />
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
                            title="Cancel"
                            style={{ flexGrow: 1, marginRight: 5 }}
                            disabled={!(app.card && app.card.id)}
                          />
                          <RaisedTextButton
                            onPress={() => updateCard(this.state.newCard)}
                            title="Done"
                            disabled={!this.state.newCard.valid}
                            style={{ flexGrow: 1, marginLeft: 5 }}
                            color="#27ae60"
                            titleColor="#ffffff"
                          />
                        </View>
                      </View>
                    ) : (
                      <ActivityIndicator
                        style={{ flex: 10 }}
                        size="large"
                        color="#27ae60"
                      />
                    )}
                  </Fragment>
                ) : (
                  <Fragment>
                    {order.tips && !order.isPaid && !order.isWaitingServer ? (
                      <Fragment>
                        <Text style={{ ...styles.header2, marginTop: 20 }}>
                          {i18nT('detail.choose_tip')}
                        </Text>

                        <View style={styles.tipsView}>
                          <RaisedTextButton
                            title="None"
                            style={styles.tipsViewItem}
                            onPress={() => {
                              setTips(0);
                            }}
                            {...(order.tipsSelected == 0
                              ? {
                                  color: '#27ae60',
                                  titleColor: '#ffffff',
                                }
                              : {})}
                          />
                          {['t1', 't2', 't3', 't4', 't5', 't6'].map((key) => {
                            let props = {
                              key: key,
                              title:
                                order.item.tips_type == 1
                                  ? order.tips[key] + '%'
                                  : '$' + order.tips[key],
                              style: styles.tipsViewItem,
                              onPress: () => {
                                setTips(order.tips[key]);
                              },
                            };
                            if (order.tipsSelected == order.tips[key]) {
                              props.color = '#27ae60';
                              props.titleColor = '#ffffff';
                            }
                            return <RaisedTextButton {...props} />;
                          })}
                        </View>
                      </Fragment>
                    ) : null}

                    {order.isTipsLoading ? (
                      <View style={{ margin: 50 }}>
                        <ActivityIndicator size={24} color="#27ae60" />
                      </View>
                    ) : (
                      <Fragment>
                        {order.summary && order.summary.subtotal > 0 && (
                          <View style={styles.itemMargin}>
                            <CartInfo items={order.cartItems} />

                            <Text style={{ ...styles.header2, marginTop: 20 }}>
                              {i18nT('detail.title')}
                            </Text>
                            <View
                              style={{
                                ...styles.tableRow,
                                backgroundColor: '#f8f8f8',
                              }}
                            >
                              <Text style={styles.tableCell}>
                                {i18nT('checkout.subtotal')}
                              </Text>
                              <CurrFormat
                                value={order.summary.subtotal / 100}
                              />
                            </View>
                            <View
                              style={{
                                ...styles.tableRow,
                                backgroundColor: '#eeeeee',
                                marginBottom: 20,
                              }}
                            >
                              <Text style={styles.tableCell}>
                                {i18nT('checkout.discount')}
                              </Text>
                              <CurrFormat
                                value={order.summary.discount / 100}
                              />
                            </View>

                            <View
                              style={{
                                ...styles.tableRow,
                                backgroundColor: '#eeeeee',
                              }}
                            >
                              <Text style={styles.tableCell}>
                                {i18nT('checkout.new_subtotal')}
                              </Text>
                              <CurrFormat
                                value={order.summary.discount_total / 100}
                              />
                            </View>
                            <View
                              style={{
                                ...styles.tableRow,
                                backgroundColor: '#f8f8f8',
                              }}
                            >
                              <Text style={styles.tableCell}>
                                {i18nT('checkout.tax')}
                              </Text>
                              <CurrFormat value={order.summary.tax / 100} />
                            </View>
                            <View
                              style={{
                                ...styles.tableRow,
                                backgroundColor: '#eeeeee',
                              }}
                            >
                              <Text style={styles.tableCell}>
                                {i18nT('checkout.tips')}
                              </Text>
                              <CurrFormat value={order.summary.tips / 100} />
                            </View>
                            <View
                              style={{
                                ...styles.tableRow,
                                backgroundColor: '#f8f8f8',
                              }}
                            >
                              <Text style={styles.tableCell}>
                                {i18nT('detail.order_total')}
                              </Text>
                              <CurrFormat value={order.summary.total / 100} />
                            </View>
                          </View>
                        )}

                        {!order.showEditPayment &&
                          !order.isPaid &&
                          order.company &&
                          order.company.app_enter_subtotal > 0 && (
                            <RaisedTextButton
                              title={i18nT('detail.edit_payment_button')}
                              style={styles.editPaymentButton}
                              onPress={() => {
                                setOrderState({ showEditPayment: true });
                              }}
                            />
                          )}

                        {order.showEditPayment &&
                          !order.isPaid &&
                          order.company &&
                          order.company.app_enter_subtotal > 0 && (
                            <EnterSubtotal
                              i18nT={i18nT}
                              onConfirm={(values) => {
                                customerEnterSubtotal(
                                  order.item.id,
                                  values.amount
                                ).then(() => {
                                  loadOrder(order.item.id);
                                });
                              }}
                            />
                          )}

                        {!order.isPaid &&
                          order.summary &&
                          order.summary.subtotal > 0 && (
                            <Fragment>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginBottom: 10,
                                }}
                              >
                                <CheckBox
                                  disabled={false}
                                  boxType="square"
                                  hideBox
                                  tintColors={{
                                    true: 'green',
                                    false: '#e7e7e7',
                                  }}
                                  onAnimationType="flat"
                                  style={{
                                    height: 20,
                                    width: 20,
                                    borderWidth: 1,
                                    borderColor: '#e7e7e7',
                                    backgroundColor:
                                      Platform.OS === 'ios'
                                        ? '#0060be'
                                        : 'transparent',
                                  }}
                                  offAnimationType="flat"
                                  value={this.state.termsAndConditions}
                                  onValueChange={() =>
                                    this.setState({
                                      termsAndConditions: !this.state
                                        .termsAndConditions,
                                    })
                                  }
                                  onCheckColor="#fff"
                                />
                                <Text style={{ marginLeft: 10 }}>
                                  I am agreed for pickgo.la terms and
                                  conditions.
                                </Text>
                              </View>
                              {order.card.type == 'cash' && (
                                <Fragment>
                                  {app.confirmLoading ? (
                                    <ActivityIndicator
                                      style={{ marginBottom: 20 }}
                                    />
                                  ) : (
                                    <RaisedTextButton
                                      title={i18nT('checkout.confirm_payment')}
                                      color="#27ae60"
                                      titleColor="#ffffff"
                                      style={styles.itemMargin}
                                      disabled={order.isPayByCashLoading}
                                      onPress={() => cashNotify(order.item.id)}
                                    />
                                  )}
                                </Fragment>
                              )}
                              {/* {console.log(order.card.type)} */}
                              {order.card.type == 'onepay' && (
                                <Fragment>
                                  {app.confirmLoading ? (
                                    <ActivityIndicator
                                      style={{ marginBottom: 20 }}
                                    />
                                  ) : (
                                    <RaisedTextButton
                                      title={i18nT('checkout.confirm_payment')}
                                      color="#27ae60"
                                      titleColor="#ffffff"
                                      style={styles.itemMargin}
                                      disabled={order.isPayByCashLoading}
                                      onPress={onepay}
                                    />
                                  )}
                                </Fragment>
                              )}
                            </Fragment>
                          )}
                        {!order.isPaid &&
                          order.company.app_notifications_on == 1 && (
                            <Fragment>
                              {app.callServerLoading ? (
                                <View style={{ margin: 10 }}>
                                  <ActivityIndicator color="#27ae60" />
                                </View>
                              ) : (
                                <RaisedTextButton
                                  title={i18nT('checkout.call_server')}
                                  style={styles.itemMargin}
                                  disabled={order.isCallServerLoading}
                                  onPress={() => callAServer(order.item.id)}
                                />
                              )}
                            </Fragment>
                          )}
                        {order.isConfirmLoading && (
                          <View style={{ margin: 10 }}>
                            <ActivityIndicator color="#27ae60" />
                          </View>
                        )}
                        {canBeCanceled && (
                          <RaisedTextButton
                            title={i18nT('detail.can_be_canceled_button')}
                            style={styles.itemMargin}
                            disabled={order.cancelingLoading}
                            onPress={() =>
                              cancelOrderByCustomer(order.item.id).then(() => {
                                setOrderState({
                                  list: order.list.filter(
                                    (item) => item.id != order.item.id
                                  ),
                                });
                                navigate('List');
                              })
                            }
                          />
                        )}
                      </Fragment>
                    )}
                  </Fragment>
                )}

                <View style={{ flex: 100 }} />
              </View>
            </KeyboardAwareScrollView>
          )}
      </Fragment>
    );
  }
}

export default connect((state) => ({ order: state.order, app: state.app }), {
  loadOrder,
  enterNewCard,
  updateCard,
  setTips,
  confirm,
  callAServer,
  cashNotify,
  i18nT,
  setOrderState,
  customerEnterSubtotal,
  cancelOrderByCustomer,
  onepay,
})(OrderDetail);
