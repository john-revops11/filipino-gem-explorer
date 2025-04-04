
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
  CONVERSATIONS: 'aiConversations'
};

// Firestore Operations
export const firestoreService = {
  // Get a single document by ID
  getDocument: async (collectionName: string, docId: string) => {
    const docRef = doc(firestore, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  },
  
  // Get all documents from a collection
  getCollection: async (collectionName: string) => {
    const collectionRef = collection(firestore, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },
  
  // Query documents with filters
  queryDocuments: async (
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
  },
  
  // Add a new document
  addDocument: async (collectionName: string, data: DocumentData) => {
    // Create a plain object from the data to safely spread
    const dataObject = Object.assign({}, data);
    
    const docRef = await addDoc(collection(firestore, collectionName), {
      ...dataObject,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  },
  
  // Update an existing document
  updateDocument: async (collectionName: string, docId: string, data: DocumentData) => {
    // Create a plain object from the data to safely spread
    const dataObject = Object.assign({}, data);
    
    const docRef = doc(firestore, collectionName, docId);
    
    await updateDoc(docRef, {
      ...dataObject,
      updatedAt: serverTimestamp()
    });
    
    return true;
  },
  
  // Delete a document
  deleteDocument: async (collectionName: string, docId: string) => {
    const docRef = doc(firestore, collectionName, docId);
    await deleteDoc(docRef);
    
    return true;
  }
};

// Realtime Database Operations
export const realtimeDbService = {
  // Set data at a specific path
  setData: async (path: string, data: any) => {
    const dbRef = ref(database, path);
    await set(dbRef, data);
    return true;
  },
  
  // Get data from a specific path
  getData: async (path: string) => {
    const dbRef = ref(database, path);
    const snapshot = await get(dbRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  },
  
  // Push new data to a list
  pushData: async (path: string, data: any) => {
    // Create a plain object from the data to safely spread
    const dataObject = Object.assign({}, data);
    
    const listRef = ref(database, path);
    const newItemRef = push(listRef);
    
    await set(newItemRef, {
      ...dataObject,
      timestamp: Date.now()
    });
    
    return newItemRef.key;
  },
  
  // Update data at a specific path
  updateData: async (path: string, data: any) => {
    const dbRef = ref(database, path);
    await update(dbRef, data);
    return true;
  },
  
  // Remove data at a specific path
  removeData: async (path: string) => {
    const dbRef = ref(database, path);
    await remove(dbRef);
    return true;
  }
};
