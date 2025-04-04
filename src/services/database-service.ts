import { auth, database, firestore } from "./firebase";
import { ref, set, get, push, remove, query, orderByChild, equalTo } from "firebase/database";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  getDocs, 
  where, 
  query as firestoreQuery,
  doc,
  getDoc
} from "firebase/firestore";
import { toast } from "sonner";
import { generateItinerary as generateAIItinerary } from "./gemini-api";

export interface Location {
  id?: string;
  name: string;
  region: string;
  province?: string;
  description?: string;
  image?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  tags?: string[];
}

export interface Food {
  id?: string;
  name: string;
  type: string;
  description: string;
  price_range?: string;
  location_id: string;
  image?: string;
  tags?: string[];
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

export interface ItineraryDay {
  day: string;
  activities: Array<{
    time: string;
    title: string;
    type: "activity" | "transport" | "food" | "accommodation" | "rest";
    location?: string;
    description?: string;
    cost?: string;
  }>;
}

export interface Itinerary {
  id?: string;
  name: string;
  description: string;
  days: number;
  content?: string; // For storing the AI-generated content
  location: {
    name: string;
    region_id?: string;
    province_id?: string;
    city_id?: string;
  };
  tags?: string[];
  created_by?: string;
  is_public?: boolean;
  created_at?: any;
  updated_at?: any;
  duration?: string; // Number of days
  destination?: string; // Main destination
  image?: string; // Cover image URL
  status?: 'planning' | 'upcoming' | 'completed';
  dateRange?: string;
}

const databaseService = {
  saveLocation: async (locationData: Location) => {
    try {
      const docRef = await addDoc(collection(firestore, 'locations'), {
        ...locationData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error("Failed to save location", {
        description: "There was an error saving the location. Please try again."
      });
      throw error;
    }
  },
  
  getLocations: async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'locations'));
      const locations: Location[] = [];
      
      querySnapshot.forEach((doc) => {
        locations.push({
          id: doc.id,
          ...doc.data() as Location
        });
      });
      
      return locations;
    } catch (error) {
      console.error("Error getting locations:", error);
      toast.error("Failed to load locations", {
        description: "There was an error retrieving locations. Please try again."
      });
      throw error;
    }
  },
  
  getLocationById: async (locationId: string) => {
    try {
      const docRef = doc(firestore, 'locations', locationId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data() as Location
        };
      } else {
        console.log("No location found with ID:", locationId);
        return null;
      }
    } catch (error) {
      console.error("Error getting location:", error);
      toast.error("Failed to retrieve location", {
        description: "There was an error loading the location. Please try again."
      });
      throw error;
    }
  },
  
  saveFoodItem: async (foodData: Food) => {
    try {
      const docRef = await addDoc(collection(firestore, 'food'), {
        ...foodData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error("Error saving food item:", error);
      toast.error("Failed to save food item", {
        description: "There was an error saving the food item. Please try again."
      });
      throw error;
    }
  },
  
  getFoodItemsByLocation: async (locationId: string) => {
    try {
      const foodQuery = firestoreQuery(
        collection(firestore, 'food'),
        where('location_id', '==', locationId)
      );
      
      const querySnapshot = await getDocs(foodQuery);
      const foodItems: Food[] = [];
      
      querySnapshot.forEach((doc) => {
        foodItems.push({
          id: doc.id,
          ...doc.data() as Food
        });
      });
      
      return foodItems;
    } catch (error) {
      console.error("Error getting food items:", error);
      toast.error("Failed to load food items", {
        description: "There was an error retrieving food items. Please try again."
      });
      throw error;
    }
  },
  
  saveTour: async (tourData: Tour) => {
    try {
      const docRef = await addDoc(collection(firestore, 'tours'), {
        ...tourData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error("Error saving tour:", error);
      toast.error("Failed to save tour", {
        description: "There was an error saving the tour. Please try again."
      });
      throw error;
    }
  },
  
  getToursByLocation: async (locationId: string) => {
    try {
      const toursQuery = firestoreQuery(
        collection(firestore, 'tours'),
        where('location_id', '==', locationId)
      );
      
      const querySnapshot = await getDocs(toursQuery);
      const tours: Tour[] = [];
      
      querySnapshot.forEach((doc) => {
        tours.push({
          id: doc.id,
          ...doc.data() as Tour
        });
      });
      
      return tours;
    } catch (error) {
      console.error("Error getting tours:", error);
      toast.error("Failed to load tours", {
        description: "There was an error retrieving tours. Please try again."
      });
      throw error;
    }
  },
  
  saveItinerary: async (itineraryData: Itinerary) => {
    console.log("Saving itinerary:", itineraryData);
    
    try {
      // Check if we should use Firestore or Realtime Database
      // For now we'll support both, but could be configured by a setting later
      
      // Firestore approach (currently used by the app)
      const docRef = await addDoc(collection(firestore, 'itineraries'), {
        ...itineraryData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      
      // Realtime Database approach (prepared for future use)
      const dbRef = ref(database, `itineraries/${docRef.id}`);
      await set(dbRef, {
        ...itineraryData,
        id: docRef.id // Store the ID in the object too
      });

      return docRef.id;
    } catch (error) {
      console.error("Error saving itinerary:", error);
      toast.error("Failed to save itinerary", {
        description: "There was an error saving your itinerary. Please try again."
      });
      throw error;
    }
  },

  getItinerary: async (itineraryId: string) => {
    try {
      const docRef = doc(firestore, 'itineraries', itineraryId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data() as Itinerary
        };
      } else {
        console.log("No itinerary found with ID:", itineraryId);
        return null;
      }
    } catch (error) {
      console.error("Error getting itinerary:", error);
      toast.error("Failed to retrieve itinerary", {
        description: "There was an error loading the itinerary. Please try again."
      });
      throw error;
    }
  },

  getUserItineraries: async (userId: string) => {
    try {
      if (!userId) {
        console.log("No user ID provided");
        return [];
      }

      // Get from Firestore
      const itinerariesQuery = firestoreQuery(
        collection(firestore, 'itineraries'),
        where('created_by', '==', userId)
      );
      
      const querySnapshot = await getDocs(itinerariesQuery);
      const itineraries: Itinerary[] = [];
      
      querySnapshot.forEach((doc) => {
        itineraries.push({
          id: doc.id,
          ...doc.data() as Itinerary
        });
      });
      
      return itineraries;
    } catch (error) {
      console.error("Error getting user itineraries:", error);
      toast.error("Failed to load your itineraries", {
        description: "There was an error retrieving your saved itineraries. Please try again."
      });
      throw error;
    }
  },

  getPublicItineraries: async () => {
    try {
      const itinerariesQuery = firestoreQuery(
        collection(firestore, 'itineraries'),
        where('is_public', '==', true)
      );
      
      const querySnapshot = await getDocs(itinerariesQuery);
      const itineraries: Itinerary[] = [];
      
      querySnapshot.forEach((doc) => {
        itineraries.push({
          id: doc.id,
          ...doc.data() as Itinerary
        });
      });
      
      return itineraries;
    } catch (error) {
      console.error("Error getting public itineraries:", error);
      toast.error("Failed to load itineraries", {
        description: "There was an error retrieving public itineraries. Please try again."
      });
      throw error;
    }
  },

  saveGeneratedItinerary: async (destination: string, days: string, content: string, userId: string) => {
    try {
      if (!userId) {
        toast.error("You need to be logged in to save itineraries", {
          description: "Please sign in or create an account to save this itinerary."
        });
        return null;
      }

      const itineraryData: Itinerary = {
        name: `${days}-Day Itinerary for ${destination}`,
        description: `AI-generated ${days}-day travel plan for ${destination}`,
        days: parseInt(days),
        location: {
          name: destination
        },
        tags: ["AI-generated"],
        content: content,
        created_by: userId,
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        duration: days,
        destination: destination,
        image: `/assets/destinations/${destination.toLowerCase().replace(/\s+/g, '-')}.jpg`, // Default image path
        status: 'planning'
      };

      return await databaseService.saveItinerary(itineraryData);
    } catch (error) {
      console.error("Error saving generated itinerary:", error);
      toast.error("Failed to save itinerary", {
        description: "There was an error saving your generated itinerary. Please try again."
      });
      return null;
    }
  },

  generateItinerary: async (destination: string, days: number, preferences: string) => {
    try {
      // Call the AI service to generate the content
      const itineraryContent = await generateAIItinerary(destination, days, preferences);
      return itineraryContent;
    } catch (error) {
      console.error(`Error generating AI itinerary for ${destination}:`, error);
      throw new Error(`Failed to generate AI itinerary: ${error}`);
    }
  },

  generateInitialData: async () => {
    try {
      // Check if data already exists
      const locationsSnapshot = await getDocs(collection(firestore, 'locations'));
      if (!locationsSnapshot.empty) {
        console.log("Initial data already exists, skipping generation");
        return;
      }
      
      // Define regions and initial locations
      const regions = [
        { name: "Luzon", locations: ["Manila", "Baguio", "Batangas"] },
        { name: "Visayas", locations: ["Cebu", "Boracay", "Bohol"] },
        { name: "Mindanao", locations: ["Davao", "Siargao", "Zamboanga"] }
      ];
      
      for (const region of regions) {
        for (const locationName of region.locations) {
          // Save location
          const locationData: Location = {
            name: locationName,
            region: region.name,
            description: `${locationName} is a beautiful destination in the ${region.name} region of the Philippines.`,
            tags: ["Popular", "Tourist Spot"],
            image: `https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80`,
          };
          
          const locationId = await databaseService.saveLocation(locationData);
          
          // Generate sample food for this location
          const foodItems = [
            { 
              name: `${locationName} Special Dish`, 
              type: "Local Specialty", 
              description: `A special dish from ${locationName}`,
              price_range: "₱100-₱300",
              location_id: locationId,
              tags: ["Local", "Traditional"]
            },
            { 
              name: `Seafood in ${locationName}`, 
              type: "Seafood", 
              description: `Fresh seafood from the waters of ${locationName}`,
              price_range: "₱200-₱500",
              location_id: locationId,
              tags: ["Seafood", "Fresh"]
            }
          ];
          
          for (const foodItem of foodItems) {
            await databaseService.saveFoodItem(foodItem);
          }
          
          // Generate sample tours for this location
          const tours = [
            { 
              name: `${locationName} City Tour`, 
              description: `Explore the beautiful city of ${locationName}`,
              price_range: "₱500-₱1000",
              duration: "4 hours",
              location_id: locationId,
              highlights: ["Historical sites", "Local cuisine", "Cultural experiences"]
            },
            { 
              name: `${locationName} Adventure Tour`, 
              description: `Experience thrilling adventures in ${locationName}`,
              price_range: "₱1000-₱2000",
              duration: "Full day",
              location_id: locationId,
              highlights: ["Nature trails", "Water activities", "Mountain views"]
            }
          ];
          
          for (const tour of tours) {
            await databaseService.saveTour(tour);
          }
          
          // Generate a sample AI itinerary for this location
          try {
            const daysOptions = ["3", "5", "7"];
            const randomDaysIndex = Math.floor(Math.random() * daysOptions.length);
            const days = daysOptions[randomDaysIndex];
            
            // Call the AI service to generate the content
            const itineraryContent = await generateAIItinerary(locationName, parseInt(days), "balanced, cultural experiences");
            
            // Create the itinerary object
            const itineraryData: Itinerary = {
              name: `${days}-Day ${locationName} Experience`,
              description: `Discover the best of ${locationName} in ${days} days`,
              days: parseInt(days),
              location: {
                name: locationName
              },
              tags: ["AI-generated", "Popular", locationName],
              content: itineraryContent,
              created_by: "system",
              is_public: true,
              duration: days,
              destination: locationName,
              image: `https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80`,
              status: 'planning'
            };
            
            await databaseService.saveItinerary(itineraryData);
          } catch (error) {
            console.error(`Error generating itinerary for ${locationName}:`, error);
          }
        }
      }
      
      toast.success("Initial data generated successfully", {
        description: "Sample locations, food, tours, and itineraries have been created."
      });
    } catch (error) {
      console.error("Error generating initial data:", error);
      toast.error("Failed to generate initial data", {
        description: "There was an error creating the sample data. Please try again."
      });
    }
  }
};

export default databaseService;
