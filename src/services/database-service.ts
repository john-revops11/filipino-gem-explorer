import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize GoogleAuthProvider
const googleProvider = new GoogleAuthProvider();

// Function to sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if the user exists in the users collection
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // If the user doesn't exist, create a new document
      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        // Add any other relevant user data
      });
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Function to sign out
const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Define data types
export interface Place {
  id: string;
  name: string;
  location: string;
  description: string;
  type: string;
  image: string;
  tags: string[];
  rating?: number;
  price_range?: string;
  is_hidden_gem?: boolean;
  is_local_business?: boolean;
  opening_hours?: {
    weekday_text: string[];
  };
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface Itinerary {
  id?: string;
  name: string;
  description: string;
  days: number;
  destinations: string[];
  location: {
    name: string;
  };
  content: string;
  tags: string[];
  userId_created: string; // Changed from created_by to userId_created
  is_public: boolean;
  created_at: string;
  updated_at: string;
  createdAt: string;
}

export interface Booking {
  id?: string;
  userId: string;
  placeId: string;
  placeName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  createdAt: string;
}

// Function to add a place
const addPlace = async (placeData: Place) => {
  try {
    const placesCollection = collection(db, "places");
    const docRef = await addDoc(placesCollection, placeData);
    console.log("Place added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding place:", error);
    throw error;
  }
};

// Function to get a place by ID
const getPlace = async (id: string): Promise<Place | undefined> => {
  try {
    const placeDocRef = doc(db, "places", id);
    const placeDoc = await getDoc(placeDocRef);

    if (placeDoc.exists()) {
      return { id: placeDoc.id, ...placeDoc.data() } as Place;
    } else {
      console.log("Place not found");
      return undefined;
    }
  } catch (error) {
    console.error("Error getting place:", error);
    throw error;
  }
};

// Function to get all places
const getPlaces = async (): Promise<Place[]> => {
  try {
    const placesCollection = collection(db, "places");
    const placeSnapshot = await getDocs(placesCollection);
    const placesList = placeSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Place[];
    return placesList;
  } catch (error) {
    console.error("Error getting places:", error);
    throw error;
  }
};

// Function to get places by query
const getPlacesByQuery = async (searchQuery: string): Promise<Place[]> => {
  try {
    const placesCollection = collection(db, "places");
    const q = query(
      placesCollection,
      where("tags", "array-contains", searchQuery)
    );
    const querySnapshot = await getDocs(q);
    const placesList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Place[];
    return placesList;
  } catch (error) {
    console.error("Error getting places by query:", error);
    throw error;
  }
};

// Function to update a place
const updatePlace = async (id: string, updates: Partial<Place>) => {
  try {
    const placeDocRef = doc(db, "places", id);
    await updateDoc(placeDocRef, updates);
    console.log("Place updated");
  } catch (error) {
    console.error("Error updating place:", error);
    throw error;
  }
};

// Function to delete a place
const deletePlace = async (id: string) => {
  try {
    const placeDocRef = doc(db, "places", id);
    await deleteDoc(placeDocRef);
    console.log("Place deleted");
  } catch (error) {
    console.error("Error deleting place:", error);
    throw error;
  }
};

// Function to upload an image to Firebase Storage
const uploadImage = async (image: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, `${path}/${image.name}`);
    await uploadBytes(storageRef, image);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Function to add an itinerary
const addItinerary = async (itineraryData: Itinerary) => {
  try {
    const itinerariesCollection = collection(db, "itineraries");
    const docRef = await addDoc(itinerariesCollection, itineraryData);
    console.log("Itinerary added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding itinerary:", error);
    throw error;
  }
};

// Function to get an itinerary by ID
const getItinerary = async (id: string): Promise<Itinerary | undefined> => {
  try {
    const itineraryDocRef = doc(db, "itineraries", id);
    const itineraryDoc = await getDoc(itineraryDocRef);

    if (itineraryDoc.exists()) {
      return { id: itineraryDoc.id, ...itineraryDoc.data() } as Itinerary;
    } else {
      console.log("Itinerary not found");
      return undefined;
    }
  } catch (error) {
    console.error("Error getting itinerary:", error);
    throw error;
  }
};

// Function to get all itineraries
const getItineraries = async (): Promise<Itinerary[]> => {
  try {
    const itinerariesCollection = collection(db, "itineraries");
    const itinerarySnapshot = await getDocs(itinerariesCollection);
    const itinerariesList = itinerarySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Itinerary[];
    return itinerariesList;
  } catch (error) {
    console.error("Error getting itineraries:", error);
    throw error;
  }
};

// Function to get itineraries by user ID
const getItinerariesByUserId = async (userId: string): Promise<Itinerary[]> => {
  try {
    const itinerariesCollection = collection(db, "itineraries");
    const q = query(
      itinerariesCollection,
      where("userId_created", "==", userId) // Changed from created_by to userId_created
    );
    const querySnapshot = await getDocs(q);
    const itinerariesList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Itinerary[];
    return itinerariesList;
  } catch (error) {
    console.error("Error getting itineraries by user ID:", error);
    throw error;
  }
};

// Function to update an itinerary
const updateItinerary = async (id: string, updates: Partial<Itinerary>) => {
  try {
    const itineraryDocRef = doc(db, "itineraries", id);
    await updateDoc(itineraryDocRef, updates);
    console.log("Itinerary updated");
  } catch (error) {
    console.error("Error updating itinerary:", error);
    throw error;
  }
};

// Function to delete an itinerary
const deleteItinerary = async (id: string) => {
  try {
    const itineraryDocRef = doc(db, "itineraries", id);
    await deleteDoc(itineraryDocRef);
    console.log("Itinerary deleted");
  } catch (error) {
    console.error("Error deleting itinerary:", error);
    throw error;
  }
};

// Function to add a booking
const addBooking = async (bookingData: Booking) => {
  try {
    const bookingsCollection = collection(db, "bookings");
    const docRef = await addDoc(bookingsCollection, bookingData);
    console.log("Booking added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding booking:", error);
    throw error;
  }
};

// Function to get a booking by ID
const getBooking = async (id: string): Promise<Booking | undefined> => {
  try {
    const bookingDocRef = doc(db, "bookings", id);
    const bookingDoc = await getDoc(bookingDocRef);

    if (bookingDoc.exists()) {
      return { id: bookingDoc.id, ...bookingDoc.data() } as Booking;
    } else {
      console.log("Booking not found");
      return undefined;
    }
  } catch (error) {
    console.error("Error getting booking:", error);
    throw error;
  }
};

// Function to get all bookings
const getBookings = async (): Promise<Booking[]> => {
  try {
    const bookingsCollection = collection(db, "bookings");
    const bookingSnapshot = await getDocs(bookingsCollection);
    const bookingsList = bookingSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];
    return bookingsList;
  } catch (error) {
    console.error("Error getting bookings:", error);
    throw error;
  }
};

