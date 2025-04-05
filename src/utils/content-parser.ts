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

// Helper function to extract date information from a section title
const extractDateInfo = (title: string): string | undefined => {
  // Match patterns like "Day 1 (April 15)" or "Day 1 - April 15, 2025" or just a date
  const datePatterns = [
    /\(([A-Za-z]+\s+\d+(?:-\d+)?(?:,\s+\d{4})?)\)/i,       // (April 15-19, 2025)
    /\s+-\s+([A-Za-z]+\s+\d+(?:-\d+)?(?:,\s+\d{4})?)/i,    // - April 15, 2025
    /([A-Za-z]+\s+\d+(?:-\d+)?(?:,\s+\d{4})?)/i,           // April 15, 2025
    /(\d{1,2}\/\d{1,2}\/\d{2,4})/i                          // 15/04/2025
  ];
  
  for (const pattern of datePatterns) {
    const match = title.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return undefined;
};

// Helper function to extract time from text
const extractTime = (text: string): string => {
  const timePatterns = [
    /(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))/i,   // 8:00 AM
    /(\d{1,2}\s*(?:AM|PM|am|pm))/i          // 8 AM
  ];
  
  for (const pattern of timePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  // Check for Morning, Afternoon, Evening, Night
  if (text.match(/morning/i)) return "Morning";
  if (text.match(/afternoon/i)) return "Afternoon";
  if (text.match(/evening/i)) return "Evening";
  if (text.match(/night/i)) return "Night";
  
  return "Flexible";
};

// Helper function to extract duration from text
const extractDuration = (text: string): string | undefined => {
  const durationPatterns = [
    /Duration:\s*([^.]+)/i,
    /(\d+(?:-\d+)?\s*(?:hour|hr|minute|min|day)s?)/i,
    /takes\s+(\d+(?:-\d+)?\s*(?:hour|hr|minute|min|day)s?)/i,
    /about\s+(\d+(?:-\d+)?\s*(?:hour|hr|minute|min|day)s?)/i,
    /approximately\s+(\d+(?:-\d+)?\s*(?:hour|hr|minute|min|day)s?)/i
  ];
  
  for (const pattern of durationPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return undefined;
};

// Helper function to extract entrance fee from text
const extractEntranceFee = (text: string): string | undefined => {
  const feePatterns = [
    /(?:Entrance Fee|Entry Fee|Cost|Price|Fee):\s*([\₱\$\€]?\s*\d+(?:-\d+)?(?:\s*(?:PHP|USD|EUR))?)/i,
    /([\₱\$\€]\s*\d+(?:-\d+)?(?:\s*(?:PHP|USD|EUR))?)/i,
    /(\d+\s*(?:PHP|USD|EUR))/i
  ];
  
  for (const pattern of feePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return undefined;
};

// New helper function to parse itinerary content into structured format with more details
export const parseItineraryContent = (content: string, destination: string) => {
  if (!content || content.trim() === '') {
    return {
      title: `${destination} Itinerary`,
      sections: []
    };
  }
  
  try {
    const lines = content.split('\n');
    const extractedSections: any[] = [];
    let currentSection: any = null;
    let currentPlace: any = null;
    
    // Extract itinerary title from first line if it exists
    let itineraryTitle = `${destination} Itinerary`;
    if (lines[0] && (lines[0].startsWith('# ') || lines[0].startsWith('## '))) {
      itineraryTitle = lines[0].replace(/^#+ /, '').trim();
    }
    
    // Common patterns in itinerary content for section headers
    const sectionPatterns = [
      /^## (.+)/,                                // ## Day 1
      /\*\*Day \d+[:\-–]?\s*(.+?)\*\*/i,        // **Day 1: Arrival...**
      /^Day \d+[:\-–]?\s*(.+)/i,                // Day 1: Exploring
      /^Morning|^Afternoon|^Evening|^Night/i,    // Morning section
      /^\*\*(.+?)\*\*/,                         // **Section Title**
      /^\d+[:.]\s+Day \d+/                      // 1. Day 1
    ];
    
    // Loop through all lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Try to identify section headers
      const isSectionHeader = sectionPatterns.some(pattern => pattern.test(line));
      
      if (isSectionHeader) {
        if (currentSection && currentSection.places && currentSection.places.length > 0) {
          extractedSections.push(currentSection);
        }
        
        let sectionTitle = line
          .replace(/^##\s+/, '')
          .replace(/^\*\*|\*\*$/g, '')
          .replace(/^\d+[:.]\s+/, '')
          .trim();
        
        // Extract date information from the section title if present
        const dateInfo = extractDateInfo(sectionTitle);
        
        currentSection = {
          title: sectionTitle,
          description: "Explore and enjoy the local attractions",
          date: dateInfo,
          places: []
        };
      
      // Process bullet points for places/activities
      } else if (line.startsWith('*')) {
        const bulletMatch = line.match(/\*\s+(.*)/); // Match the bullet point content
        
        if (bulletMatch && currentSection) {
          let placeLine = bulletMatch[1];
          
          // Extract time
          let time = extractTime(placeLine);
          
          // Clean up the placeName
          let placeName = placeLine
            .replace(/^\*\*([^*]+)\*\*/, '$1')              // Extract text between ** **
            .replace(/\*\*([^*]+)\*\*/, '$1')               // Extract any remaining ** **
            .replace(new RegExp(time, 'i'), '')             // Remove the time
            .replace(/^\s*[:-]\s*/, '')                     // Remove leading colons or dashes
            .trim();
          
          // If the place name is hidden in formatting
          if (placeName.includes('**')) {
            const nameMatch = placeName.match(/\*\*([^*]+)\*\*/);
            if (nameMatch) {
              placeName = nameMatch[1];
            }
          }
          
          // If placeName starts with a time indicator that wasn't properly extracted, remove it
          if (placeName.match(/^(Morning|Afternoon|Evening|Night):/i)) {
            placeName = placeName.replace(/^(Morning|Afternoon|Evening|Night):\s*/i, '');
          }
              
          // Extract entrance fee if present
          let entranceFee = extractEntranceFee(placeLine);
          
          // Extract duration if present
          let duration = extractDuration(placeLine);
          
          // Look ahead for a description in the next lines
          let description = placeLine;
          let j = i + 1;
          let descriptionLines = [];
          
          while (j < lines.length && !lines[j].trim().startsWith('*') && !sectionPatterns.some(pattern => pattern.test(lines[j]))) {
            const nextLine = lines[j].trim();
            if (nextLine) {
              descriptionLines.push(nextLine);
              
              // Try to extract entrance fee if not found yet
              if (!entranceFee) {
                entranceFee = extractEntranceFee(nextLine);
              }
              
              // Try to extract duration if not found yet
              if (!duration) {
                duration = extractDuration(nextLine);
              }
            }
            j++;
          }
          
          // Update the description
          if (descriptionLines.length > 0) {
            description += ' ' + descriptionLines.join(' ');
          }
          
          // Clean up the description
          description = description
            .replace(placeName, '')
            .replace(/^\s*[:-]\s*/, '')
            .replace(time, '')
            .trim();
          
          // Generate image URL
          const imageUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(placeName + "," + destination)}`;
          
          // Only add if we have a valid place name
          if (placeName && placeName.length > 1) {
            currentPlace = {
              name: placeName,
              time: time,
              description: description,
              entranceFee: entranceFee,
              duration: duration,
              imageUrl: imageUrl
            };
            
            currentSection.places.push(currentPlace);
          }
        }
      
      // Process line as additional info for current place
      } else if (currentPlace && !sectionPatterns.some(pattern => pattern.test(line))) {
        // Add more information to the current place
        currentPlace.description += " " + line;
        
        // Try to extract entrance fee if not found yet
        if (!currentPlace.entranceFee) {
          currentPlace.entranceFee = extractEntranceFee(line);
        }
        
        // Try to extract duration if not found yet
        if (!currentPlace.duration) {
          currentPlace.duration = extractDuration(line);
        }
      }
    }
    
    // Add the last section if it exists
    if (currentSection && currentSection.places && currentSection.places.length > 0) {
      extractedSections.push(currentSection);
    }
    
    // If no sections were found but we have content, create a default section
    if (extractedSections.length === 0 && content.length > 0) {
      return {
        title: itineraryTitle,
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
      title: itineraryTitle,
      sections: extractedSections
    };
  } catch (error) {
    console.error("Error parsing itinerary content:", error);
    return {
      title: `${destination} Itinerary`,
      sections: []
    };
  }
};
