import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB1Z4VWWJyvNwqWDIWyr81Cl9WLzGmUJfs",
  authDomain: "freylukaslb-355.firebaseapp.com",
  databaseURL: "https://freylukaslb-355-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "freylukaslb-355",
  storageBucket: "freylukaslb-355.appspot.com",
  messagingSenderId: "954359178812",
  appId: "1:954359178812:web:eea921428c4e11075e4539",
  measurementId: "G-N5XBK5B76V"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence : getReactNativePersistence(AsyncStorage)
});
const database = getDatabase(app);

export {app, auth, database};