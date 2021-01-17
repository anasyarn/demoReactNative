import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  mainView: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    paddingTop: 30,
    padding: 15,
  },
  detailView: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,
  },
  itemMargin: { marginBottom: 20 },
  textInput: { height: 15 },
  baseBgColor: { backgroundColor: '#27ae60' },
  header: {
    color: '#27ae60',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 15,
  },
  header2: {
    color: '#27ae60',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  centerParagraph: {
    textAlign: 'center',
    marginBottom: 15,
  },
  topViewStyle: {
    flex: 1,
  },

  cameraContainerStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },

  bottomViewStyle: {},

  buttonTouchable: {
    backgroundColor: '#27ae60',
    height: 50,
  },
  buttonViewStyle: {
    padding: 2,
    flexGrow: 1,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  tipsView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -3,
    marginRight: -3,
  },
  tipsViewItem: {
    flexGrow: 1,
    flexShrink: 3,
    flexBasis: 1,
    margin: 3,
  },
  tableRow: {
    flex: 1,
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    margin: 2,
  },
  editPaymentButton: {
    flexGrow: 1,
    flexShrink: 3,
    flexBasis: 1,
    margin: 3,
    marginBottom: 20,
  },
  lineDividerTop: {
    borderTopWidth: 1,
    borderTopColor: '#888888',
    marginTop: 10,
    paddingTop: 10,
  },
  menuLineView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
