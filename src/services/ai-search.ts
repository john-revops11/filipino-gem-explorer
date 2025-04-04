
// This service would connect to a real AI service in a production app
// For now, we'll use a mock implementation

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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Parse natural language query
  // In a real implementation, this would use NLP to understand user intent
  const lowercaseQuery = query.toLowerCase();
  
  // Mock results based on query patterns
  if (lowercaseQuery.includes("beach") || lowercaseQuery.includes("island")) {
    return [
      {
        id: "dest1",
        name: "Boracay Island", 
        location: "Aklan",
        image: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80",
        type: "destination",
        relevanceScore: 0.95,
        description: "Famous for its pristine white sand beaches and crystal-clear waters.",
        tags: ["Beach", "Island", "Swimming"]
      },
      {
        id: "dest2",
        name: "El Nido",
        location: "Palawan",
        image: "https://images.unsplash.com/photo-1501286353178-1ec871214838?auto=format&fit=crop&w=800&q=80",
        type: "destination",
        relevanceScore: 0.92,
        description: "Known for its stunning limestone cliffs and beautiful lagoons.",
        tags: ["Beach", "Island Hopping", "Snorkeling"]
      },
      {
        id: "act1",
        name: "Island Hopping Tour",
        location: "Various locations",
        image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdbc75?auto=format&fit=crop&w=800&q=80",
        type: "activity",
        relevanceScore: 0.87,
        description: "Explore multiple islands and hidden beaches in a day tour.",
        tags: ["Tour", "Swimming", "Boat"]
      }
    ];
  } else if (lowercaseQuery.includes("mountain") || lowercaseQuery.includes("hike") || lowercaseQuery.includes("trek")) {
    return [
      {
        id: "dest3",
        name: "Mount Pulag", 
        location: "Benguet",
        image: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=800&q=80",
        type: "destination",
        relevanceScore: 0.94,
        description: "The third highest mountain in the Philippines with its famous 'sea of clouds'.",
        tags: ["Mountain", "Hiking", "Nature"]
      },
      {
        id: "act2",
        name: "Banaue Rice Terraces Trek",
        location: "Ifugao",
        image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=800&q=80",
        type: "activity",
        relevanceScore: 0.91,
        description: "Trek through ancient rice terraces carved into the mountains.",
        tags: ["Trekking", "Cultural", "UNESCO"]
      }
    ];
  } else if (lowercaseQuery.includes("food") || lowercaseQuery.includes("cuisine") || lowercaseQuery.includes("eat")) {
    return [
      {
        id: "biz1",
        name: "Kermit Surf & Dine", 
        location: "Siargao",
        image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&q=80",
        type: "business",
        relevanceScore: 0.93,
        description: "Popular restaurant serving Filipino cuisine with a modern twist.",
        tags: ["Restaurant", "Pizza", "Local Cuisine"]
      },
      {
        id: "act3",
        name: "Manila Food Tour",
        location: "Manila",
        image: "https://images.unsplash.com/photo-1555244896-eeab75aa1711?auto=format&fit=crop&w=800&q=80",
        type: "activity",
        relevanceScore: 0.89,
        description: "Sample the best street food and local delicacies in the capital.",
        tags: ["Food Tour", "Street Food", "Culinary"]
      }
    ];
  } else if (lowercaseQuery.includes("dive") || lowercaseQuery.includes("underwater") || lowercaseQuery.includes("marine")) {
    return [
      {
        id: "dest4",
        name: "Tubbataha Reef", 
        location: "Palawan",
        image: "https://images.unsplash.com/photo-1505499695487-8f2f41a46a83?auto=format&fit=crop&w=800&q=80",
        type: "destination",
        relevanceScore: 0.96,
        description: "UNESCO World Heritage site known for its marine biodiversity.",
        tags: ["Diving", "Marine Life", "UNESCO"]
      },
      {
        id: "act4",
        name: "Coron Shipwreck Diving",
        location: "Palawan",
        image: "https://images.unsplash.com/photo-1501325087108-ae3ee3fad52f?auto=format&fit=crop&w=800&q=80",
        type: "activity",
        relevanceScore: 0.92,
        description: "Explore sunken Japanese shipwrecks from World War II.",
        tags: ["Diving", "Shipwreck", "History"]
      }
    ];
  }
  
  // Default results if no specific category is matched
  return [
    {
      id: "dest5",
      name: "Siargao Island", 
      location: "Surigao del Norte",
      image: "https://images.unsplash.com/photo-1501962973019-d9df5e025652?auto=format&fit=crop&w=800&q=80",
      type: "destination",
      relevanceScore: 0.85,
      description: "Known as the surfing capital of the Philippines.",
      tags: ["Surfing", "Beach", "Islands"]
    },
    {
      id: "dest6",
      name: "Chocolate Hills",
      location: "Bohol",
      image: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?auto=format&fit=crop&w=800&q=80",
      type: "destination",
      relevanceScore: 0.83,
      description: "Unique geological formation of over 1,200 hills.",
      tags: ["Natural Wonder", "Landmark", "Nature"]
    }
  ];
}
