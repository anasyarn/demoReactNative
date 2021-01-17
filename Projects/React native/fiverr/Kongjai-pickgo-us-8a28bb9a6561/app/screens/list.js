import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { headerOptions, rightMenu } from '../styles/header';
import CurrFormat from '../components/currency-format';
import { refreshList, loadMore, resetState } from '../store/orderActions';
import { i18n, i18nT } from '../store/appActions';

class OrderList extends Component {
  static navigationOptions = {
    ...headerOptions,
    title: i18n.t('list.title'),
    headerRight: rightMenu,
  };

  constructor(props) {
    super(props);
    this.state = {
      foodOrders: [],
      deliveryOrders: [],
      loading: false,
      fetchingAllOrders: false,
      buttonSelected: 1,
    };
  }

  componentDidMount() {
    this.fetchOrders();
  }

  fetchOrders = async () => {
    this.setState({ fetchingAllOrders: true });
    await this.fetchFoodOrders();
    await this.fetchDeliveryOrders();
    this.setState({ fetchingAllOrders: false });
  };

  fetchFoodOrders = async () => {
    try {
      this.setState({ loading: true });
      const responseFoodOrders = await fetch(
        `http://restaurant-api.pickgo.la/api/order/list-customer?access_token=${this.props.app.access_token}`
      );
      const resFoodJSON = await responseFoodOrders.json();
      if (resFoodJSON && resFoodJSON.items && resFoodJSON.items.length > 0) {
        const foodOrders = resFoodJSON.items.map((order) => ({
          ...order,
          orderType: 'food',
        }));
        const sortedFoodOrders = foodOrders.sort(
          (a, b) => parseInt(a.id) < parseInt(b.id)
        );
        this.setState({ foodOrders: sortedFoodOrders });
      } else {
        this.setState({ foodOrders: [] });
      }
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  fetchDeliveryOrders = async () => {
    try {
      this.setState({ loading: true });
      const responseDeliveryOrders = await fetch(
        `http://restaurant-api.pickgo.la/api/order/get-client-orders?access_token=${this.props.app.access_token}`
      );
      const resJSON = await responseDeliveryOrders.json();
      if (resJSON && resJSON.data && resJSON.data.length > 0) {
        const deliveryOrders = resJSON.data.map((order) => ({
          ...order,
          orderType: 'delivery',
        }));
        const sortedDeliveryOrders = deliveryOrders.sort(
          (a, b) => parseInt(a.id) < parseInt(b.id)
        );
        this.setState({ deliveryOrders: sortedDeliveryOrders });
      } else {
        this.setState({ deliveryOrders: [] });
      }
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  // 1=Pending request;
  // 2=Driver Accepted;
  // 3=Cancel;
  // 4=Pick Up & begin delivery;
  // 5=Delivery Completed

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.orderType === 'food') {
            this.props.navigation.navigate('Detail', { item: item });
          } else {
            this.props.navigation.navigate('TrackOrder', { orderInfo: item });
          }
        }}
      >
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderBottomColor: 'grey',
            borderBottomWidth: 1,
            backgroundColor:
              item.orderType === 'food'
                ? 'lightgrey'
                : item.order_status === '1'
                ? '#e2ffc7'
                : item.order_status === '2'
                ? '#fff'
                : item.order_status === '3'
                ? 'red'
                : item.order_status === '4'
                ? '#fff'
                : item.order_status === '5'
                ? 'lightgrey'
                : 'white',
          }}
        >
          {item.orderType === 'food' ? (
            <>
              <Text>
                #{item.id} ({item.c_oid})
              </Text>
              <Text style={{ fontWeight: 'bold' }}>{item.companyName}</Text>
              <Text>{item.companyLocation}</Text>
              <CurrFormat value={item.totalAmountCents / 100} />
              <Text>
                {[2, 5, 7].includes(item.type) ? 'Paid' : 'Processing'}
              </Text>
            </>
          ) : (
            <>
              <View style={{ flexDirection: 'row' }}>
                <Text>{`#${item.id}   `}</Text>
                {item.order_status === '2' || item.order_status === '4' ? (
                  <Text style={{ color: '#8a43fb' }}>Track Order</Text>
                ) : null}
              </View>
              <Text numberOfLines={1}>
                Pick up: {`${item.pickup_location}`}
              </Text>
              <Text numberOfLines={1}>
                Delivery to: {`${item.delivery_location}`}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text>Receiver: {`${item.receiver_name}   `}</Text>
                <Text>Email: {`${item.receiver_email}`}</Text>
              </View>
              <Text>{`₭ ${item.price}`}</Text>
              <Text>
                {item.order_status === '1'
                  ? 'Pending Request'
                  : item.order_status === '2'
                  ? 'Driver Accepted'
                  : item.order_status === '3'
                  ? 'Cancelled'
                  : item.order_status === '4'
                  ? 'Picked Up & Begin Delivery'
                  : item.order_status === '5'
                  ? 'Delivery Completed'
                  : ''}
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: '7%' }} />
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ buttonSelected: 1 });
            }}
          >
            <Text
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
                color: this.state.buttonSelected === 1 ? '#8a43fb' : '#000',
              }}
            >
              All Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ buttonSelected: 2 });
            }}
          >
            <Text
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
                color: this.state.buttonSelected === 2 ? '#8a43fb' : '#000',
              }}
            >
              Delivery
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={{ flex: 1 }}
          data={
            this.state.buttonSelected === 1
              ? this.state.foodOrders
              : this.state.deliveryOrders
          }
          renderItem={this.renderItem}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading || this.state.fetchingAllOrders}
              onRefresh={this.fetchOrders}
            />
          }
          keyExtractor={(item, index) => index}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {!this.state.loading && <Text>No Orders Found</Text>}
              </View>
            );
          }}
        />
      </View>
    );
  }
}

export default connect(
  (state) => ({
    orders: state.order.list.length
      ? state.order.list.map((item) => ({ key: item.id, ...item }))
      : [],
    order: state.order,
    app: state.app,
  }),
  { refreshList, loadMore, resetState, i18nT }
)(OrderList);
