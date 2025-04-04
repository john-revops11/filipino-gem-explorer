
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth, User } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, addDoc, deleteDoc, updateDoc, Firestore, orderBy, limit, DocumentData } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { firestoreService, realtimeDbService } from "./firebase-service";
import { app, auth, firestore, storage, database } from "./firebase";

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
  location_id?: string;
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
  type?: string;
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
  userId_created: string;
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
  category?: string;
  date?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Function to get all users
const getAllUsers = async () => {
  try {
    const usersCollection = collection(firestore, "users");
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
    const userDocRef = doc(firestore, "users", userId);
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
    const userDocRef = doc(firestore, "users", userId);
    await updateDoc(userDocRef, { isAdmin });
    console.log("User role updated");
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

// Users count and recent users
const getUsersCount = async () => {
  try {
    const usersCollection = collection(firestore, "users");
    const userSnapshot = await getDocs(usersCollection);
    return userSnapshot.docs.length;
  } catch (error) {
    console.error("Error getting users count:", error);
    throw error;
  }
};

const getRecentUsers = async () => {
  try {
    const usersCollection = collection(firestore, "users");
    const q = query(usersCollection, orderBy("createdAt", "desc"), limit(5));
    const userSnapshot = await getDocs(q);
    return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting recent users:", error);
    return [];
  }
};

// Function to add a place
const addPlace = async (placeData: Place) => {
  try {
    const placesCollection = collection(firestore, "places");
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
      const placeDocRef = doc(firestore, "places", placeData.id);
      await updateDoc(placeDocRef, placeData as unknown as DocumentData);
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
    const placeDocRef = doc(firestore, "places", id);
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
    const placesCollection = collection(firestore, "places");
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
    const placesCollection = collection(firestore, "places");
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
    const placeDocRef = doc(firestore, "places", id);
    await updateDoc(placeDocRef, updates as unknown as DocumentData);
    console.log("Place updated");
  } catch (error) {
    console.error("Error updating place:", error);
    throw error;
  }
};

// Function to delete a place
const deletePlace = async (id: string) => {
  try {
    const placeDocRef = doc(firestore, "places", id);
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
    const locationsCollection = collection(firestore, "locations");
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
      const locationDocRef = doc(firestore, "locations", locationData.id);
      await updateDoc(locationDocRef, locationData as unknown as DocumentData);
      return locationData.id;
    } else {
      // Add new location
      const locationsCollection = collection(firestore, "locations");
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
    const itinerariesCollection = collection(firestore, "itineraries");
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
    const itineraryDocRef = doc(firestore, "itineraries", id);
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
    const itinerariesCollection = collection(firestore, "itineraries");
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
    const itinerariesCollection = collection(firestore, "itineraries");
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
    const itineraryDocRef = doc(firestore, "itineraries", id);
    await updateDoc(itineraryDocRef, updates as DocumentData);
    console.log("Itinerary updated");
  } catch (error) {
    console.error("Error updating itinerary:", error);
    throw error;
  }
};

// Function to delete an itinerary
const deleteItinerary = async (id: string) => {
  try {
    const itineraryDocRef = doc(firestore, "itineraries", id);
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
    const bookingsCollection = collection(firestore, "bookings");
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
    const bookingDocRef = doc(firestore, "bookings", id);
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
    const bookingsCollection = collection(firestore, "bookings");
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

// Function to get bookings count
const getBookingsCount = async (): Promise<number> => {
  try {
    const bookingsCollection = collection(firestore, "bookings");
    const bookingSnapshot = await getDocs(bookingsCollection);
    return bookingSnapshot.docs.length;
  } catch (error) {
    console.error("Error getting bookings count:", error);
    throw error;
  }
};

// Function to get recent bookings
const getRecentBookings = async (): Promise<Booking[]> => {
  try {
    const bookingsCollection = collection(firestore, "bookings");
    const q = query(bookingsCollection, orderBy("createdAt", "desc"), limit(5));
    const bookingSnapshot = await getDocs(q);
    return bookingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
  } catch (error) {
    console.error("Error getting recent bookings:", error);
    return [];
  }
};

// Function to get bookings by user ID
const getBookingsByUserId = async (userId: string): Promise<Booking[]> => {
  try {
    const bookingsCollection = collection(firestore, "bookings");
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
    const bookingDocRef = doc(firestore, "bookings", id);
    await updateDoc(bookingDocRef, updates as DocumentData);
    console.log("Booking updated");
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

// Function to update booking status
const updateBookingStatus = async (id: string, status: string) => {
  try {
    const bookingDocRef = doc(firestore, "bookings", id);
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
    const bookingDocRef = doc(firestore, "bookings", id);
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
      const tourDocRef = doc(firestore, "tours", tourData.id);
      await updateDoc(tourDocRef, tourData as unknown as DocumentData);
      return tourData.id;
    } else {
      // Add new tour
      const toursCollection = collection(firestore, "tours");
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
    const toursCollection = collection(firestore, "tours");
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
      const foodDocRef = doc(firestore, "foods", foodData.id);
      await updateDoc(foodDocRef, foodData as unknown as DocumentData);
      return foodData.id;
    } else {
      // Add new food item
      const foodsCollection = collection(firestore, "foods");
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
    const foodsCollection = collection(firestore, "foods");
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

// Function to get destinations count
const getDestinationsCount = async (): Promise<number> => {
  try {
    const locationsCollection = collection(firestore, "locations");
    const snapshot = await getDocs(locationsCollection);
    return snapshot.docs.length;
  } catch (error) {
    console.error("Error getting destinations count:", error);
    throw error;
  }
};

// Generate initial data if needed
const generateInitialData = async (): Promise<void> => {
  try {
    const locationsCollection = collection(firestore, "locations");
    const locationsSnapshot = await getDocs(locationsCollection);
    
    if (locationsSnapshot.empty) {
      // Add some sample data
      const sampleLocations = [
        {
          name: "Boracay",
          region: "Visayas",
          description: "Famous for its white sand beaches and clear blue waters.",
          image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
          tags: ["Beach", "Island", "Resort"]
        },
        {
          name: "Manila",
          region: "Luzon",
          description: "The capital city of the Philippines with a rich history.",
          image: "https://images.unsplash.com/photo-1518982380564-d132f05c8ff5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
          tags: ["City", "Urban", "Historical"]
        }
      ];
      
      for (const location of sampleLocations) {
        await addDoc(locationsCollection, location);
      }
      
      console.log("Generated initial sample data");
    }
  } catch (error) {
    console.error("Error generating initial data:", error);
  }
};

// Functions for hidden gems
const getAllHiddenGems = async (): Promise<HiddenGem[]> => {
  try {
    const hiddenGemsCollection = collection(firestore, "hidden_gems");
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
    const hiddenGemsCollection = collection(firestore, "hidden_gems");
    const docRef = await addDoc(hiddenGemsCollection, data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding hidden gem:", error);
    throw error;
  }
};

const updateHiddenGem = async (id: string, data: Partial<HiddenGem>): Promise<void> => {
  try {
    const docRef = doc(firestore, "hidden_gems", id);
    await updateDoc(docRef, data as DocumentData);
  } catch (error) {
    console.error("Error updating hidden gem:", error);
    throw error;
  }
};

const deleteHiddenGem = async (id: string): Promise<void> => {
  try {
    const docRef = doc(firestore, "hidden_gems", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting hidden gem:", error);
    throw error;
  }
};

const updateHiddenGemFeaturedStatus = async (id: string, isFeatured: boolean): Promise<void> => {
  try {
    const docRef = doc(firestore, "hidden_gems", id);
    await updateDoc(docRef, { is_featured: isFeatured });
  } catch (error) {
    console.error("Error updating hidden gem featured status:", error);
    throw error;
  }
};

// Functions for businesses
const getAllBusinesses = async (): Promise<Business[]> => {
  try {
    const businessesCollection = collection(firestore, "businesses");
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
    const businessesCollection = collection(firestore, "businesses");
    const docRef = await addDoc(businessesCollection, data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding business:", error);
    throw error;
  }
};

const updateBusiness = async (id: string, data: Partial<Business>): Promise<void> => {
  try {
    const docRef = doc(firestore, "businesses", id);
    await updateDoc(docRef, data as DocumentData);
  } catch (error) {
    console.error("Error updating business:", error);
    throw error;
  }
};

const deleteBusiness = async (id: string): Promise<void> => {
  try {
    const docRef = doc(firestore, "businesses", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting business:", error);
    throw error;
  }
};

const updateBusinessFeaturedStatus = async (id: string, isFeatured: boolean): Promise<void> => {
  try {
    const docRef = doc(firestore, "businesses", id);
    await updateDoc(docRef, { is_featured: isFeatured });
  } catch (error) {
    console.error("Error updating business featured status:", error);
    throw error;
  }
};

// Functions for events
const getAllEvents = async (): Promise<Event[]> => {
  try {
    const eventsCollection = collection(firestore, "events");
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
    const eventsCollection = collection(firestore, "events");
    const docRef = await addDoc(eventsCollection, data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

const updateEvent = async (id: string, data: Partial<Event>): Promise<void> => {
  try {
    const docRef = doc(firestore, "events", id);
    await updateDoc(docRef, data as DocumentData);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

const deleteEvent = async (id: string): Promise<void> => {
  try {
    const docRef = doc(firestore, "events", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// Export all functions and Firebase instances
export default {
  auth,
  db: firestore,
  storage,
  signInWithGoogle,
  signOutUser,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getPlace,
  getPlaces,
  getPlacesByQuery,
  savePlace,
  updatePlace,
  deletePlace,
  uploadImage,
  getLocations,
  saveLocation,
  addItinerary,
  getItinerary,
  getItineraries,
  getAllItineraries,
  getUserItineraries,
  getItinerariesByUserId,
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
  getUsersCount,
  getBookingsCount,
  getDestinationsCount,
  getRecentUsers,
  getRecentBookings,
  generateInitialData,
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
  deleteEvent
};
