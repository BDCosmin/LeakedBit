import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC2fKxzs4jdainImtxg1jSAiNPaz4lHU34",
  authDomain: "leakedbit.firebaseapp.com",
  projectId: "leakedbit",
  storageBucket: "leakedbit.appspot.com",
  messagingSenderId: "864027322451",
  appId: "1:864027322451:android:542cc359e801d64f653ea6",
};

// Initialize Firebase app, auth, and database
let app;
let auth;
let database; // Add the database variable here

if (!getApps().length) {
  app = initializeApp(firebaseConfig); // Initialize the app if it doesn't exist
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  database = getDatabase(app); // Initialize the Realtime Database
} else {
  app = getApp(); // Use the already initialized app
  auth = getAuth(app); // Get the auth instance
  database = getDatabase(app); // Initialize the Realtime Database
}

export { auth, database };