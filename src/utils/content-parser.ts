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
        image: item.image || `https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80`,
      }));
    } else if (typeof jsonData === 'object') {
      return [{
        name: jsonData.name || "Unknown Destination",
        region: jsonData.region || "Philippines",
        description: jsonData.description || jsonData.overview || "",
        tags: jsonData.tags || ["Generated", "AI"],
        image: jsonData.image || `https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80`,
      }];
    }
  } catch (e) {
    // Not JSON, proceed with text parsing
  }
  
  // Simple parsing logic - real implementation would be more robust
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
          image: `https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80`,
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
        food.image = "https://images.unsplash.com/photo-1518130155837-56c9ce8caa1a?auto=format&fit=crop&w=800&q=80";
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
    
    // If parsing fails, try to extract information from text
    const places = [];
    const lines = text.split('\n');
    let currentPlace = null;
    
    for (const line of lines) {
      if (line.match(/^\d+\.\s+(.+)/) || line.match(/^#\s+(.+)/) || line.match(/^##\s+(.+)/)) {
        if (places.length < count) {
          const nameMatch = line.match(/^\d+\.\s+(.+)/) || line.match(/^#\s+(.+)/) || line.match(/^##\s+(.+)/);
          const name = nameMatch ? nameMatch[1].trim() : "Unknown Place";
          
          currentPlace = {
            name: name,
            type: "Attraction",
            description: "",
            location: "Philippines",
            tags: ["Generated", "AI"],
          };
          
          places.push(currentPlace);
        }
      } else if (currentPlace && line.trim()) {
        currentPlace.description += line + " ";
      }
    }
    
    return places;
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
    
    // If parsing fails, try to extract information from text
    const events = [];
    const lines = text.split('\n');
    let currentEvent = null;
    
    for (const line of lines) {
      if (line.match(/^\d+\.\s+(.+)/) || line.match(/^#\s+(.+)/) || line.match(/^##\s+(.+)/)) {
        if (events.length < count) {
          const nameMatch = line.match(/^\d+\.\s+(.+)/) || line.match(/^#\s+(.+)/) || line.match(/^##\s+(.+)/);
          const name = nameMatch ? nameMatch[1].trim() : "Unknown Event";
          
          currentEvent = {
            name: name,
            type: "Festival",
            description: "",
            location: "Philippines",
            date: "Annual event",
            tags: ["Generated", "AI"],
          };
          
          events.push(currentEvent);
        }
      } else if (currentEvent && line.trim()) {
        currentEvent.description += line + " ";
      }
    }
    
    return events;
  }
};

// New helper function to parse itinerary content into structured format
export const parseItineraryContent = (content: string, destination: string) => {
  if (!content || content.trim() === '') {
    return {
      title: `${destination} Itinerary`,
      sections: []
    };
  }
  
  try {
    const lines = content.split('\n');
    const sections = [];
    let currentSection = null;
    let currentPlace = null;
    
    // Common patterns in itinerary content
    const sectionPatterns = [
      /^## (.+)/,                    // ## Day 1
      /^Day \d+[:\-–]?\s*(.+)/i,     // Day 1: Exploring
      /^Morning|^Afternoon|^Evening|^Night/i,  // Morning section
      /^\*\*(.+?)\*\*/,               // **Section Title**
      /^\d+[:.]\s+Day \d+/            // 1. Day 1
    ];
    
    const timePatterns = [
      /(\d{1,2}:\d{2}\s*(AM|PM))/i,   // 8:00 AM
      /(\d{1,2}\s*(AM|PM))/i          // 8 AM
    ];
    
    lines.forEach(line => {
      line = line.trim();
      if (!line) return;
      
      // Try to identify section headers
      const isSectionHeader = sectionPatterns.some(pattern => pattern.test(line));
      
      if (isSectionHeader) {
        if (currentSection && currentSection.places && currentSection.places.length > 0) {
          sections.push(currentSection);
        }
        
        let sectionTitle = line
          .replace(/^##\s+/, '')
          .replace(/^\*\*|\*\*$/g, '')
          .replace(/^\d+[:.]\s+/, '')
          .trim();
        
        currentSection = {
          title: sectionTitle,
          description: "Explore and enjoy the local attractions",
          places: []
        };
      
      // Try to identify places with times
      } else {
        let timeMatch = null;
        for (const pattern of timePatterns) {
          timeMatch = line.match(pattern);
          if (timeMatch) break;
        }
        
        if (timeMatch && currentSection) {
          const time = timeMatch[1];
          
          // Extract place name - usually follows the time or bullets
          let placeName = line
            .replace(/^\*\s+|\*\s+|\*\*|\*\*$|^-\s+/g, '')  // Remove bullets and stars
            .replace(timeMatch[0], '')                      // Remove the time
            .replace(/:/g, '')                              // Remove colons
            .trim();
            
          // If the place name starts with a verb like "Visit", remove it
          placeName = placeName.replace(/^(Visit|Explore|Go to|Check out|Head to|Stop by)\s+/i, '');
          
          // Clean up the name if it's too long - take the first part
          if (placeName.length > 60) {
            const parts = placeName.split(':');
            if (parts.length > 1) {
              placeName = parts[0].trim();
            } else {
              placeName = placeName.substring(0, 60) + '...';
            }
          }
          
          if (placeName && placeName.length > 1) {
            currentPlace = {
              name: placeName,
              time: time,
              description: "",
              imageUrl: `https://source.unsplash.com/featured/?${encodeURIComponent(placeName + "," + destination)}`
            };
            currentSection.places.push(currentPlace);
          }
        
        // Add description to the current place
        } else if (currentPlace && line && !line.startsWith('#') && !line.startsWith('*')) {
          currentPlace.description += (currentPlace.description ? " " : "") + line;
          
          // Try to extract entrance fee if mentioned
          if (line.match(/entrance fee|cost|price|fee/i)) {
            const feeMatch = line.match(/[\₱\$\€]?\s*\d+[\-\–]?\d*/i);
            if (feeMatch) {
              currentPlace.entranceFee = feeMatch[0];
            }
          }
        }
      }
    });
    
    // Add the last section if it exists
    if (currentSection && currentSection.places && currentSection.places.length > 0) {
      sections.push(currentSection);
    }
    
    // If no sections were created but we have content, create a default section
    if (sections.length === 0 && content.length > 0) {
      return {
        title: `${destination} Highlights`,
        sections: [{
          title: `${destination} Highlights`,
          description: "Key attractions and experiences",
          places: [{
            name: destination,
            time: "Flexible",
            description: content.substring(0, 200) + "...",
            imageUrl: `https://source.unsplash.com/featured/?${encodeURIComponent(destination + ",travel")}`
          }]
        }]
      };
    }
    
    return {
      title: `${destination} Itinerary`,
      sections: sections
    };
  } catch (error) {
    console.error("Error parsing itinerary content:", error);
    return {
      title: `${destination} Itinerary`,
      sections: []
    };
  }
};
