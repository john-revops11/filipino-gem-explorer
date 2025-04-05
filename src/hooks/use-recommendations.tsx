
import { useState, useEffect } from "react";
import { generateTravelRecommendations, generatePlaceDetails } from "@/services/gemini-api";

type Recommendation = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  score: number;
};

export function useRecommendations(destinationId?: string) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      
      try {
        // Generate AI recommendations based on destination
        const destination = destinationId || "Philippines";
        
        // Generate recommendations using AI
        const recommendationsData = await generateTravelRecommendations({
          location: destination,
          preferences: "cultural experiences, hidden gems, local cuisine"
        });
        
        // Try to parse as JSON
        let parsedData;
        try {
          parsedData = JSON.parse(recommendationsData);
        } catch (e) {
          // If parsing fails, generate place details instead
          const placesData = await generatePlaceDetails({
            location: destination,
            placeType: "attraction",
            description: "hidden gems, local experiences"
          });
          
          try {
            parsedData = JSON.parse(placesData);
          } catch (e) {
            // If all parsing fails, create basic recommendations
            parsedData = {
              recommendations: [
                {
                  title: `Visit ${destination}`,
                  description: "AI generated recommendation based on your preferences",
                  image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
                  link: "/explore",
                  score: 0.9
                }
              ]
            };
          }
        }
        
        // Transform data into recommendations format
        let transformedRecommendations: Recommendation[] = [];
        
        if (Array.isArray(parsedData)) {
          transformedRecommendations = parsedData.map((item, index) => ({
            id: `rec${index + 1}`,
            title: item.name || item.title || `${destination} Recommendation`,
            description: item.description || "AI generated recommendation",
            image: item.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
            link: `/explore?q=${encodeURIComponent(item.name || item.title || destination)}`,
            score: item.score || 0.8 - (index * 0.05)
          }));
        } else if (parsedData.recommendations) {
          transformedRecommendations = parsedData.recommendations.map((item: any, index: number) => ({
            id: `rec${index + 1}`,
            title: item.name || item.title || `${destination} Recommendation`,
            description: item.description || "AI generated recommendation",
            image: item.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
            link: `/explore?q=${encodeURIComponent(item.name || item.title || destination)}`,
            score: item.score || 0.8 - (index * 0.05)
          }));
        } else {
          transformedRecommendations = [{
            id: "rec1",
            title: parsedData.name || `Visit ${destination}`,
            description: parsedData.description || "AI generated recommendation based on your preferences",
            image: parsedData.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
            link: `/explore?q=${encodeURIComponent(destination)}`,
            score: parsedData.score || 0.9
          }];
        }
        
        setRecommendations(transformedRecommendations.slice(0, 3)); // Limit to 3 recommendations
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        // Set empty recommendations in case of error
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [destinationId]);
  
  return { recommendations, isLoading };
}
