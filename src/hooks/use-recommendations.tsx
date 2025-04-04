
import { useState, useEffect } from "react";

type Recommendation = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  score: number;
};

const mockRecommendations: Record<string, Recommendation[]> = {
  "siargao": [
    {
      id: "rec1",
      title: "Cloud 9 Surfing Lessons",
      description: "Based on your interest in outdoor activities, we recommend this beginner-friendly surfing class.",
      image: "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?auto=format&fit=crop&w=800&q=80",
      link: "/bookings?activity=surf-lessons",
      score: 0.92
    },
    {
      id: "rec2",
      title: "Island Hopping Tour",
      description: "This tour visits 3 islands and matches your preference for nature exploration.",
      image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdbc75?auto=format&fit=crop&w=800&q=80",
      link: "/bookings?activity=island-tour",
      score: 0.87
    },
    {
      id: "rec3",
      title: "Local Cuisine Food Tour",
      description: "Try authentic local dishes based on your food preferences from your profile.",
      image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&q=80",
      link: "/bookings?activity=food-tour",
      score: 0.81
    }
  ],
  "banaue": [
    {
      id: "rec4",
      title: "Rice Terraces Guided Trek",
      description: "Based on your hiking experience level, this moderate trek is perfect for you.",
      image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=800&q=80",
      link: "/bookings?activity=terrace-trek",
      score: 0.94
    },
    {
      id: "rec5",
      title: "Cultural Immersion Experience",
      description: "Stay with a local Ifugao family and learn their traditional practices.",
      image: "https://images.unsplash.com/photo-1565073625772-506dfcd0a8d8?auto=format&fit=crop&w=800&q=80",
      link: "/bookings?activity=cultural-immersion",
      score: 0.89
    }
  ],
  "coron": [
    {
      id: "rec6",
      title: "Shipwreck Diving Adventure",
      description: "Perfect for your diving level, explore WWII shipwrecks in crystal clear waters.",
      image: "https://images.unsplash.com/photo-1501325087108-ae3ee3fad52f?auto=format&fit=crop&w=800&q=80",
      link: "/bookings?activity=shipwreck-diving",
      score: 0.91
    },
    {
      id: "rec7",
      title: "Hidden Lagoons Tour",
      description: "Explore secluded lagoons by kayak, matching your interest in serene nature spots.",
      image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&w=800&q=80",
      link: "/bookings?activity=lagoon-tour",
      score: 0.88
    }
  ],
  "default": [
    {
      id: "rec8",
      title: "Local Cultural Experience",
      description: "Immerse yourself in authentic Filipino culture with this highly-rated activity.",
      image: "https://images.unsplash.com/photo-1594311324557-9fc51e7adeb5?auto=format&fit=crop&w=800&q=80",
      link: "/bookings?activity=cultural-experience",
      score: 0.85
    },
    {
      id: "rec9",
      title: "Foodie Adventure Tour",
      description: "Taste the best local cuisine based on your flavor preferences.",
      image: "https://images.unsplash.com/photo-1555244896-eeab75aa1711?auto=format&fit=crop&w=800&q=80",
      link: "/bookings?activity=food-tour",
      score: 0.82
    }
  ]
};

export function useRecommendations(destinationId?: string) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call to an AI recommendation service
    // that takes into account user preferences, past behavior, etc.
    const fetchRecommendations = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get recommendations for this destination or default if none exist
      const destinationRecs = mockRecommendations[destinationId || ""] || mockRecommendations.default;
      
      setRecommendations(destinationRecs);
      setIsLoading(false);
    };
    
    fetchRecommendations();
  }, [destinationId]);
  
  return { recommendations, isLoading };
}
