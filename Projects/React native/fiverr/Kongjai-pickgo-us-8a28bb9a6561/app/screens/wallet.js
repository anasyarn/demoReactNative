import React, { Component, Fragment } from 'react';
import { View, Text, Button, ActivityIndicator, TouchableOpacity, ScrollView, Image } from 'react-native';
import { i18n, i18nT } from '../store/appActions';
import { balance, addFunds, resetState, setAmount } from '../store/actions/transactions';
import { connect } from 'react-redux';
import CurrFormat from '../components/currency-format';
import styles from '../styles/wallet';
import { headerOptions, rightMenu } from '../styles/header';
import * as config from '../config/config';

const amounts = [ 50000, 100000, 300000, 500000, 1000000, 3000000, 10000000, 30000000 ]

const WalletCard = ({ label, amount, pending, action, action_label }) => {
	console.log('pending')
	console.log(pending)
	return (
		<TouchableOpacity onPress={action}>
			<View style={styles.card}>
				<View style={styles.cardHeader}>
					<Text style={styles.cartItemText}>{label}</Text>
				</View>
				<View style={styles.cardBody}>
					<Text style={styles.cartPriceText}>
						<CurrFormat value={amount / 100} />
					</Text>
					{pending > 0 && <Text style={styles.cartSubText}><CurrFormat value={pending / 100} /></Text>}
				</View>
			</View>
		</TouchableOpacity>
	)
}

const ButtonCard = ({ amount, action }) => {
	return (
		<TouchableOpacity style={styles.buttonCard} onPress={() => { action(amount * 100) }}>
			<Text style={styles.buttonCardText}><CurrFormat value={amount} /></Text>
		</TouchableOpacity>
	)
}

const Dashboard = ({ setAmount, i18nT, transactions, onPress }) => {
	return (
		<ScrollView>
			<View style={styles.container}>
				<View style={styles.infoBlock}>
					<View style={styles.infoItem}>
						<WalletCard
							label={i18nT('wallet.balance_label')}
							action_label={i18nT('wallet.view_activities')}
							amount={transactions.balance_active}
							pending={transactions.balance_pending}
							action={onPress}
						/>
					</View>
					<View style={styles.infoItem}>
						<WalletCard
							label={i18nT('wallet.spent_label')}
							action_label={i18nT('wallet.view_order_history')}
							amount={transactions.balance_spent}
							action={onPress}
						/>
					</View>
				</View>
				<View style={styles.textBlock}>
					<Text style={styles.text}>{i18nT('wallet.promotion_message')}</Text>
				</View>
				<View style={styles.header}>
					<Text style={styles.headerText}>{i18nT('wallet.choose_amount')}</Text>
				</View>
				<View style={styles.infoBlock}>
					{amounts.map((amount, i) => <View style={styles.infoItem} key={i}>
						<ButtonCard amount={amount} action={amount => setAmount(amount)} />
					</View>)}
				</View>
			</View>
		</ScrollView>
	)
}

const Transfer = ({ description, amount, i18nT, cancel, confirm }) => {
	return (
		<ScrollView>
			<View style={styles.container}>
				<Text style={styles.description}>{i18nT('wallet.transfer_description')}</Text>
				{config.ACCOUNT_NUMBERS.map((item, i) => <View key={i}>
					<Text style={styles.accountNumber}>{item.account}</Text>
					<Text style={styles.accountName}>{i18nT(item.name)}</Text>
					<View style={styles.accountQrCodeBlock}><Image style={styles.accountQrCode} source={{ uri: item.image }} /></View>
				</View>)}
				<Text style={styles.amount}><CurrFormat value={amount / 100} /></Text>
				<View style={styles.infoBlock}>
					<View style={styles.infoItem}>
						<Button color="#888888" title={i18nT('wallet.buttons.cancel')} onPress={cancel} />
					</View>
					<View style={styles.infoItem}>
						<Button color="#27ae60" title={i18nT('wallet.buttons.confirm')} onPress={() => confirm(amount)} />
					</View>
				</View>
			</View>
		</ScrollView>
	)
}

class WalletScreen extends Component {
	static navigationOptions = {...headerOptions, title: i18n.t('home.wallet'), headerRight: rightMenu}

	componentDidMount(){
		const { addFunds, setAmount, balance, resetState } = this.props
		setAmount(0)
		resetState().then(balance)
	}

	render() {
	    const { i18nT, app, addFunds, transactions, setAmount, balance } = this.props;

	    if(transactions.loading) return <View style={styles.containerCenter}><ActivityIndicator color="#27ae60" /></View>

	    if(transactions.amount){
			return <Transfer
				i18nT={i18nT}
				amount={transactions.amount}
				cancel={() => setAmount(0)}
				confirm={amount => {
					addFunds().then(() => {
						setAmount(0)
					})
				}}
			/>
	    }else{
			return <Dashboard
				i18nT={i18nT}
				setAmount={setAmount}
				transactions={transactions}
				onPress={balance}
			/>
	    }
	}
}

export default connect(state => ({
  app: state.app,
  transactions: state.transactions
}), { i18nT, addFunds, resetState, balance, setAmount }) ( WalletScreen );

