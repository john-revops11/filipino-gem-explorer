
import { auth, firestore, storage } from '@/services/firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Location type
export type Location = {
  id?: string;
  name: string;
  region: string;
  province?: string;
  city?: string;
  description?: string;
  image?: string;
  tags?: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

// Destination type
export type Destination = {
  id: string;
  name: string;
  description: string;
  location: Location;
  image: string;
  rating?: number;
  category?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt?: string;
};

// Place type
export type Place = {
  id?: string;
  name: string;
  description: string;
  location: string;
  location_id?: string;
  type: string;
  category?: string;
  image?: string;
  rating?: number;
  featured?: boolean;
  address?: string;
  priceRange?: string;
  price_range?: string;
  website?: string;
  contact?: string | {
    phone?: string;
    email?: string;
    website?: string;
  };
  amenities?: string[];
  tags?: string[];
  is_hidden_gem?: boolean;
  is_local_business?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// Tour type
export type Tour = {
  id?: string;
  name: string;
  description: string;
  location: string;
  location_id?: string;
  duration: string;
  price?: number;
  price_range?: string;
  image?: string;
  rating?: number;
  included?: string[];
  excluded?: string[];
  highlights?: string[];
  includes?: string[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// Food type
export type Food = {
  id?: string;
  name: string;
  description: string;
  location: string;
  location_id?: string;
  type: string;
  image?: string;
  price?: number;
  price_range?: string;
  rating?: number;
  ingredients?: string[];
  tags?: string[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// Itinerary type
export type Itinerary = {
  id?: string;
  name: string;
  description: string;
  days: number;
  image?: string;
  destinations: string[];
  location?: {
    name: string;
    id?: string;
  };
  activities?: any[];
  tags?: string[];
  content?: string;
  is_public?: boolean;
  dateRange?: string;
  status?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
};

// User type
export type User = {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt?: string;
};

// Booking type
export type Booking = {
  id: string;
  userId: string;
  user?: User;
  destinationId?: string;
  destination?: Destination;
  activityId?: string;
  activity?: any;
  date: string;
  totalPeople: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentMethod?: string;
  paymentStatus?: 'paid' | 'unpaid';
  createdAt: string;
  updatedAt?: string;
};

// Hidden Gem type
export type HiddenGem = {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  image: string;
  featured?: boolean;
  accessTips?: string;
  bestTime?: string;
  createdAt: string;
  updatedAt?: string;
};

// Local Business type
export type Business = {
  id: string;
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
  createdAt: string;
  updatedAt?: string;
};

// Event type
export type Event = {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  date: string;
  image: string;
  featured?: boolean;
  createdAt: string;
  updatedAt?: string;
};

// Convert Firebase document to our data type
const convertDoc = <T>(doc: any): T => {
  const data = doc.data();
  // Convert Firebase timestamps to ISO strings
  Object.keys(data).forEach((key) => {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate().toISOString();
    }
  });
  return { id: doc.id, ...data } as T;
};

// Database service methods
const databaseService = {
  // Locations
  getLocations: async (): Promise<Location[]> => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'locations'));
      return querySnapshot.docs.map(doc => convertDoc<Location>(doc));
    } catch (error) {
      console.error('Error getting locations:', error);
      return [];
    }
  },
  
  saveLocation: async (location: Location): Promise<string> => {
    try {
      const docRef = await addDoc(collection(firestore, 'locations'), location);
      return docRef.id;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  },
  
  // Destinations
  getAllDestinations: async (): Promise<Destination[]> => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'destinations'));
      return querySnapshot.docs.map(doc => convertDoc<Destination>(doc));
    } catch (error) {
      console.error('Error getting destinations:', error);
      return [];
    }
  },
  
  getDestination: async (id: string): Promise<Destination | null> => {
    try {
      const docRef = doc(firestore, 'destinations', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertDoc<Destination>(docSnap);
      }
      return null;
    } catch (error) {
      console.error('Error getting destination:', error);
      return null;
    }
  },
  
  addDestination: async (destination: Omit<Destination, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(firestore, 'destinations'), destination);
      return docRef.id;
    } catch (error) {
      console.error('Error adding destination:', error);
      throw error;
    }
  },
  
  updateDestination: async (id: string, destination: Partial<Destination>): Promise<void> => {
    try {
      const docRef = doc(firestore, 'destinations', id);
      await updateDoc(docRef, { ...destination, updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error updating destination:', error);
      throw error;
    }
  },
  
  deleteDestination: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(firestore, 'destinations', id));
    } catch (error) {
      console.error('Error deleting destination:', error);
      throw error;
    }
  },
  
  // Places
  getPlaces: async (): Promise<Place[]> => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'places'));
      return querySnapshot.docs.map(doc => convertDoc<Place>(doc));
    } catch (error) {
      console.error('Error getting places:', error);
      return [];
    }
  },
  
  getPlace: async (id: string): Promise<Place | null> => {
    try {
      const docRef = doc(firestore, 'places', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertDoc<Place>(docSnap);
      }
      return null;
    } catch (error) {
      console.error('Error getting place:', error);
      return null;
    }
  },
  
  savePlace: async (place: Place): Promise<string> => {
    try {
      const docRef = await addDoc(collection(firestore, 'places'), place);
      return docRef.id;
    } catch (error) {
      console.error('Error adding place:', error);
      throw error;
    }
  },
  
  updatePlace: async (id: string, place: Partial<Place>): Promise<void> => {
    try {
      const docRef = doc(firestore, 'places', id);
      await updateDoc(docRef, { ...place, updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error updating place:', error);
      throw error;
    }
  },
  
  deletePlace: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(firestore, 'places', id));
    } catch (error) {
      console.error('Error deleting place:', error);
      throw error;
    }
  },
  
  // Tours
  getAllTours: async (): Promise<Tour[]> => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'tours'));
      return querySnapshot.docs.map(doc => convertDoc<Tour>(doc));
    } catch (error) {
      console.error('Error getting tours:', error);
      return [];
    }
  },
  
  getToursByLocation: async (locationId: string): Promise<Tour[]> => {
    try {
      const q = query(collection(firestore, 'tours'), where("location_id", "==", locationId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertDoc<Tour>(doc));
    } catch (error) {
      console.error('Error getting tours by location:', error);
      return [];
    }
  },
  
  saveTour: async (tour: Tour): Promise<string> => {
    try {
      const docRef = await addDoc(collection(firestore, 'tours'), tour);
      return docRef.id;
    } catch (error) {
      console.error('Error adding tour:', error);
      throw error;
    }
  },
  
  updateTour: async (id: string, tour: Partial<Tour>): Promise<void> => {
    try {
      const docRef = doc(firestore, 'tours', id);
      await updateDoc(docRef, { ...tour, updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error updating tour:', error);
      throw error;
    }
  },
  
  deleteTour: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(firestore, 'tours', id));
    } catch (error) {
      console.error('Error deleting tour:', error);
      throw error;
    }
  },
  
  // Foods
  getAllFoods: async (): Promise<Food[]> => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'foods'));
      return querySnapshot.docs.map(doc => convertDoc<Food>(doc));
    } catch (error) {
      console.error('Error getting foods:', error);
      return [];
    }
  },
  
  getFoodItemsByLocation: async (locationId: string): Promise<Food[]> => {
    try {
      const q = query(collection(firestore, 'foods'), where("location_id", "==", locationId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertDoc<Food>(doc));
    } catch (error) {
      console.error('Error getting food items by location:', error);
      return [];
    }
  },
  
  saveFoodItem: async (food: Food): Promise<string> => {
    try {
      const docRef = await addDoc(collection(firestore, 'foods'), food);
      return docRef.id;
    } catch (error) {
      console.error('Error adding food:', error);
      throw error;
    }
  },
  
  updateFood: async (id: string, food: Partial<Food>): Promise<void> => {
    try {
      const docRef = doc(firestore, 'foods', id);
      await updateDoc(docRef, { ...food, updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error updating food:', error);
      throw error;
    }
  },
  
  deleteFood: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(firestore, 'foods', id));
    } catch (error) {
      console.error('Error deleting food:', error);
      throw error;
    }
  },
  
  // Itineraries
  getAllItineraries: async (): Promise<Itinerary[]> => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'itineraries'));
      return querySnapshot.docs.map(doc => convertDoc<Itinerary>(doc));
    } catch (error) {
      console.error('Error getting itineraries:', error);
      return [];
    }
  },
  
  getPublicItineraries: async (): Promise<Itinerary[]> => {
    try {
      const q = query(collection(firestore, 'itineraries'), where("is_public", "==", true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertDoc<Itinerary>(doc));
    } catch (error) {
      console.error('Error getting public itineraries:', error);
      return [];
    }
  },
  
  getUserItineraries: async (userId: string): Promise<Itinerary[]> => {
    try {
      const q = query(collection(firestore, 'itineraries'), where("created_by", "==", userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertDoc<Itinerary>(doc));
    } catch (error) {
      console.error('Error getting user itineraries:', error);
      return [];
    }
  },
  
  saveItinerary: async (itinerary: Itinerary): Promise<string> => {
    try {
      const docRef = await addDoc(collection(firestore, 'itineraries'), itinerary);
      return docRef.id;
    } catch (error) {
      console.error('Error adding itinerary:', error);
      throw error;
    }
  },
  
  addItinerary: async (itinerary: Omit<Itinerary, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(firestore, 'itineraries'), itinerary);
      return docRef.id;
    } catch (error) {
      console.error('Error adding itinerary:', error);
      throw error;
    }
  },
  
  updateItinerary: async (id: string, itinerary: Partial<Itinerary>): Promise<void> => {
    try {
      const docRef = doc(firestore, 'itineraries', id);
      await updateDoc(docRef, { ...itinerary, updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error updating itinerary:', error);
      throw error;
    }
  },
  
  deleteItinerary: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(firestore, 'itineraries', id));
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      throw error;
    }
  },
  
  // Users
  getAllUsers: async (): Promise<User[]> => {
    try {
      // In a real app, this would typically be done through an admin SDK
      // For demo purposes, we're fetching from Firestore directly
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      return querySnapshot.docs.map(doc => convertDoc<User>(doc));
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },
  
  getUser: async (id: string): Promise<User | null> => {
    try {
      const docRef = doc(firestore, 'users', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertDoc<User>(docSnap);
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },
  
  updateUser: async (id: string, userData: Partial<User>): Promise<void> => {
    try {
      const docRef = doc(firestore, 'users', id);
      await updateDoc(docRef, { ...userData, updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  
  deleteUser: async (id: string): Promise<void> => {
    try {
      // In a real app, this would be handled by admin SDK
      await deleteDoc(doc(firestore, 'users', id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
  
  updateUserRole: async (id: string, isAdmin: boolean): Promise<void> => {
    try {
      const docRef = doc(firestore, 'users', id);
      await updateDoc(docRef, { 
        isAdmin, 
        updatedAt: new Date().toISOString() 
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },
  
  // Bookings
  getAllBookings: async (): Promise<Booking[]> => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'bookings'));
      const bookings = querySnapshot.docs.map(doc => convertDoc<Booking>(doc));
      
      // Fetch related user and destination data
      for (const booking of bookings) {
        if (booking.userId) {
          booking.user = await databaseService.getUser(booking.userId);
        }
        
        if (booking.destinationId) {
          booking.destination = await databaseService.getDestination(booking.destinationId);
        }
      }
      
      return bookings;
    } catch (error) {
      console.error('Error getting bookings:', error);
      return [];
    }
  },
  
  updateBookingStatus: async (id: string, status: string): Promise<void> => {
    try {
      const docRef = doc(firestore, 'bookings', id);
      await updateDoc(docRef, { 
        status, 
        updatedAt: new Date().toISOString() 
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },
  
  // Hidden Gems
  getAllHiddenGems: async (): Promise<HiddenGem[]> => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'hiddenGems'));
      return querySnapshot.docs.map(doc => convertDoc<HiddenGem>(doc));
    } catch (error) {
      console.error('Error getting hidden gems:', error);
      return [];
    }
  },
  
  addHiddenGem: async (gem: Omit<HiddenGem, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(firestore, 'hiddenGems'), gem);
      return docRef.id;
    } catch (error) {
      console.error('Error adding hidden gem:', error);
      throw error;
    }
  },
  
  updateHiddenGem: async (id: string, gem: Partial<HiddenGem>): Promise<void> => {
    try {
      const docRef = doc(firestore, 'hiddenGems', id);
      await updateDoc(docRef, { ...gem, updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error updating hidden gem:', error);
      throw error;
    }
  },
  
  deleteHiddenGem: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(firestore, 'hiddenGems', id));
    } catch (error) {
      console.error('Error deleting hidden gem:', error);
      throw error;
    }
  },
  
  updateHiddenGemFeaturedStatus: async (id: string, featured: boolean): Promise<void> => {
    try {
      const docRef = doc(firestore, 'hiddenGems', id);
      await updateDoc(docRef, { 
        featured, 
        updatedAt: new Date().toISOString() 
      });
    } catch (error) {
      console.error('Error updating hidden gem featured status:', error);
      throw error;
    }
  },
  
  // Local Businesses
  getAllBusinesses: async (): Promise<Business[]> => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'businesses'));
      return querySnapshot.docs.map(doc => convertDoc<Business>(doc));
    } catch (error) {
      console.error('Error getting businesses:', error);
      return [];
    }
  },
  
  addBusiness: async (business: Omit<Business, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(firestore, 'businesses'), business);
      return docRef.id;
    } catch (error) {
      console.error('Error adding business:', error);
      throw error;
    }
  },
  
  updateBusiness: async (id: string, business: Partial<Business>): Promise<void> => {
    try {
      const docRef = doc(firestore, 'businesses', id);
      await updateDoc(docRef, { ...business, updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  },
  
  deleteBusiness: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(firestore, 'businesses', id));
    } catch (error) {
      console.error('Error deleting business:', error);
      throw error;
    }
  },
  
  updateBusinessFeaturedStatus: async (id: string, featured: boolean): Promise<void> => {
    try {
      const docRef = doc(firestore, 'businesses', id);
      await updateDoc(docRef, { 
        featured, 
        updatedAt: new Date().toISOString() 
      });
    } catch (error) {
      console.error('Error updating business featured status:', error);
      throw error;
    }
  },
  
  // Events
  getAllEvents: async (): Promise<Event[]> => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'events'));
      return querySnapshot.docs.map(doc => convertDoc<Event>(doc));
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  },
  
  addEvent: async (event: Omit<Event, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(firestore, 'events'), event);
      return docRef.id;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  },
  
  updateEvent: async (id: string, event: Partial<Event>): Promise<void> => {
    try {
      const docRef = doc(firestore, 'events', id);
      await updateDoc(docRef, { ...event, updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },
  
  deleteEvent: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(firestore, 'events', id));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },
  
  // Dashboard stats
  getUsersCount: async (): Promise<number> => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting users count:', error);
      return 0;
    }
  },
  
  getBookingsCount: async (): Promise<number> => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'bookings'));
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting bookings count:', error);
      return 0;
    }
  },
  
  getDestinationsCount: async (): Promise<number> => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'destinations'));
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting destinations count:', error);
      return 0;
    }
  },
  
  getRecentUsers: async (limit: number): Promise<User[]> => {
    try {
      const q = query(
        collection(firestore, 'users'),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertDoc<User>(doc));
    } catch (error) {
      console.error('Error getting recent users:', error);
      return [];
    }
  },
  
  getRecentBookings: async (limitCount: number): Promise<Booking[]> => {
    try {
      const q = query(
        collection(firestore, 'bookings'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      const bookings = querySnapshot.docs.map(doc => convertDoc<Booking>(doc));
      
      // Fetch related user and destination data
      for (const booking of bookings) {
        if (booking.userId) {
          booking.user = await databaseService.getUser(booking.userId);
        }
        
        if (booking.destinationId) {
          booking.destination = await databaseService.getDestination(booking.destinationId);
        }
      }
      
      return bookings;
    } catch (error) {
      console.error('Error getting recent bookings:', error);
      return [];
    }
  },
  
  // Additional utilities
  generateInitialData: async (): Promise<void> => {
    try {
      // Generate sample data if none exists
      const locationsSnapshot = await getDocs(collection(firestore, 'locations'));
      if (locationsSnapshot.size === 0) {
        console.log('Generating initial data...');
        // Add sample locations, destinations, etc.
      }
    } catch (error) {
      console.error('Error generating initial data:', error);
    }
  },
  
  generateItinerary: async (location: string, days: number, preferences?: string): Promise<string> => {
    try {
      // Mock implementation for generating an itinerary
      return `<h2>Day 1</h2><p>Explore ${location}'s main attractions.</p>
      <h2>Day 2</h2><p>Visit local hidden gems and try authentic cuisine.</p>
      <h2>Day 3</h2><p>Relax and enjoy ${preferences || 'beach activities'} before departure.</p>`;
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw error;
    }
  },
  
  saveGeneratedItinerary: async (itineraryData: Itinerary): Promise<string> => {
    try {
      // This is an alias for saveItinerary for better semantic meaning
      return await databaseService.saveItinerary(itineraryData);
    } catch (error) {
      console.error('Error saving generated itinerary:', error);
      throw error;
    }
  },
  
  // File upload
  uploadImage: async (file: File, path: string): Promise<string> => {
    try {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
};

export default databaseService;
