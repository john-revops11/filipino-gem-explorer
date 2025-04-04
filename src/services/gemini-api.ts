
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Note: In a production app, you would store this in environment variables
// The API key below is a placeholder and should be replaced with your actual API key
const API_KEY = "YOUR_GEMINI_API_KEY"; 

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(API_KEY);

// Safety settings to avoid harmful content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Create a function to generate travel recommendations based on user preferences
export async function generateTravelRecommendations(preferences: {
  location?: string;
  interests?: string[];
  budget?: string;
  duration?: string;
  travelStyle?: string;
}): Promise<any> {
  try {
    // Format the prompt based on user preferences
    const prompt = `Act as a Filipino travel expert and recommend destinations in the Philippines based on these preferences:
    ${preferences.location ? `Location preference: ${preferences.location}` : ''}
    ${preferences.interests ? `Interests: ${preferences.interests.join(', ')}` : ''}
    ${preferences.budget ? `Budget: ${preferences.budget}` : ''}
    ${preferences.duration ? `Trip duration: ${preferences.duration}` : ''}
    ${preferences.travelStyle ? `Travel style: ${preferences.travelStyle}` : ''}
    
    Provide three specific destinations with a brief description, key attractions, best time to visit, and estimated costs.`;

    // Get the model and start the generation process
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      },
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating travel recommendations:", error);
    throw error;
  }
}

// Create a function to generate detailed itineraries
export async function generateItinerary(destination: string, days: number, preferences: string): Promise<any> {
  try {
    const prompt = `Create a detailed ${days}-day itinerary for ${destination} in the Philippines. 
    Consider these preferences: ${preferences}.
    For each day, include:
    - Morning activities
    - Afternoon activities
    - Evening activities
    - Recommended local food to try
    - Estimated costs
    - Travel tips`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1500,
      },
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
}

// Create a function to analyze and answer travel questions
export async function answerTravelQuestion(question: string): Promise<any> {
  try {
    const prompt = `As a Filipino travel expert, please answer this travel question about the Philippines:
    
    ${question}
    
    Provide a helpful, informative answer based on local knowledge and travel expertise.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 600,
      },
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error answering travel question:", error);
    throw error;
  }
}

export { genAI };