// Function to get bookings by user ID
const getBookingsByUserId = async (userId: string): Promise<Booking[]> => {
  try {
    const bookingsCollection = collection(db, "bookings");
    const q = query(
      bookingsCollection,
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const bookingsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];
    return bookingsList;
  } catch (error) {
    console.error("Error getting bookings by user ID:", error);
    throw error;
  }
};

// Function to update a booking
const updateBooking = async (id: string, updates: Partial<Booking>) => {
  try {
    const bookingDocRef = doc(db, "bookings", id);
    await updateDoc(bookingDocRef, updates);
    console.log("Booking updated");
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

// Function to delete a booking
const deleteBooking = async (id: string) => {
  try {
    const bookingDocRef = doc(db, "bookings", id);
    await deleteDoc(bookingDocRef);
    console.log("Booking deleted");
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};

const databaseService = {
  auth,
  db,
  storage,
  signInWithGoogle,
  signOutUser,
  addPlace,
  getPlace,
  getPlaces,
  getPlacesByQuery,
  updatePlace,
  deletePlace,
  uploadImage,
  addItinerary,
  getItinerary,
  getItineraries,
  getItinerariesByUserId,
  updateItinerary,
  deleteItinerary,
  addBooking,
  getBooking,
  getBookings,
  getBookingsByUserId,
  updateBooking,
  deleteBooking,
};

export default databaseService;
