
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key (directly using the provided key)
const genAI = new GoogleGenerativeAI("AIzaSyCxILwyPFK5D8DrD7T0hJHs2ieV-SpDfZU");

export async function generateItinerary(
  destination: string,
  days: number,
  preferences?: string,
  dateInfo?: string
): Promise<string> {
  try {
    console.log(`Generating itinerary for ${destination} for ${days} days`);
    // Update: Use gemini-1.5-pro instead of gemini-pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Create a more detailed prompt incorporating travel dates if provided
    const dateContext = dateInfo ? 
      `The trip will be ${dateInfo}. Please consider seasonal activities, weather conditions, and any special events happening during this time.` : 
      '';

    const prompt = `
      Create a detailed ${days}-day travel itinerary for ${destination} in the Philippines.
      ${dateContext}
      
      ${preferences ? `Travel preferences: ${preferences}` : ''}
      
      Requirements:
      1. Format the itinerary day by day with clear headings and bullet points.
      2. Include specific recommendations for local food, attractions, and cultural experiences.
      3. Provide estimated costs when possible (in PHP).
      4. Suggest transportation options between locations.
      5. Include at least one "hidden gem" or less-known attraction.
      6. Format the response in Markdown with clear sections.
      
      The response should be comprehensive but concise, focusing on practical information.
    `;

    console.log("Sending prompt to Gemini API");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Received response from Gemini API, length:", text.length);
    
    if (!text || text.trim().length === 0) {
      throw new Error("Received empty response from Gemini API");
    }

    return text;
  } catch (error) {
    console.error("Error generating itinerary with Gemini:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate itinerary: ${error.message}`);
    } else {
      throw new Error("Failed to generate itinerary due to an unknown error");
    }
  }
}

export async function answerTravelQuestion(
  prompt: string
): Promise<string> {
  try {
    // Update: Use gemini-1.5-pro instead of gemini-pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error("Received empty response from Gemini API");
    }
    
    return text;
  } catch (error) {
    console.error("Error answering travel question with Gemini:", error);
    throw new Error("Failed to answer travel question");
  }
}

export async function generateTravelRecommendations(
  options: { location?: string, preferences?: string }
): Promise<string> {
  try {
    // Update: Use gemini-1.5-pro instead of gemini-pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `
      Provide travel recommendations for ${options.location || "Philippines"}.
      ${options.preferences ? `Preferences: ${options.preferences}` : ''}
      
      Include key attractions, best times to visit, and cultural insights.
      
      Format the response as a JSON array with the following structure:
      [
        {
          "name": "Destination Name",
          "description": "Detailed description of the place and why it's recommended.",
          "image": "",
          "tags": ["tag1", "tag2"],
          "score": 0.95
        }
      ]
      
      Return at least 3 recommendations.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error("Received empty response from Gemini API");
    }
    
    return text;
  } catch (error) {
    console.error("Error generating travel recommendations with Gemini:", error);
    throw new Error("Failed to generate recommendations");
  }
}

export async function generatePhilippinesDestinationProfile(
  options: { location: string, region?: string, description?: string }
): Promise<string> {
  try {
    // Update: Use gemini-1.5-pro instead of gemini-pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `
      Generate a detailed profile for ${options.location} in the Philippines.
      ${options.region ? `Region: ${options.region}` : ''}
      ${options.description ? `Known for: ${options.description}` : ''}
      
      Include information on geography, cultural significance, key attractions, 
      and other relevant details. Format as JSON with the following structure:
      {
        "name": "Destination Name",
        "region": "Region",
        "description": "Detailed description",
        "tags": ["tag1", "tag2"]
      }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error("Received empty response from Gemini API");
    }
    
    return text;
  } catch (error) {
    console.error("Error generating destination profile with Gemini:", error);
    throw new Error("Failed to generate destination profile");
  }
}

export async function generatePlaceDetails(
  options: { location: string, placeType: string, description?: string }
): Promise<string> {
  try {
    // Update: Use gemini-1.5-pro instead of gemini-pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `
      Generate detailed information about ${options.placeType} places in ${options.location}, Philippines.
      ${options.description ? `Focus on: ${options.description}` : ''}
      
      Format as JSON with the following structure:
      {
        "name": "Place Name",
        "type": "${options.placeType}",
        "description": "Detailed description",
        "location": "${options.location}",
        "tags": ["tag1", "tag2"]
      }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error("Received empty response from Gemini API");
    }
    
    return text;
  } catch (error) {
    console.error("Error generating place details with Gemini:", error);
    throw new Error("Failed to generate place details");
  }
}

export async function generateFoodCuisineInfo(
  options: { location: string, cuisine?: string }
): Promise<string> {
  try {
    // Update: Use gemini-1.5-pro instead of gemini-pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `
      Generate information about ${options.cuisine || "local"} cuisine in ${options.location}, Philippines.
      
      Format as JSON with the following structure:
      {
        "name": "Food Name",
        "type": "Food Type",
        "description": "Detailed description",
        "price_range": "Price Range",
        "tags": ["tag1", "tag2"]
      }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error("Received empty response from Gemini API");
    }
    
    return text;
  } catch (error) {
    console.error("Error generating food information with Gemini:", error);
    throw new Error("Failed to generate food information");
  }
}

export async function generateToursAndEvents(
  options: { location: string, eventType: string, date?: string, description?: string }
): Promise<string> {
  try {
    // Update: Use gemini-1.5-pro instead of gemini-pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `
      Generate information about ${options.eventType} in ${options.location}, Philippines.
      ${options.date ? `Time period: ${options.date}` : ''}
      ${options.description ? `Known highlights: ${options.description}` : ''}
      
      Format as JSON with the following structure:
      [
        {
          "name": "Event Name",
          "type": "${options.eventType}",
          "description": "Detailed description",
          "location": "${options.location}",
          "date": "${options.date || 'Year-round'}",
          "tags": ["tag1", "tag2"]
        }
      ]
      
      Return at least 3 events or tours. Don't include image URLs, we'll handle those separately.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error("Received empty response from Gemini API");
    }
    
    return text;
  } catch (error) {
    console.error("Error generating tours and events with Gemini:", error);
    throw new Error("Failed to generate tours and events");
  }
}
