
import databaseService, { Location } from "@/services/database-service";
import { generateTravelRecommendations } from "@/services/gemini-api";

// Helper function to parse destinations from generated text
export const parseDestinations = (text: string, count = 3) => {
  const destinations = [];
  const regions = {
    "Luzon": ["Manila", "Baguio", "Batangas", "Tagaytay", "Vigan", "Palawan", "Batanes", "Quezon"],
    "Visayas": ["Cebu", "Bohol", "Boracay", "Iloilo", "Bacolod", "Tacloban", "Dumaguete", "Siquijor"],
    "Mindanao": ["Davao", "Cagayan de Oro", "Zamboanga", "General Santos", "Surigao", "Butuan", "Cotabato", "Siargao"]
  };
  
  // Simple parsing logic - real implementation would be more robust
  const lines = text.split('\n');
  let currentDestination = null;
  let currentSection = null;
  
  for (const line of lines) {
    if (line.match(/^\d+\.\s+(.+)/)) {
      // New destination found
      const name = line.match(/^\d+\.\s+(.+)/)[1].split('-')[0].trim();
      if (destinations.length < count) {
        // Determine region based on name (simplified logic)
        let region = "Luzon"; // Default
        for (const [key, cities] of Object.entries(regions)) {
          if (cities.some(city => name.includes(city))) {
            region = key;
            break;
          }
        }
        
        currentDestination = {
          name: name,
          region: region,
          description: "",
          tags: ["Generated", "AI", prompt],
          image: `https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80`,
        };
        destinations.push(currentDestination);
      }
    } else if (currentDestination) {
      if (line.match(/Key attractions:/i)) {
        currentSection = "attractions";
      } else if (line.match(/Best time to visit:/i)) {
        currentSection = "time";
      } else if (line.match(/Estimated costs:/i)) {
        currentSection = "costs";
      } else if (currentSection === "attractions") {
        currentDestination.description += line + " ";
      }
    }
  }
  
  return destinations;
};

// Helper function to generate food items for a destination
export const generateFoodsForDestination = async (destination: any) => {
  try {
    const foodPrompt = `Name and describe 2 popular local dishes or food specialties from ${destination.name} in the Philippines.`;
    const foodData = await generateTravelRecommendations({
      location: destination.name,
      interests: ["food"]
    });
    
    // Simple parsing to extract food items
    const foodItems = [];
    const lines = foodData.split('\n');
    let currentFood = null;
    
    for (const line of lines) {
      if (line.match(/^\d+\.\s+(.+)/) || line.match(/^- (.+)/)) {
        const name = line.replace(/^\d+\.\s+|-\s+/, '').split('-')[0].trim();
        if (name && name.length > 0) {
          currentFood = {
            name: name,
            type: "Local Specialty",
            description: "",
            price_range: "₱100 - ₱300",
            location_id: destination.id, // This will be set after destination is saved
            tags: ["Local", "Traditional", destination.name],
            image: "",
          };
          foodItems.push(currentFood);
        }
      } else if (currentFood && line.trim().length > 0) {
        currentFood.description += line + " ";
      }
    }
    
    // Save food items to database
    for (const food of foodItems) {
      await databaseService.saveFoodItem(food);
    }
    
    return foodItems;
  } catch (error) {
    console.error("Error generating foods:", error);
    return [];
  }
};
