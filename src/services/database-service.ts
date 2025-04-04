
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth, User } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, addDoc, deleteDoc, updateDoc, Firestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";
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
export interface Location {
  id?: string;
  name: string;
  region: string;
  description: string;
  image?: string;
  tags?: string[];
}

export interface Place {
  id?: string;
  name: string;
  location: string;
  location_id: string;
  description: string;
  type: string;
  image?: string;
  tags?: string[];
  rating?: number;
  price_range?: string;
  is_hidden_gem?: boolean;
  is_local_business?: boolean;
  address?: string;
  website?: string;
  contact?: string;
  amenities?: string[];
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

export interface Tour {
  id?: string;
  name: string;
  description: string;
  price_range: string;
  duration: string;
  location_id: string;
  image?: string;
  includes?: string[];
  highlights?: string[];
}

export interface Food {
  id?: string;
  name: string;
  description: string;
  location_id: string;
  price_range?: string;
  image?: string;
  ingredients?: string[];
  tags?: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
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
  image?: string;
  status?: string;
  dateRange?: string;
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
  status?: string;
  user?: any;
  destination?: any;
  activity?: any;
  date?: string;
  amount?: number;
}

export interface Business {
  id?: string;
  name: string;
  description: string;
  location_id: string;
  type: string;
  address: string;
  contact: string;
  website?: string;
  image?: string;
  hours?: string;
  is_featured?: boolean;
}

export interface HiddenGem {
  id?: string;
  name: string;
  description: string;
  location_id: string;
  image?: string;
  tags?: string[];
  submittedBy?: string;
  is_featured?: boolean;
}

export interface Event {
  id?: string;
  name: string;
  description: string;
  location_id: string;
  startDate: string;
  endDate: string;
  image?: string;
  price?: string;
  tags?: string[];
  organizer?: string;
  venue?: string;
}

// Function to get all users
const getAllUsers = async () => {
  try {
    const usersCollection = collection(db, "users");
    const userSnapshot = await getDocs(usersCollection);
    const usersList = userSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return usersList;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

// Function to delete a user
const deleteUser = async (userId: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await deleteDoc(userDocRef);
    console.log("User deleted");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Function to update a user role
const updateUserRole = async (userId: string, isAdmin: boolean) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { isAdmin });
    console.log("User role updated");
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

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

// Function to save a place
const savePlace = async (placeData: Place) => {
  try {
    if (placeData.id) {
      // Update existing place
      const placeDocRef = doc(db, "places", placeData.id);
      await updateDoc(placeDocRef, placeData);
      return placeData.id;
    } else {
      // Add new place
      return await addPlace(placeData);
    }
  } catch (error) {
    console.error("Error saving place:", error);
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

// Function to get locations
const getLocations = async (): Promise<Location[]> => {
  try {
    const locationsCollection = collection(db, "locations");
    const locationsSnapshot = await getDocs(locationsCollection);
    const locationsList = locationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Location[];
    return locationsList;
  } catch (error) {
    console.error("Error getting locations:", error);
    throw error;
  }
};

// Function to save a location
const saveLocation = async (locationData: Location) => {
  try {
    if (locationData.id) {
      // Update existing location
      const locationDocRef = doc(db, "locations", locationData.id);
      await updateDoc(locationDocRef, locationData);
      return locationData.id;
    } else {
      // Add new location
      const locationsCollection = collection(db, "locations");
      const docRef = await addDoc(locationsCollection, locationData);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error saving location:", error);
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

// Function to get all itineraries (alias)
const getAllItineraries = getItineraries;

// Function to get itineraries by user ID
const getItinerariesByUserId = async (userId: string): Promise<Itinerary[]> => {
  try {
    const itinerariesCollection = collection(db, "itineraries");
    const q = query(
      itinerariesCollection,
      where("userId_created", "==", userId)
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

// Alias for getItinerariesByUserId
const getUserItineraries = getItinerariesByUserId;

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

// Function to generate an itinerary
const generateItinerary = async (params: any): Promise<Itinerary> => {
  // This would typically be an API call to a generative AI service
  // For now, return a mock itinerary
  const mockItinerary: Itinerary = {
    name: `${params.destination} Itinerary`,
    description: `A ${params.days}-day itinerary for ${params.destination}`,
    days: params.days,
    destinations: [params.destination],
    location: { name: params.destination },
    content: "Day 1: Explore the city\nDay 2: Visit beaches\nDay 3: Mountain hiking",
    tags: ["generated", "travel"],
    userId_created: auth.currentUser?.uid || 'admin',
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: "draft",
    dateRange: `${new Date().toLocaleDateString()} - ${new Date(Date.now() + params.days * 86400000).toLocaleDateString()}`
  };
  
  return mockItinerary;
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

// Function to get all bookings (alias)
const getAllBookings = getBookings;

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

// Function to update booking status
const updateBookingStatus = async (id: string, status: string) => {
  try {
    const bookingDocRef = doc(db, "bookings", id);
    await updateDoc(bookingDocRef, { status });
    console.log("Booking status updated");
  } catch (error) {
    console.error("Error updating booking status:", error);
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

// Function to save a tour
const saveTour = async (tourData: Tour) => {
  try {
    if (tourData.id) {
      // Update existing tour
      const tourDocRef = doc(db, "tours", tourData.id);
      await updateDoc(tourDocRef, tourData);
      return tourData.id;
    } else {
      // Add new tour
      const toursCollection = collection(db, "tours");
      const docRef = await addDoc(toursCollection, tourData);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error saving tour:", error);
    throw error;
  }
};

// Function to get tours by location
const getToursByLocation = async (locationId: string): Promise<Tour[]> => {
  try {
    const toursCollection = collection(db, "tours");
    const q = query(toursCollection, where("location_id", "==", locationId));
    const tourSnapshot = await getDocs(q);
    const toursList = tourSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Tour[];
    return toursList;
  } catch (error) {
    console.error("Error getting tours by location:", error);
    throw error;
  }
};

// Function to save a food item
const saveFoodItem = async (foodData: Food) => {
  try {
    if (foodData.id) {
      // Update existing food item
      const foodDocRef = doc(db, "foods", foodData.id);
      await updateDoc(foodDocRef, foodData);
      return foodData.id;
    } else {
      // Add new food item
      const foodsCollection = collection(db, "foods");
      const docRef = await addDoc(foodsCollection, foodData);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error saving food item:", error);
    throw error;
  }
};

// Function to get food items by location
const getFoodItemsByLocation = async (locationId: string): Promise<Food[]> => {
  try {
    const foodsCollection = collection(db, "foods");
    const q = query(foodsCollection, where("location_id", "==", locationId));
    const foodSnapshot = await getDocs(q);
    const foodsList = foodSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Food[];
    return foodsList;
  } catch (error) {
    console.error("Error getting food items by location:", error);
    throw error;
  }
};

// Functions for hidden gems
const getAllHiddenGems = async (): Promise<HiddenGem[]> => {
  try {
    const hiddenGemsCollection = collection(db, "hidden_gems");
    const snapshot = await getDocs(hiddenGemsCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HiddenGem[];
  } catch (error) {
    console.error("Error getting hidden gems:", error);
    throw error;
  }
};

const addHiddenGem = async (data: HiddenGem): Promise<string> => {
  try {
    const hiddenGemsCollection = collection(db, "hidden_gems");
    const docRef = await addDoc(hiddenGemsCollection, data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding hidden gem:", error);
    throw error;
  }
};

const updateHiddenGem = async (id: string, data: Partial<HiddenGem>): Promise<void> => {
  try {
    const docRef = doc(db, "hidden_gems", id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating hidden gem:", error);
    throw error;
  }
};

const deleteHiddenGem = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "hidden_gems", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting hidden gem:", error);
    throw error;
  }
};

const updateHiddenGemFeaturedStatus = async (id: string, isFeatured: boolean): Promise<void> => {
  try {
    const docRef = doc(db, "hidden_gems", id);
    await updateDoc(docRef, { is_featured: isFeatured });
  } catch (error) {
    console.error("Error updating hidden gem featured status:", error);
    throw error;
  }
};

// Functions for businesses
const getAllBusinesses = async (): Promise<Business[]> => {
  try {
    const businessesCollection = collection(db, "businesses");
    const snapshot = await getDocs(businessesCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Business[];
  } catch (error) {
    console.error("Error getting businesses:", error);
    throw error;
  }
};

const addBusiness = async (data: Business): Promise<string> => {
  try {
    const businessesCollection = collection(db, "businesses");
    const docRef = await addDoc(businessesCollection, data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding business:", error);
    throw error;
  }
};

const updateBusiness = async (id: string, data: Partial<Business>): Promise<void> => {
  try {
    const docRef = doc(db, "businesses", id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating business:", error);
    throw error;
  }
};

const deleteBusiness = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "businesses", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting business:", error);
    throw error;
  }
};

const updateBusinessFeaturedStatus = async (id: string, isFeatured: boolean): Promise<void> => {
  try {
    const docRef = doc(db, "businesses", id);
    await updateDoc(docRef, { is_featured: isFeatured });
  } catch (error) {
    console.error("Error updating business featured status:", error);
    throw error;
  }
};

// Functions for events
const getAllEvents = async (): Promise<Event[]> => {
  try {
    const eventsCollection = collection(db, "events");
    const snapshot = await getDocs(eventsCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
  } catch (error) {
    console.error("Error getting events:", error);
    throw error;
  }
};

const addEvent = async (data: Event): Promise<string> => {
  try {
    const eventsCollection = collection(db, "events");
    const docRef = await addDoc(eventsCollection, data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

const updateEvent = async (id: string, data: Partial<Event>): Promise<void> => {
  try {
    const docRef = doc(db, "events", id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

const deleteEvent = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "events", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// Stats functions
const getUsersCount = async (): Promise<number> => {
  try {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting users count:", error);
    throw error;
  }
};

const getBookingsCount = async (): Promise<number> => {
  try {
    const bookingsCollection = collection(db, "bookings");
    const snapshot = await getDocs(bookingsCollection);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting bookings count:", error);
    throw error;
  }
};

const getDestinationsCount = async (): Promise<number> => {
  try {
    const locationsCollection = collection(db, "locations");
    const snapshot = await getDocs(locationsCollection);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting destinations count:", error);
    throw error;
  }
};

const getRecentUsers = async (limit = 5): Promise<any[]> => {
  try {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(query(usersCollection, where("createdAt", "!=", null)));
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting recent users:", error);
    throw error;
  }
};

const getRecentBookings = async (limit = 5): Promise<Booking[]> => {
  try {
    const bookingsCollection = collection(db, "bookings");
    const snapshot = await getDocs(bookingsCollection);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }) as Booking)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting recent bookings:", error);
    throw error;
  }
};

// Generate initial data for demo purposes
const generateInitialData = async () => {
  try {
    const locationsSnapshot = await getDocs(collection(db, "locations"));
    if (locationsSnapshot.empty) {
      // Add sample locations
      const locations = [
        {
          name: "Manila",
          region: "Luzon",
          description: "The capital and largest city of the Philippines.",
          image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
          tags: ["City", "Urban", "Capital"]
        },
        {
          name: "Cebu",
          region: "Visayas",
          description: "Known for its beautiful beaches and historical sites.",
          image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
          tags: ["Beach", "History", "Island"]
        },
        {
          name: "Davao",
          region: "Mindanao",
          description: "Famous for its durian fruit and Mount Apo.",
          image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
          tags: ["Nature", "Mountain", "Food"]
        }
      ];

      for (const location of locations) {
        await addDoc(collection(db, "locations"), location);
      }

      console.log("Sample locations added successfully!");
    }
  } catch (error) {
    console.error("Error generating initial data:", error);
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
  savePlace,
  uploadImage,
  getLocations,
  saveLocation,
  addItinerary,
  getItinerary,
  getItineraries,
  getAllItineraries,
  getItinerariesByUserId,
  getUserItineraries,
  updateItinerary,
  deleteItinerary,
  generateItinerary,
  addBooking,
  getBooking,
  getBookings,
  getAllBookings,
  getBookingsByUserId,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  saveTour,
  getToursByLocation,
  saveFoodItem,
  getFoodItemsByLocation,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllHiddenGems,
  addHiddenGem,
  updateHiddenGem,
  deleteHiddenGem,
  updateHiddenGemFeaturedStatus,
  getAllBusinesses,
  addBusiness,
  updateBusiness,
  deleteBusiness,
  updateBusinessFeaturedStatus,
  getAllEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  getUsersCount,
  getBookingsCount,
  getDestinationsCount,
  getRecentUsers,
  getRecentBookings,
  generateInitialData
};

export default databaseService;
