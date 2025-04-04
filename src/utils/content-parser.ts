
import databaseService, { Location } from "@/services/database-service";
import { generateTravelRecommendations, generateFoodCuisineInfo } from "@/services/gemini-api";

// Helper function to parse destinations from generated text
export const parseDestinations = (text: string, count = 3) => {
  // First, try to parse as JSON
  try {
    const jsonData = JSON.parse(text);
    if (Array.isArray(jsonData)) {
      return jsonData.slice(0, count).map(item => ({
        name: item.name || "Unknown Destination",
        region: item.region || "Philippines",
        description: item.description || item.overview || "",
        tags: item.tags || ["Generated", "AI"],
        image: item.image || `https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80`,
      }));
    } else if (typeof jsonData === 'object') {
      return [{
        name: jsonData.name || "Unknown Destination",
        region: jsonData.region || "Philippines",
        description: jsonData.description || jsonData.overview || "",
        tags: jsonData.tags || ["Generated", "AI"],
        image: jsonData.image || `https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80`,
      }];
    }
  } catch (e) {
    // Not JSON, proceed with text parsing
  }
  
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
    if (line.match(/^\d+\.\s+(.+)/) || line.match(/^#\s+(.+)/) || line.match(/^##\s+(.+)/)) {
      // New destination found
      const nameMatch = line.match(/^\d+\.\s+(.+)/) || line.match(/^#\s+(.+)/) || line.match(/^##\s+(.+)/);
      const name = nameMatch ? nameMatch[1].split('-')[0].trim() : "Unknown Destination";
      
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
          tags: ["Generated", "AI"],
          image: `https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80`,
        };
        destinations.push(currentDestination);
      }
    } else if (currentDestination) {
      if (line.match(/Overview:/i) || line.match(/Geography:/i)) {
        currentSection = "overview";
      } else if (line.match(/History|Culture:/i)) {
        currentSection = "history";
      } else if (line.match(/Attractions:/i) || line.match(/Top Attractions:/i)) {
        currentSection = "attractions";
      } else if (line.match(/Cuisine:/i) || line.match(/Local Cuisine:/i) || line.match(/Food:/i)) {
        currentSection = "cuisine";
      } else if (line.match(/Travel Tips:/i)) {
        currentSection = "tips";
      } else if (line.trim()) {
        // Add all non-empty lines that aren't section headers to the description
        currentDestination.description += line + " ";
      }
    }
  }
  
  return destinations;
};

// Helper function to generate food items for a destination
export const generateFoodsForDestination = async (destination: any) => {
  try {
    // First check if we have an ID for the destination
    if (!destination.id) {
      console.warn("No destination ID found for food generation");
      return [];
    }
    
    const foodData = await generateFoodCuisineInfo({
      location: destination.name
    });
    
    // Try to parse the result as JSON
    let foodItems = [];
    try {
      const parsedData = JSON.parse(foodData);
      if (Array.isArray(parsedData)) {
        foodItems = parsedData;
      } else {
        foodItems = [parsedData];
      }
    } catch (e) {
      // If parsing fails, extract food items using text processing
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
              location_id: destination.id,
              tags: ["Local", "Traditional", destination.name],
              image: "",
            };
            foodItems.push(currentFood);
          }
        } else if (currentFood && line.trim().length > 0) {
          currentFood.description += line + " ";
        }
      }
    }
    
    // Save food items to database
    for (const food of foodItems) {
      // Ensure the food item has the destination ID
      food.location_id = destination.id;
      
      // Add default image if none
      if (!food.image) {
        food.image = "https://images.unsplash.com/photo-1518130155837-56c9ce8caa1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80";
      }
      
      // Ensure tags includes the destination name
      if (!food.tags) {
        food.tags = ["Local", "Traditional", destination.name];
      } else if (!food.tags.includes(destination.name)) {
        food.tags.push(destination.name);
      }
      
      await databaseService.saveFoodItem(food);
    }
    
    return foodItems;
  } catch (error) {
    console.error("Error generating foods:", error);
    return [];
  }
};

// Parse and process place data
export const parsePlaces = (text: string, count = 3) => {
  try {
    const jsonData = JSON.parse(text);
    if (Array.isArray(jsonData)) {
      return jsonData.slice(0, count);
    } else {
      return [jsonData];
    }
  } catch (e) {
    console.error("Error parsing place data:", e);
    return [];
  }
};

// Parse and process events data
export const parseEvents = (text: string, count = 3) => {
  try {
    const jsonData = JSON.parse(text);
    if (Array.isArray(jsonData)) {
      return jsonData.slice(0, count);
    } else {
      return [jsonData];
    }
  } catch (e) {
    console.error("Error parsing event data:", e);
    return [];
  }
};
