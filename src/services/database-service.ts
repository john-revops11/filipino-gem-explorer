
import { auth, database, firestore } from "./firebase";
import { ref, set, get, push, remove, query, orderByChild, equalTo } from "firebase/database";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  getDocs, 
  where, 
  query as firestoreQuery 
} from "firebase/firestore";
import { toast } from "sonner";

// Define types based on the database structure
export interface Location {
  region_id: string;
  province_id: string;
  city_id: string;
  barangay_id?: string; // Optional for flexibility
}

export interface ItineraryDay {
  day: string;
  activity: string;
  time: string;
  place_id?: string; // Reference to a place
}

export interface Itinerary {
  name: string;
  description: string;
  days: string[] | ItineraryDay[]; // Can be references or embedded data
  total_price?: string;
  location: Location;
  tags: string[];
  content?: string; // For storing the AI-generated content
  created_by: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  duration?: string; // Number of days
  destination?: string; // Main destination
  image?: string; // Cover image URL
}

const databaseService = {
  // Save an itinerary to Firebase
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

  // Get an itinerary by ID
  getItinerary: async (itineraryId: string) => {
    try {
      const dbRef = ref(database, `itineraries/${itineraryId}`);
      const snapshot = await get(dbRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
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

  // Get user itineraries
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
      const itineraries: any[] = [];
      
      querySnapshot.forEach((doc) => {
        itineraries.push({
          id: doc.id,
          ...doc.data()
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

  // Save itinerary from AI generation
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
        days: [],
        location: {
          region_id: "",
          province_id: "",
          city_id: ""
        },
        tags: ["AI-generated"],
        content: content,
        created_by: userId,
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        duration: days,
        destination: destination,
        image: `/assets/destinations/${destination.toLowerCase().replace(/\s+/g, '-')}.jpg` // Default image path
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

  // Future methods for locations management
  getRegions: async () => {
    try {
      const dbRef = ref(database, 'regions');
      const snapshot = await get(dbRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No regions found");
        return {};
      }
    } catch (error) {
      console.error("Error getting regions:", error);
      throw error;
    }
  },

  // Method to save itinerary-related data to multiple paths
  saveCompleteItinerary: async (itineraryData: Itinerary, dayActivities: ItineraryDay[]) => {
    try {
      // First save the main itinerary
      const itineraryId = await databaseService.saveItinerary(itineraryData);
      
      // Then save each day activity
      const dayIds: string[] = [];
      for (const activity of dayActivities) {
        const dayRef = ref(database, `tours/${itineraryId}/itinerary`);
        const newDayRef = push(dayRef);
        await set(newDayRef, activity);
        dayIds.push(newDayRef.key as string);
      }
      
      // Update the itinerary with the day IDs
      const itineraryRef = ref(database, `itineraries/${itineraryId}`);
      await set(itineraryRef, {
        ...itineraryData,
        days: dayIds
      });
      
      return itineraryId;
    } catch (error) {
      console.error("Error saving complete itinerary:", error);
      toast.error("Failed to save complete itinerary", {
        description: "There was an error saving your itinerary details. Please try again."
      });
      throw error;
    }
  },

  // More methods can be added here for other data categories
  // like places, food, tours, cultural events, local businesses
};

export default databaseService;
