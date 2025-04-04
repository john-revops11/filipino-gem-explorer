
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
  FOOD_ITEMS: 'food_items'
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
  latitude: number;
  longitude: number;
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
};

export default databaseService;
