import * as firebase from 'firebase';
import 'firebase/firestore';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAEpCcvVn-uvAhDmGucDnDZNDKvpmeiyRA',
  authDomain: 'pickgo-1498514382578.firebaseapp.com',
  databaseURL: 'https://pickgo-1498514382578.firebaseio.com',
  projectId: 'pickgo-1498514382578',
  storageBucket: 'pickgo-1498514382578.appspot.com',
  messagingSenderId: '361448633168',
  appId: '1:361448633168:web:b7fb150102239a6914b255',
  measurementId: 'G-YCL9BWZ5SC',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
