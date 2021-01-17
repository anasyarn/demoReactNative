
import React, { Component } from 'react';
import { View, Button, Text } from 'react-native';
import { connect } from 'react-redux';
import styles from '../styles/home';
import CurrFormat from '../components/currency-format';

export default ({ items }) => {

	if(!items || items.length == 0) return null

	return (
		<View style={{...styles.lineDividerTop}}>
			{items.map(item =>
				<View key={item.id}>
					<View style={styles.menuLineView}>
						<View><Text style={{fontSize: 14, fontWeight: 'bold'}}>X{item.qty} {item.menu_name}</Text></View>
						<View><Text style={{fontSize: 14, fontWeight: 'bold'}}><CurrFormat value={item.total_amount} /></Text></View>
					</View>
					{item.options && item.options.map(option =>
						<Text key={option.id} style={{marginLeft: 30, color: '#888888'}}>{option.menu_option_item_name} - <CurrFormat value={option.price} /></Text>
					)}
				</View>
			)}
		</View>
	)
}
