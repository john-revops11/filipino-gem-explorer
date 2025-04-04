import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (for security reasons)
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

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
