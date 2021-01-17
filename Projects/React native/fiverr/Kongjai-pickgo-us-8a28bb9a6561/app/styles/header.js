
import React, { Component, Fragment } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import NavigationService from '../navigator/service';
import { connect } from 'react-redux';
import { setAppState } from "../store/appActions";

const headerOptions = {
  headerStyle: {
    backgroundColor: '#27ae60'
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerLeft: null
}

class _CheckoutButton extends React.Component {

	constructor(props) {
	  super(props);
	
	  this.onPress = this.onPress.bind(this)
	}

  onPress() {
	  const { setAppState } = this.props
    setAppState({table: {}, table_id: null, company_id: null, company: {}}).then(this.props.onPress)
  }

  render() {
    return (
			<TouchableOpacity
				onPress={this.onPress}
				style={{marginRight: 15, height: 28, width: 24, textAlign: 'center'}}
			>
				<Ionicons name="md-qr-scanner" size={28} color="white" />
			</TouchableOpacity>
    )
  }
}

const CheckoutButton = connect(state => ({ app: state.app }), { setAppState }) (_CheckoutButton);

const rightMenu = (
	<Fragment>
		<CheckoutButton onPress={() => NavigationService.navigate('Checkout', {table: null, enter_new_card: false, company_id: null})} />
		<TouchableOpacity
			onPress={() => NavigationService.navigate('Home', {})}
			style={{marginRight: 20, height: 28, width: 24, textAlign: 'center'}}
		>
			<Entypo name="menu" size={28} color="white" />
		</TouchableOpacity>
		<TouchableOpacity
			onPress={() => NavigationService.navigate('Promotions', {})}
			style={{marginRight: 20, height: 28, width: 24, textAlign: 'center'}}
		>
			<Ionicons name="md-home" size={28} color="white" />
		</TouchableOpacity>
	</Fragment>
)


export { headerOptions, rightMenu };
export default StyleSheet.create({});