
// Fallback content in case the API fails

export const getFallbackItinerary = (destination: string, days: number): string => {
  // Format days value
  const daysNum = typeof days === 'string' ? parseInt(days) : days;
  
  // Default empty destination text
  const destinationText = destination ? destination : "Your Philippine Destination";
  
  return `# ${daysNum}-Day Itinerary for ${destinationText}, Philippines

## Day 1: Arrival and Orientation

* **Morning**: Arrive at ${destinationText} and check into your accommodation
* **Afternoon**: Take a walking tour of the main area to get oriented
* **Evening**: Try local cuisine at a nearby restaurant (₱150-300)

## Day 2: Cultural Exploration

* **Morning**: Visit the most popular attraction in ${destinationText}
* **Afternoon**: Lunch at a local eatery featuring traditional Filipino dishes
* **Evening**: Watch a cultural performance or visit a night market

${daysNum > 2 ? `
## Day 3: Hidden Gems

* **Morning**: Visit a local market to experience everyday Filipino life
* **Afternoon**: Discover a hidden gem location recommended by locals
* **Evening**: Dinner with local specialties at a family-owned restaurant (₱200-400)
` : ''}

${daysNum > 3 ? `
## Day 4: Nature and Adventure

* **Morning**: Hiking or nature activity in the surrounding area
* **Afternoon**: Visit a lesser-known beach or waterfall 
* **Evening**: Fresh seafood dinner at a beachside restaurant (₱300-500)
` : ''}

${daysNum > 4 ? `
## Day 5: Island Hopping or Countryside Tour

* **Morning**: Begin your day trip to nearby islands or countryside
* **Afternoon**: Lunch at a floating restaurant or rustic eatery
* **Evening**: Relaxed dinner and reflection on your experiences
` : ''}

## Transportation
* Local tricycles within town (₱20-50 per ride)
* Jeepneys for longer distances (₱15-30 per ride)
* Consider renting a scooter for greater flexibility (₱500-800 per day)

## Local Tips
* Most attractions open around 8-9 AM and close by 5-6 PM
* Bring cash as many small establishments don't accept cards
* Learn a few basic Filipino phrases like "Salamat" (Thank you)
* Try the local street food but ensure it's freshly prepared

## Hidden Gem
* Visit the lesser-known ${destinationText} viewpoint where locals often gather for sunset

*This is a basic itinerary template. For a personalized experience, chat with our AI assistant for real-time recommendations.*`;
};

export const getFallbackDestinationProfile = (location: string): string => {
  const defaultLocation = location || "Philippine Destination";
  
  return JSON.stringify({
    name: defaultLocation,
    region: "Philippines",
    description: `${defaultLocation} is a beautiful destination in the Philippines known for its natural beauty, cultural significance, and warm hospitality. Visitors can experience authentic Filipino culture through local cuisine, traditional performances, and interactions with friendly locals.`,
    known_for: ["Natural Beauty", "Cultural Heritage", "Local Cuisine"],
    best_time_to_visit: "November to April (Dry Season)",
    tags: ["Philippines", "Travel", "Cultural Experience", "Local Gems"]
  });
};

export const getFallbackFoodInfo = (location: string): string => {
  const defaultLocation = location || "this region";
  
  return JSON.stringify({
    name: "Local Specialty",
    type: "Traditional Filipino",
    description: `A popular dish from ${defaultLocation} that combines fresh local ingredients with traditional Filipino cooking methods. Known for its unique flavors that represent the diverse culinary heritage of the Philippines.`,
    price_range: "₱100-300",
    best_places_to_try: ["Local Family Restaurants", "Traditional Eateries", "Food Markets"],
    ingredients: ["Fresh Local Produce", "Traditional Filipino Spices"],
    tags: ["Local Cuisine", "Traditional", "Must-Try", defaultLocation]
  });
};

export const getFallbackEventInfo = (location: string, eventType: string): string => {
  const defaultLocation = location || "this region";
  const defaultEventType = eventType || "Festival";
  
  return JSON.stringify({
    name: `${defaultLocation} ${defaultEventType}`,
    type: defaultEventType,
    description: `A ${defaultEventType.toLowerCase()} that celebrates the culture and traditions of ${defaultLocation}. Visitors can experience authentic Filipino hospitality, traditional performances, local cuisine, and cultural displays that showcase the rich heritage of the region.`,
    location: defaultLocation,
    date: "Annual event (check local calendar for specific dates)",
    activities: ["Cultural Performances", "Traditional Food Tasting", "Local Crafts Exhibition"],
    tags: [defaultEventType, defaultLocation, "Cultural Experience", "Local Tradition"]
  });
};

export const getFallbackPlaceInfo = (location: string, placeType: string): string => {
  const defaultLocation = location || "the area";
  const defaultPlaceType = placeType || "Attraction";
  
  return JSON.stringify({
    name: `${defaultLocation} ${defaultPlaceType}`,
    type: defaultPlaceType,
    description: `A beautiful ${defaultPlaceType.toLowerCase()} in ${defaultLocation} that showcases the natural beauty and cultural heritage of the Philippines. Visitors can enjoy authentic experiences while supporting the local community.`,
    location: defaultLocation,
    best_time_to_visit: "Early morning or late afternoon to avoid crowds",
    activities: ["Photography", "Cultural Learning", "Nature Appreciation"],
    local_businesses_nearby: ["Family-owned restaurants", "Artisan craft shops", "Local tour guides"],
    tags: [defaultPlaceType, defaultLocation, "Hidden Gem", "Local Experience"]
  });
};

export const getFallbackBusinessInfo = (location: string, businessType: string): string => {
  const defaultLocation = location || "local area";
  const defaultBusinessType = businessType || "Family Business";
  
  return JSON.stringify({
    name: `${defaultLocation} ${defaultBusinessType}`,
    type: defaultBusinessType,
    description: `A charming ${defaultBusinessType.toLowerCase()} in ${defaultLocation} that offers visitors an authentic Filipino experience. Run by local residents who are passionate about sharing their culture and traditions with tourists.`,
    location: defaultLocation,
    operating_hours: "8:00 AM - 6:00 PM (may vary by season)",
    specialties: ["Traditional Products", "Authentic Experiences", "Cultural Demonstrations"],
    owner_story: "Family-owned for generations, preserving local traditions and sharing them with visitors",
    tags: [defaultBusinessType, defaultLocation, "Support Local", "Cultural Experience"]
  });
};

export const getFallbackRecommendations = (userPreferences: string[]): string => {
  const defaultPreferences = userPreferences && userPreferences.length > 0 
    ? userPreferences 
    : ["Cultural", "Food", "Nature"];
  
  return JSON.stringify({
    recommendations: [
      {
        name: "Cultural Immersion Experience",
        type: "Activity",
        description: "Experience authentic Filipino culture through traditional performances, craft demonstrations, and interactions with local communities.",
        tags: ["Cultural", "Local Experience", "Traditional"]
      },
      {
        name: "Hidden Beach Cove",
        type: "Natural Attraction",
        description: "A secluded beach known only to locals, offering pristine waters and a peaceful atmosphere away from tourist crowds.",
        tags: ["Nature", "Hidden Gem", "Relaxation"]
      },
      {
        name: "Family Heritage Restaurant",
        type: "Dining",
        description: "A family-owned restaurant serving authentic Filipino recipes passed down through generations, using locally-sourced ingredients.",
        tags: ["Food", "Local Business", "Authentic Cuisine"]
      }
    ],
    matched_preferences: defaultPreferences,
    message: "Based on your interests, we've selected these hidden gems that offer authentic Filipino experiences."
  });
};

