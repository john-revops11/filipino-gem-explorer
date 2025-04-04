
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFE7118xOpVpKOYqy7RskvOyLdfxNXTeE",
  authDomain: "localstopover-2373a.firebaseapp.com",
  databaseURL: "https://localstopover-2373a-default-rtdb.firebaseio.com",
  projectId: "localstopover-2373a",
  storageBucket: "localstopover-2373a.firebasestorage.app",
  messagingSenderId: "399492619555",
  appId: "1:399492619555:web:541b308c50c5f454d8c096"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { app, auth, firestore, storage, database };
