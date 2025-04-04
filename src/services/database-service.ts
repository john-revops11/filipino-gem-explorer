
import { ref, set, get, push, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { database } from './firebase';

// Database structure paths
export const DB_PATHS = {
  REGIONS: 'regions',
  PROVINCES: 'provinces',
  CITIES: 'cities',
  BARANGAYS: 'barangays',
  PLACES: 'places',
  FOOD: 'food',
  TOURS: 'tours',
  ITINERARIES: 'itineraries',
  CULTURAL_EVENTS: 'cultural_events',
  LOCAL_BUSINESSES: 'local_businesses',
  USERS: 'users',
  USER_PREFERENCES: 'user_preferences'
};

// Types for location data
export interface LocationReference {
  region_id: string;
  province_id: string;
  city_id: string;
  barangay_id?: string; // Optional as some data might not have barangay
}

// Common fields for data entities
export interface BaseDataEntity {
  name: string;
  description: string;
  location: LocationReference;
  images?: string[];
  tags: string[];
  created_at?: string;
  updated_at?: string;
  rating?: number;
  reviews?: Record<string, Review>;
}

export interface Review {
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

// Specific entity interfaces
export interface Region {
  name: string;
  provinces?: Record<string, {
    name: string;
    cities?: Record<string, {
      name: string;
      barangays?: Record<string, {
        name: string;
      }>;
    }>;
  }>;
}

export interface Place extends BaseDataEntity {
  type: string;
  admission_fee?: string;
  opening_hours?: Record<string, string>;
  contact_info?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  accessibility_features?: string[];
}

export interface FoodPlace extends BaseDataEntity {
  cuisine: string;
  dishes: string[];
  price_range: string;
  opening_hours?: Record<string, string>;
  contact_info?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  dietary_options?: string[]; // vegetarian, halal, etc.
}

export interface TourDay {
  day: string;
  activity: string;
  time: string;
  place_id: string;
  description?: string;
}

export interface Tour extends BaseDataEntity {
  itinerary: Record<string, TourDay>;
  price: string;
  duration: string;
  max_participants?: number;
  included_services?: string[];
  not_included?: string[];
  meeting_point?: {
    place_id?: string;
    description: string;
  };
}

export interface Itinerary extends BaseDataEntity {
  days: string[]; // References to days in tours
  total_price: string;
  created_by: string; // User ID
  is_public: boolean;
  liked_by?: string[]; // User IDs
}

export interface CulturalEvent extends BaseDataEntity {
  date: string;
  end_date?: string; // For multi-day events
  entry_fee?: string;
  organizer?: string;
  contact_info?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface LocalBusiness extends BaseDataEntity {
  business_type: string;
  products_services: string[];
  price_range?: string;
  opening_hours?: Record<string, string>;
  contact_info?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

// Database service class for CRUD operations
const databaseService = {
  // Location hierarchy operations
  saveRegion: async (regionId: string, data: Region) => {
    const regionRef = ref(database, `${DB_PATHS.REGIONS}/${regionId}`);
    await set(regionRef, data);
    return regionId;
  },

  getRegions: async () => {
    const regionsRef = ref(database, DB_PATHS.REGIONS);
    const snapshot = await get(regionsRef);
    return snapshot.exists() ? snapshot.val() : {};
  },

  // Places operations
  savePlace: async (placeData: Place) => {
    const plainData: Record<string, any> = {};
    
    // Copy properties from data object safely
    Object.entries(placeData).forEach(([key, value]) => {
      plainData[key] = value;
    });
    
    // Add timestamps
    plainData.created_at = plainData.created_at || new Date().toISOString();
    plainData.updated_at = new Date().toISOString();
    
    const placesRef = ref(database, DB_PATHS.PLACES);
    const newPlaceRef = push(placesRef);
    
    await set(newPlaceRef, plainData);
    return newPlaceRef.key;
  },

  updatePlace: async (placeId: string, placeData: Partial<Place>) => {
    const plainData: Record<string, any> = {};
    
    // Copy properties from data object safely
    Object.entries(placeData).forEach(([key, value]) => {
      plainData[key] = value;
    });
    
    // Update timestamp
    plainData.updated_at = new Date().toISOString();
    
    const placeRef = ref(database, `${DB_PATHS.PLACES}/${placeId}`);
    await update(placeRef, plainData);
    return placeId;
  },

  getPlace: async (placeId: string) => {
    const placeRef = ref(database, `${DB_PATHS.PLACES}/${placeId}`);
    const snapshot = await get(placeRef);
    return snapshot.exists() ? snapshot.val() : null;
  },

  getPlacesByLocation: async (locationRef: Partial<LocationReference>) => {
    const placesRef = ref(database, DB_PATHS.PLACES);
    
    // Start with highest specificity and fall back as needed
    let fieldToQuery = '';
    let valueToMatch = '';
    
    if (locationRef.barangay_id) {
      fieldToQuery = 'location/barangay_id';
      valueToMatch = locationRef.barangay_id;
    } else if (locationRef.city_id) {
      fieldToQuery = 'location/city_id';
      valueToMatch = locationRef.city_id;
    } else if (locationRef.province_id) {
      fieldToQuery = 'location/province_id';
      valueToMatch = locationRef.province_id;
    } else if (locationRef.region_id) {
      fieldToQuery = 'location/region_id';
      valueToMatch = locationRef.region_id;
    } else {
      // Return all places if no location specified
      const snapshot = await get(placesRef);
      return snapshot.exists() ? snapshot.val() : {};
    }
    
    const queryRef = query(
      placesRef,
      orderByChild(fieldToQuery),
      equalTo(valueToMatch)
    );
    
    const snapshot = await get(queryRef);
    return snapshot.exists() ? snapshot.val() : {};
  },

  deletePlace: async (placeId: string) => {
    const placeRef = ref(database, `${DB_PATHS.PLACES}/${placeId}`);
    await remove(placeRef);
    return true;
  },

  // Food places operations
  saveFoodPlace: async (foodData: FoodPlace) => {
    const plainData: Record<string, any> = {};
    
    // Copy properties from data object safely
    Object.entries(foodData).forEach(([key, value]) => {
      plainData[key] = value;
    });
    
    // Add timestamps
    plainData.created_at = plainData.created_at || new Date().toISOString();
    plainData.updated_at = new Date().toISOString();
    
    const foodRef = ref(database, DB_PATHS.FOOD);
    const newFoodRef = push(foodRef);
    
    await set(newFoodRef, plainData);
    return newFoodRef.key;
  },

  // Tours operations
  saveTour: async (tourData: Tour) => {
    const plainData: Record<string, any> = {};
    
    // Copy properties from data object safely
    Object.entries(tourData).forEach(([key, value]) => {
      plainData[key] = value;
    });
    
    // Add timestamps
    plainData.created_at = plainData.created_at || new Date().toISOString();
    plainData.updated_at = new Date().toISOString();
    
    const toursRef = ref(database, DB_PATHS.TOURS);
    const newTourRef = push(toursRef);
    
    await set(newTourRef, plainData);
    return newTourRef.key;
  },

  // Itineraries operations
  saveItinerary: async (itineraryData: Itinerary) => {
    const plainData: Record<string, any> = {};
    
    // Copy properties from data object safely
    Object.entries(itineraryData).forEach(([key, value]) => {
      plainData[key] = value;
    });
    
    // Add timestamps
    plainData.created_at = plainData.created_at || new Date().toISOString();
    plainData.updated_at = new Date().toISOString();
    
    const itinerariesRef = ref(database, DB_PATHS.ITINERARIES);
    const newItineraryRef = push(itinerariesRef);
    
    await set(newItineraryRef, plainData);
    return newItineraryRef.key;
  },

  getItinerary: async (itineraryId: string) => {
    const itineraryRef = ref(database, `${DB_PATHS.ITINERARIES}/${itineraryId}`);
    const snapshot = await get(itineraryRef);
    return snapshot.exists() ? snapshot.val() : null;
  },

  getUserItineraries: async (userId: string) => {
    const itinerariesRef = ref(database, DB_PATHS.ITINERARIES);
    const queryRef = query(
      itinerariesRef,
      orderByChild('created_by'),
      equalTo(userId)
    );
    
    const snapshot = await get(queryRef);
    return snapshot.exists() ? snapshot.val() : {};
  },

  // Cultural events operations
  saveCulturalEvent: async (eventData: CulturalEvent) => {
    const plainData: Record<string, any> = {};
    
    // Copy properties from data object safely
    Object.entries(eventData).forEach(([key, value]) => {
      plainData[key] = value;
    });
    
    // Add timestamps
    plainData.created_at = plainData.created_at || new Date().toISOString();
    plainData.updated_at = new Date().toISOString();
    
    const eventsRef = ref(database, DB_PATHS.CULTURAL_EVENTS);
    const newEventRef = push(eventsRef);
    
    await set(newEventRef, plainData);
    return newEventRef.key;
  },

  // Local businesses operations
  saveLocalBusiness: async (businessData: LocalBusiness) => {
    const plainData: Record<string, any> = {};
    
    // Copy properties from data object safely
    Object.entries(businessData).forEach(([key, value]) => {
      plainData[key] = value;
    });
    
    // Add timestamps
    plainData.created_at = plainData.created_at || new Date().toISOString();
    plainData.updated_at = new Date().toISOString();
    
    const businessesRef = ref(database, DB_PATHS.LOCAL_BUSINESSES);
    const newBusinessRef = push(businessesRef);
    
    await set(newBusinessRef, plainData);
    return newBusinessRef.key;
  },

  // Helper methods for searching across multiple categories
  searchByTags: async (tags: string[]) => {
    // This is a simplified implementation that would need to be
    // enhanced for production use with server-side search or 
    // a dedicated search service
    
    const results: Record<string, any> = {
      places: {},
      food: {},
      tours: {},
      itineraries: {},
      cultural_events: {},
      local_businesses: {}
    };
    
    // Fetch data from each category
    const placesSnapshot = await get(ref(database, DB_PATHS.PLACES));
    const foodSnapshot = await get(ref(database, DB_PATHS.FOOD));
    const toursSnapshot = await get(ref(database, DB_PATHS.TOURS));
    const itinerariesSnapshot = await get(ref(database, DB_PATHS.ITINERARIES));
    const eventsSnapshot = await get(ref(database, DB_PATHS.CULTURAL_EVENTS));
    const businessesSnapshot = await get(ref(database, DB_PATHS.LOCAL_BUSINESSES));
    
    // Helper function to filter items by tags
    const filterByTags = (items: Record<string, any>) => {
      const filtered: Record<string, any> = {};
      
      Object.entries(items).forEach(([key, value]) => {
        if (value.tags && Array.isArray(value.tags)) {
          const itemTags = value.tags.map((tag: string) => tag.toLowerCase());
          const searchTags = tags.map(tag => tag.toLowerCase());
          
          if (searchTags.some(tag => itemTags.includes(tag))) {
            filtered[key] = value;
          }
        }
      });
      
      return filtered;
    };
    
    // Apply filtering to each category
    if (placesSnapshot.exists()) {
      results.places = filterByTags(placesSnapshot.val());
    }
    
    if (foodSnapshot.exists()) {
      results.food = filterByTags(foodSnapshot.val());
    }
    
    if (toursSnapshot.exists()) {
      results.tours = filterByTags(toursSnapshot.val());
    }
    
    if (itinerariesSnapshot.exists()) {
      results.itineraries = filterByTags(itinerariesSnapshot.val());
    }
    
    if (eventsSnapshot.exists()) {
      results.cultural_events = filterByTags(eventsSnapshot.val());
    }
    
    if (businessesSnapshot.exists()) {
      results.local_businesses = filterByTags(businessesSnapshot.val());
    }
    
    return results;
  },

  // Get nearby locations - this would need to be expanded with actual geolocation functionality
  getNearbyLocations: async (lat: number, lng: number, radiusKm: number) => {
    // In a real implementation, you would use geospatial queries
    // Firebase doesn't directly support this, so you'd need to implement
    // the distance calculation client-side or use a cloud function
    
    // Placeholder for now
    console.log(`Searching for locations within ${radiusKm}km of ${lat},${lng}`);
    
    // Return a sample implementation
    const placesSnapshot = await get(ref(database, DB_PATHS.PLACES));
    const places = placesSnapshot.exists() ? placesSnapshot.val() : {};
    
    // In a real implementation, you would filter based on coordinates
    // For now, just return the first 5 places as a placeholder
    const nearbyPlaces: Record<string, any> = {};
    
    Object.entries(places).slice(0, 5).forEach(([key, value]) => {
      nearbyPlaces[key] = value;
    });
    
    return nearbyPlaces;
  }
};

export default databaseService;
