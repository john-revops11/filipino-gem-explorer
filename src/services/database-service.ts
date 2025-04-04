
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  DocumentData
} from 'firebase/firestore';
import { ref, set, get, push, update, remove } from 'firebase/database';
import { firestore, database } from './firebase';

// Firestore Collections
export const COLLECTIONS = {
  DESTINATIONS: 'destinations',
  ITINERARIES: 'itineraries',
  BOOKINGS: 'bookings',
  USERS: 'users',
  REVIEWS: 'reviews',
  USER_PREFERENCES: 'userPreferences',
  CONVERSATIONS: 'aiConversations',
  LOCATIONS: 'locations',
  FOOD_ITEMS: 'food_items',
  BUSINESSES: 'businesses',
  EVENTS: 'events',
  HIDDEN_GEMS: 'hidden_gems',
  PLACES: 'places',
  TOURS: 'tours'
};

// Define data types
export type Destination = {
  id?: string;
  name: string;
  description: string;
  location: string;
  image: string;
  tags: string[];
  average_rating: number;
  total_reviews: number;
  latitude: number;
  longitude: number;
};

export type Itinerary = {
  id?: string;
  destinationId: string;
  userId: string;
  days: number;
  title: string;
  description: string;
  createdAt: any;
  // Additional properties needed by components
  name?: string;
  destinations?: string[];
  location?: any;
  content?: string;
  tags?: string[];
  image?: string;
  is_public?: boolean;
  status?: string;
  dateRange?: string;
  created_at?: string;
  updated_at?: string;
};

export type Booking = {
  id?: string;
  itineraryId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalCost: number;
  status: string;
};

export type User = {
  id?: string;
  name: string;
  email: string;
  profilePicture: string;
  interests: string[];
  travelStyle: string;
  budget: string;
};

export type Review = {
  id?: string;
  destinationId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: any;
};

export type UserPreferences = {
  id?: string;
  userId: string;
  interests: string[];
  travelStyle: string;
  budget: string;
};

export type AIConversation = {
  id?: string;
  userId: string;
  messages: { role: string; content: string }[];
  createdAt: any;
};

export type Location = {
  id?: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
  latitude?: number;
  longitude?: number;
  region?: string; // Added to fix type errors
};

export type Food = {
  id?: string;
  name: string;
  type: string;
  description: string;
  price_range: string;
  location_id: string;
  image: string;
  tags: string[];
};

