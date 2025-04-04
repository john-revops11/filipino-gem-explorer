
// Simple mock database service until Firebase is re-integrated
const databaseService = {
  saveItinerary: async (itineraryData: any) => {
    // For now, just log the data and return a mock ID
    console.log("Saving itinerary:", itineraryData);
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock itinerary ID
    return `itinerary-${Date.now()}`;
  }
};

export default databaseService;
