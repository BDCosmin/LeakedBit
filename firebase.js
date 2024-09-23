import { initializeApp } from "firebase/app";

// Your Firebase configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyC2fKxzs4jdainImtxg1jSAiNPaz4lHU34",
  authDomain: "leakedbit.firebaseapp.com",
  projectId: "leakedbit",
  storageBucket: "leakedbit.appspot.com",
  messagingSenderId: "864027322451",
  appId: "1:864027322451:android:542cc359e801d64f653ea6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };