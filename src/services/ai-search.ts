
// Real AI search service integrated with Gemini API

import { generatePlaceDetails, generateTravelRecommendations } from "./gemini-api";

type SearchResult = {
  id: string;
  name: string;
  location: string;
  image: string;
  type: "destination" | "activity" | "business";
  relevanceScore: number;
  description: string;
  tags: string[];
};

export async function enhancedSearch(query: string, filters: Record<string, any> = {}): Promise<SearchResult[]> {
  try {
    // Process the query to determine what type of content to fetch
    const queryLower = query.toLowerCase();
    
    // Determine the most likely content type based on the query
    let contentType = "destination";
    if (queryLower.includes("food") || queryLower.includes("eat") || queryLower.includes("restaurant")) {
      contentType = "business";
    } else if (queryLower.includes("activity") || queryLower.includes("tour") || queryLower.includes("do")) {
      contentType = "activity";
    }
    
    // Generate dynamic content based on search query
    let response;
    if (contentType === "business") {
      response = await generatePlaceDetails({
        location: "Philippines",
        placeType: "restaurant",
        description: query
      });
    } else if (contentType === "activity") {
      response = await generatePlaceDetails({
        location: "Philippines",
        placeType: "activity",
        description: query
      });
    } else {
      response = await generateTravelRecommendations({
        location: "Philippines",
        preferences: query
      });
    }
    
    // Parse response (this would need more robust handling in a production app)
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (e) {
      // If not valid JSON, create a simple result based on the text
      return [{
        id: crypto.randomUUID(),
        name: query.charAt(0).toUpperCase() + query.slice(1),
        location: "Philippines",
        image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
        type: contentType as any,
        relevanceScore: 0.85,
        description: response.substring(0, 200),
        tags: [contentType, "AI Generated", "Philippines"]
      }];
    }
    
    // Transform the response into SearchResult format
    if (Array.isArray(parsedResponse)) {
      return parsedResponse.map(item => ({
        id: crypto.randomUUID(),
        name: item.name || "Unknown",
        location: item.location || "Philippines",
        image: item.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
        type: contentType as any,
        relevanceScore: item.relevanceScore || Math.random() * 0.3 + 0.7, // Generate a random score between 0.7 and 1.0
        description: item.description || "",
        tags: item.tags || [contentType, "AI Generated"]
      }));
    } else {
      return [{
        id: crypto.randomUUID(),
        name: parsedResponse.name || query.charAt(0).toUpperCase() + query.slice(1),
        location: parsedResponse.location || "Philippines",
        image: parsedResponse.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
        type: contentType as any,
        relevanceScore: parsedResponse.relevanceScore || 0.85,
        description: parsedResponse.description || "",
        tags: parsedResponse.tags || [contentType, "AI Generated", "Philippines"]
      }];
    }
  } catch (error) {
    console.error("Error in AI search:", error);
    throw new Error("Failed to perform AI search. Please try again.");
  }
}