// Additional types required by components
export type Business = {
  id?: string;
  name: string;
  description: string;
  location: string;
  category: string;
  image: string;
  featured?: boolean;
  phone?: string;
  website?: string;
  hours?: string;
  owner?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Event = {
  id?: string;
  name: string;
  description: string;
  location: string;
  date: string;
  image: string;
  featured?: boolean;
};

export type HiddenGem = {
  id?: string;
  name: string;
  description: string;
  location: string;
  image: string;
  featured?: boolean;
};

export type Place = {
  id?: string;
  name: string;
  description: string;
  location: string;
  image: string;
  category: string;
};

export type Tour = {
  id?: string;
  name: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  image: string;
};

// Firestore Operations
const getDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(firestore, collectionName, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

const getCollection = async (collectionName: string) => {
  const collectionRef = collection(firestore, collectionName);
  const querySnapshot = await getDocs(collectionRef);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

const queryDocuments = async (
  collectionName: string, 
  conditions: { field: string; operator: string; value: any }[] = [],
  sortBy: { field: string; direction: 'asc' | 'desc' }[] = [],
  limitTo?: number
) => {
  let collectionRef = collection(firestore, collectionName);
  let queryRef: any = collectionRef;
  
  // Apply where conditions
  conditions.forEach(condition => {
    queryRef = query(queryRef, where(condition.field, condition.operator as any, condition.value));
  });
  
  // Apply sorting
  sortBy.forEach(sort => {
    queryRef = query(queryRef, orderBy(sort.field, sort.direction));
  });
  
  // Apply limit
  if (limitTo) {
    queryRef = query(queryRef, limit(limitTo));
  }
  
  const querySnapshot = await getDocs(queryRef);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

const addDocument = async (collectionName: string, data: DocumentData) => {
  // Create a plain JavaScript object to store the data
  const plainData: Record<string, any> = {};
  
  // Only try to extract properties if data is an object
  if (data && typeof data === 'object' && data !== null) {
    // Safely copy properties from data to plainData using Object.entries
    Object.entries(Object(data)).forEach(([key, value]) => {
      plainData[key] = value;
    });
  }
  
  // Add the document with the plain data object and timestamps
  const docRef = await addDoc(collection(firestore, collectionName), {
    ...plainData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return docRef.id;
};

const updateDocument = async (collectionName: string, docId: string, data: DocumentData) => {
  // Create a plain JavaScript object to store the data
  const plainData: Record<string, any> = {};
  
  // Only try to extract properties if data is an object
  if (data && typeof data === 'object' && data !== null) {
    // Safely copy properties from data to plainData using Object.entries
    Object.entries(Object(data)).forEach(([key, value]) => {
      plainData[key] = value;
    });
  }
  
  const docRef = doc(firestore, collectionName, docId);
  
  await updateDoc(docRef, {
    ...plainData,
    updatedAt: serverTimestamp()
  });
  
  return true;
};

const deleteDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(firestore, collectionName, docId);
  await deleteDoc(docRef);
  
  return true;
};

// Realtime Database Operations
const setData = async (path: string, data: any) => {
  const dbRef = ref(database, path);
  await set(dbRef, data);
  return true;
};

const getData = async (path: string) => {
  const dbRef = ref(database, path);
  const snapshot = await get(dbRef);
  
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

const pushData = async (path: string, data: any) => {
  // Create a plain JavaScript object to store the data
  const plainData: Record<string, any> = {};
  
  // Only try to extract properties if data is an object
  if (data && typeof data === 'object' && data !== null) {
    // Safely copy properties from data to plainData using Object.entries
    Object.entries(Object(data)).forEach(([key, value]) => {
      plainData[key] = value;
    });
  }
  
  const listRef = ref(database, path);
  const newItemRef = push(listRef);
  
  await set(newItemRef, {
    ...plainData,
    timestamp: Date.now()
  });
  
  return newItemRef.key;
};

const updateData = async (path: string, data: any) => {
  const dbRef = ref(database, path);
  await update(dbRef, data);
  return true;
};

const removeData = async (path: string) => {
  const dbRef = ref(database, path);
  await remove(dbRef);
  return true;
};

// New methods for locations and food items
const saveLocation = async (location: Location) => {
  if (location.id) {
    // Update existing location
    await updateDocument(COLLECTIONS.LOCATIONS, location.id, location);
    return location.id;
  } else {
    // Create new location
    return await addDocument(COLLECTIONS.LOCATIONS, location);
  }
};

const getLocation = async (locationId: string) => {
  return await getDocument(COLLECTIONS.LOCATIONS, locationId) as Location;
};

const getLocations = async () => {
  return await getCollection(COLLECTIONS.LOCATIONS) as Location[];
};

const deleteLocation = async (locationId: string) => {
  return await deleteDocument(COLLECTIONS.LOCATIONS, locationId);
};

const saveFoodItem = async (food: Food) => {
  if (food.id) {
    // Update existing food item
    await updateDocument(COLLECTIONS.FOOD_ITEMS, food.id, food);
    return food.id;
  } else {
    // Create new food item
    return await addDocument(COLLECTIONS.FOOD_ITEMS, food);
  }
};

const getFoodItem = async (foodId: string) => {
  return await getDocument(COLLECTIONS.FOOD_ITEMS, foodId) as Food;
};

const getFoodItemsByLocation = async (locationId: string) => {
  return await queryDocuments(
    COLLECTIONS.FOOD_ITEMS,
    [{ field: 'location_id', operator: '==', value: locationId }]
  ) as Food[];
};

const deleteFoodItem = async (foodId: string) => {
  return await deleteDocument(COLLECTIONS.FOOD_ITEMS, foodId);
};

// Additional methods required by components
const getAllBookings = async () => {
  return await getCollection(COLLECTIONS.BOOKINGS) as Booking[];
};

const updateBookingStatus = async (bookingId: string, status: string) => {
  return await updateDocument(COLLECTIONS.BOOKINGS, bookingId, { status });
};

const getAllBusinesses = async () => {
  return await getCollection(COLLECTIONS.BUSINESSES) as Business[];
};

const addBusiness = async (business: Business) => {
  return await addDocument(COLLECTIONS.BUSINESSES, business);
};

const updateBusiness = async (businessId: string, business: Business) => {
  return await updateDocument(COLLECTIONS.BUSINESSES, businessId, business);
};

const deleteBusiness = async (businessId: string) => {
  return await deleteDocument(COLLECTIONS.BUSINESSES, businessId);
};

const updateBusinessFeaturedStatus = async (businessId: string, featured: boolean) => {
  return await updateDocument(COLLECTIONS.BUSINESSES, businessId, { featured });
};

const getAllEvents = async () => {
  return await getCollection(COLLECTIONS.EVENTS) as Event[];
};

const addEvent = async (event: Event) => {
  return await addDocument(COLLECTIONS.EVENTS, event);
};

const updateEvent = async (eventId: string, event: Event) => {
  return await updateDocument(COLLECTIONS.EVENTS, eventId, event);
};

const deleteEvent = async (eventId: string) => {
  return await deleteDocument(COLLECTIONS.EVENTS, eventId);
};

const getAllHiddenGems = async () => {
  return await getCollection(COLLECTIONS.HIDDEN_GEMS) as HiddenGem[];
};

const addHiddenGem = async (gem: HiddenGem) => {
  return await addDocument(COLLECTIONS.HIDDEN_GEMS, gem);
};

const updateHiddenGem = async (gemId: string, gem: HiddenGem) => {
  return await updateDocument(COLLECTIONS.HIDDEN_GEMS, gemId, gem);
};

const deleteHiddenGem = async (gemId: string) => {
  return await deleteDocument(COLLECTIONS.HIDDEN_GEMS, gemId);
};

const updateHiddenGemFeaturedStatus = async (gemId: string, featured: boolean) => {
  return await updateDocument(COLLECTIONS.HIDDEN_GEMS, gemId, { featured });
};

const getPublicItineraries = async () => {
  return await queryDocuments(
    COLLECTIONS.ITINERARIES,
    [{ field: 'is_public', operator: '==', value: true }]
  ) as Itinerary[];
};

const saveItinerary = async (itinerary: Itinerary) => {
  if (itinerary.id) {
    await updateDocument(COLLECTIONS.ITINERARIES, itinerary.id, itinerary);
    return itinerary.id;
  } else {
    return await addDocument(COLLECTIONS.ITINERARIES, itinerary);
  }
};

const getUsersCount = async () => {
  const users = await getCollection(COLLECTIONS.USERS);
  return users.length;
};

const getBookingsCount = async () => {
  const bookings = await getCollection(COLLECTIONS.BOOKINGS);
  return bookings.length;
};

const getDestinationsCount = async () => {
  const destinations = await getCollection(COLLECTIONS.DESTINATIONS);
  return destinations.length;
};

const getRecentUsers = async (count = 5) => {
  return await queryDocuments(
    COLLECTIONS.USERS,
    [],
    [{ field: 'createdAt', direction: 'desc' }],
    count
  );
};

const getRecentBookings = async (count = 5) => {
  return await queryDocuments(
    COLLECTIONS.BOOKINGS,
    [],
    [{ field: 'createdAt', direction: 'desc' }],
    count
  );
};

const getPlaces = async () => {
  return await getCollection(COLLECTIONS.PLACES) as Place[];
};

const savePlace = async (place: Place) => {
  if (place.id) {
    await updateDocument(COLLECTIONS.PLACES, place.id, place);
    return place.id;
  } else {
    return await addDocument(COLLECTIONS.PLACES, place);
  }
};

const getToursByLocation = async (locationId: string) => {
  return await queryDocuments(
    COLLECTIONS.TOURS,
    [{ field: 'location_id', operator: '==', value: locationId }]
  ) as Tour[];
};

const saveTour = async (tour: Tour) => {
  if (tour.id) {
    await updateDocument(COLLECTIONS.TOURS, tour.id, tour);
    return tour.id;
  } else {
    return await addDocument(COLLECTIONS.TOURS, tour);
  }
};

const getAllUsers = async () => {
  return await getCollection(COLLECTIONS.USERS) as User[];
};

const deleteUser = async (userId: string) => {
  return await deleteDocument(COLLECTIONS.USERS, userId);
};

const updateUserRole = async (userId: string, isAdmin: boolean) => {
  return await updateDocument(COLLECTIONS.USERS, userId, { isAdmin });
};

const addItinerary = async (itinerary: Itinerary) => {
  return await addDocument(COLLECTIONS.ITINERARIES, itinerary);
};

const getAllItineraries = async () => {
  return await getCollection(COLLECTIONS.ITINERARIES) as Itinerary[];
};

const generateItinerary = async (data: any) => {
  // Simplified implementation for mock data
  return await addDocument(COLLECTIONS.ITINERARIES, {
    ...data,
    createdAt: new Date().toISOString()
  });
};

const getUserItineraries = async (userId: string) => {
  return await queryDocuments(
    COLLECTIONS.ITINERARIES,
    [{ field: 'userId', operator: '==', value: userId }]
  ) as Itinerary[];
};

const generateInitialData = async () => {
  // Mock implementation for demo purposes
  console.log("Generating initial data");
  return true;
};

const databaseService = {
  // Firestore
  getDocument,
  getCollection,
  queryDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
  
  // Realtime DB
  setData,
  getData,
  pushData,
  updateData,
  removeData,

  // Locations
  saveLocation,
  getLocation,
  getLocations,
  deleteLocation,

  // Food Items
  saveFoodItem,
  getFoodItem,
  getFoodItemsByLocation,
  deleteFoodItem,
  
  // Additional methods
  getAllBookings,
  updateBookingStatus,
  getAllBusinesses,
  addBusiness,
  updateBusiness,
  deleteBusiness,
  updateBusinessFeaturedStatus,
  getAllEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  getAllHiddenGems,
  addHiddenGem,
  updateHiddenGem,
  deleteHiddenGem,
  updateHiddenGemFeaturedStatus,
  getPublicItineraries,
  saveItinerary,
  getUsersCount,
  getBookingsCount,
  getDestinationsCount,
  getRecentUsers,
  getRecentBookings,
  getPlaces,
  savePlace,
  getToursByLocation,
  saveTour,
  getAllUsers,
  deleteUser,
  updateUserRole,
  addItinerary,
  getAllItineraries,
  generateItinerary,
  getUserItineraries,
  generateInitialData
};

export default databaseService;
