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
  item: {
    padding: 0,
    marginBottom: 25,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  itemHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  itemDesc: {},
  itemImage: {
    marginBottom: 10,
    width: '100%',
    height: 200,
  },
});
