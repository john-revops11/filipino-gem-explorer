
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (for security reasons)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export async function generateItinerary(
  destination: string,
  days: number,
  preferences?: string,
  dateInfo?: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Convert markdown to HTML
    return text;
  } catch (error) {
    console.error("Error generating itinerary with Gemini:", error);
    throw new Error("Failed to generate itinerary");
  }
}

// Add these new functions that are being imported in various files

export async function answerTravelQuestion(
  prompt: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error answering travel question with Gemini:", error);
    throw new Error("Failed to answer travel question");
  }
}

export async function generateTravelRecommendations(
  options: { location?: string, preferences?: string }
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Provide travel recommendations for ${options.location || "Philippines"}.
      ${options.preferences ? `Preferences: ${options.preferences}` : ''}
      
      Include key attractions, best times to visit, and cultural insights.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating travel recommendations with Gemini:", error);
    throw new Error("Failed to generate recommendations");
  }
}

export async function generatePhilippinesDestinationProfile(
  options: { location: string, region?: string, description?: string }
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
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
    return response.text();
  } catch (error) {
    console.error("Error generating destination profile with Gemini:", error);
    throw new Error("Failed to generate destination profile");
  }
}

export async function generatePlaceDetails(
  options: { location: string, placeType: string, description?: string }
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
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
    return response.text();
  } catch (error) {
    console.error("Error generating place details with Gemini:", error);
    throw new Error("Failed to generate place details");
  }
}

export async function generateFoodCuisineInfo(
  options: { location: string, cuisine?: string }
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
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
    return response.text();
  } catch (error) {
    console.error("Error generating food information with Gemini:", error);
    throw new Error("Failed to generate food information");
  }
}

export async function generateToursAndEvents(
  options: { location: string, eventType: string, date?: string, description?: string }
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Generate information about ${options.eventType} in ${options.location}, Philippines.
      ${options.date ? `Time period: ${options.date}` : ''}
      ${options.description ? `Known highlights: ${options.description}` : ''}
      
      Format as JSON with the following structure:
      {
        "name": "Event Name",
        "type": "${options.eventType}",
        "description": "Detailed description",
        "location": "${options.location}",
        "date": "${options.date || 'Year-round'}",
        "tags": ["tag1", "tag2"]
      }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating tours and events with Gemini:", error);
    throw new Error("Failed to generate tours and events");
  }
}
