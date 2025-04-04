
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFE7118xOpVpKOYqy7RskvOyLdfxNXTeE",
  authDomain: "localstopover-2373a.firebaseapp.com",
  databaseURL: "https://localstopover-2373a-default-rtdb.firebaseio.com",
  projectId: "localstopover-2373a",
  storageBucket: "localstopover-2373a.appspot.com", // Fixed the storageBucket URL
  messagingSenderId: "399492619555",
  appId: "1:399492619555:web:541b308c50c5f454d8c096"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);

// Connect to Firebase emulators in development mode
if (process.env.NODE_ENV === 'development') {
  try {
    // Uncomment these lines to use Firebase emulators during development
    // connectAuthEmulator(auth, 'http://localhost:9099');
    // connectFirestoreEmulator(firestore, 'localhost', 8080);
    // connectStorageEmulator(storage, 'localhost', 9199);
    // connectDatabaseEmulator(database, 'localhost', 9000);
    
    console.log("Development mode: Firebase initialized without emulators");
    
    // Create sample accounts for demo purposes
    console.log("Development mode: Sample accounts information:");
    console.log(" - Regular user: user@example.com / password123");
    console.log(" - Admin user: admin@example.com / admin123");
  } catch (error) {
    console.error("Error connecting to Firebase emulators:", error);
  }
}

export { app, auth, firestore, storage, database };
