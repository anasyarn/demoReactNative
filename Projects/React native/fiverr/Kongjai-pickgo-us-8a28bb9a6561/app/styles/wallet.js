import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 20,
  },
  containerCenter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  infoBlock: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: -10,
    marginRight: -10,
    flexWrap: 'wrap',
  },
  infoItem: {
    flexGrow: 1,
    flexBasis: '50%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    minHeight: 175,
  },
  cardHeader: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    textAlign: 'center',
  },
  cardBody: {
    margin: 10,
  },
  cartItemText: {
    textAlign: 'center',
    fontSize: 18,
  },
  cartPriceText: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  cartSubText: {
    textAlign: 'center',
    color: '#888888',
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textBlock: {
    marginTop: 30,
    marginBottom: 0,
  },
  text: {
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  buttonCard: {
    backgroundColor: '#27ae60',
    padding: 15,
    marginBottom: 20,
  },
  buttonCardText: {
    color: 'white',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
  },
  accountNumber: {
    marginBottom: 10,
    fontSize: 24,
    textAlign: 'center',
  },
  accountName: {
    marginBottom: 20,
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
  },
  amount: {
    marginBottom: 40,
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  accountQrCodeBlock: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  accountQrCode: {
    width: '65%',
    aspectRatio: 1,
  },
});
