import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC2fKxzs4jdainImtxg1jSAiNPaz4lHU34",
  authDomain: "leakedbit.firebaseapp.com",
  projectId: "leakedbit",
  storageBucket: "leakedbit.appspot.com",
  messagingSenderId: "864027322451",
  appId: "1:864027322451:android:542cc359e801d64f653ea6",
};

// Initialize Firebase app, database, and storage
let app;
let auth;
let database; 
let storage; 

if (!getApps().length) {
  app = initializeApp(firebaseConfig); // Initialize the app if it doesn't exist
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  }); // Initialize Auth when the app is initialized
  database = getDatabase(app); // Initialize the Realtime Database
  storage = getStorage(app); // Initialize Firebase Storage
} else {
  app = getApp(); // Use the already initialized app
  auth = getAuth(app); // Get the already initialized Auth instance
  database = getDatabase(app); // Initialize the Realtime Database
  storage = getStorage(app); // Initialize Firebase Storage
}

export { auth, database, storage };