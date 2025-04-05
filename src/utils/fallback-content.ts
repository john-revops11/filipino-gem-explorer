
// Fallback content in case the API fails

export const getFallbackItinerary = (destination: string, days: number): string => {
  return `# ${days}-Day Itinerary for ${destination}, Philippines

## Day 1: Arrival and Orientation

* **Morning**: Arrive at ${destination} and check into your accommodation
* **Afternoon**: Take a walking tour of the main area to get oriented
* **Evening**: Try local cuisine at a nearby restaurant

## Day 2: Main Attractions

* **Morning**: Visit the most popular attraction in ${destination}
* **Afternoon**: Lunch at a local eatery (₱150-300)
* **Evening**: Relax and enjoy sunset views

${days > 2 ? `
## Day 3: Cultural Immersion

* **Morning**: Visit a local market
* **Afternoon**: Try a local cultural activity
* **Evening**: Dinner with local specialties (₱200-400)
` : ''}

${days > 3 ? `
## Day 4: Nature and Adventure

* **Morning**: Hiking or nature activity
* **Afternoon**: Visit a hidden gem location off the tourist path
* **Evening**: Fresh seafood dinner (₱300-500)
` : ''}

## Transportation
* Local tricycles within town (₱20-50 per ride)
* Jeepneys for longer distances (₱15-30 per ride)
* Consider renting a scooter for greater flexibility (₱500-800 per day)

## Hidden Gem
* Visit the lesser-known [placeholder] area where locals often gather

*This is a basic itinerary template. For more detailed recommendations, please try generating again.*`;
};

export const getFallbackDestinationProfile = (location: string): string => {
  return JSON.stringify({
    name: location,
    region: "Philippines",
    description: `${location} is a beautiful destination in the Philippines known for its natural beauty and cultural significance.`,
    tags: ["Philippines", "Travel", "Generated"]
  });
};

export const getFallbackFoodInfo = (location: string): string => {
  return JSON.stringify({
    name: "Local Specialty",
    type: "Traditional",
    description: `A popular dish from ${location} that locals and tourists enjoy.`,
    price_range: "₱100-300",
    tags: ["Local", "Traditional", location]
  });
};

export const getFallbackEventInfo = (location: string, eventType: string): string => {
  return JSON.stringify({
    name: `${location} ${eventType}`,
    type: eventType,
    description: `A ${eventType.toLowerCase()} that celebrates the culture and traditions of ${location}.`,
    location: location,
    date: "Year-round",
    tags: [eventType, location, "Cultural"]
  });
};

export const getFallbackPlaceInfo = (location: string, placeType: string): string => {
  return JSON.stringify({
    name: `${location} ${placeType}`,
    type: placeType,
    description: `A beautiful ${placeType.toLowerCase()} in ${location} that's worth visiting.`,
    location: location,
    tags: [placeType, location, "Attraction"]
  });
};
