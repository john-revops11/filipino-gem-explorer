
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
  storageBucket: "localstopover-2373a.appspot.com",
  messagingSenderId: "399492619555",
  appId: "1:399492619555:web:541b308c50c5f454d8c096"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);

// Create demo accounts for development mode
const createDemoAccounts = async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      console.log("Setting up demo accounts for development...");
      
      // For demo purposes only - DO NOT use in production
      // This is just to make testing easier
      const demoAccounts = [
        { email: "user@example.com", password: "password123", isAdmin: false },
        { email: "admin@example.com", password: "admin123", isAdmin: true }
      ];
      
      console.log("Development mode: Sample accounts information:");
      demoAccounts.forEach(account => {
        console.log(` - ${account.isAdmin ? "Admin" : "Regular"} user: ${account.email} / ${account.password}`);
      });
    } catch (error) {
      console.error("Error setting up demo accounts:", error);
    }
  }
};

// Call the function to set up demo accounts
createDemoAccounts();

// Connect to Firebase emulators in development mode if needed
if (process.env.NODE_ENV === 'development') {
  try {
    // Uncomment these lines to use Firebase emulators during development
    // connectAuthEmulator(auth, 'http://localhost:9099');
    // connectFirestoreEmulator(firestore, 'localhost', 8080);
    // connectStorageEmulator(storage, 'localhost', 9199);
    // connectDatabaseEmulator(database, 'localhost', 9000);
    
    console.log("Development mode: Firebase initialized without emulators");
  } catch (error) {
    console.error("Error connecting to Firebase emulators:", error);
  }
}

export { app, auth, firestore, storage, database };
