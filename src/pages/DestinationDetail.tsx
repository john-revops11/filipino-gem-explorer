
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Map, 
  CalendarPlus, 
  Share2, 
  Star, 
  ChevronRight, 
  MapPin,
  Clock,
  Tag,
  Info,
  Users,
  Camera,
  Sunrise,
  Cloud,
  Utensils
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DestinationCard } from "@/components/home/DestinationCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Regional destination data
const getRegionalData = (id: string) => {
  const regions: Record<string, any> = {
    // Northern Luzon
    "banaue": {
      name: "Banaue Rice Terraces",
      location: "Ifugao Province, Northern Luzon",
      description: "Known as the 'Eighth Wonder of the World', these 2,000-year-old terraces were carved into the mountains by ancestors of the indigenous people. The terraces are located approximately 1,500 meters above sea level and cover 10,360 square kilometers of mountainside.",
      culturalNotes: "The Ifugao people have preserved their traditional way of life, including ancient farming methods and rituals related to rice cultivation. The terraces are central to their cultural identity and spiritual beliefs.",
      bestTimeToVisit: "December to May (dry season)",
      localCuisine: ["Pinikpikan (traditional chicken dish)", "Kinuday (smoked meat)", "Rice wine"],
      traditionalCrafts: ["Wood carving", "Weaving", "Blacksmithing"],
      localFestivals: [
        { name: "Imbayah Festival", date: "April", description: "Celebration of the Ifugao's rich cultural heritage with traditional dances, music, and rituals." }
      ]
    },
    // Palawan
    "gem2": {
      name: "Coron Island",
      location: "Palawan Province",
      description: "Coron is known for its limestone karst landscapes, crystal-clear lagoons, and some of the best preserved coral reefs in the Philippines. The area is famous for its WWII shipwreck diving sites and stunning natural attractions including Twin Lagoon and Kayangan Lake.",
      culturalNotes: "Coron is home to the indigenous Tagbanwa people, one of the oldest ethnic groups in the Philippines. They consider the lakes and lagoons of Coron as sacred places, and traditional conservation practices have helped preserve the natural beauty of the area.",
      bestTimeToVisit: "November to May (dry season)",
      localCuisine: ["Fresh seafood", "Tamilok (woodworm delicacy)", "Crocodile sisig"],
      traditionalCrafts: ["Pearl jewelry", "Woven baskets", "Shell crafts"],
      localFestivals: [
        { name: "Pasinggatan Festival", date: "May", description: "A thanksgiving celebration for abundant marine resources with street dancing and boat races." }
      ],
      hiddenGems: [
        {
          id: "barracuda-lake",
          name: "Barracuda Lake",
          description: "A unique diving location with thermoclines where warm and cold waters meet, creating a surreal underwater experience.",
          image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&w=800&q=80"
        },
        {
          id: "siete-pecados",
          name: "Siete Pecados Marine Park",
          description: "A protected marine sanctuary with vibrant coral gardens and diverse marine life, perfect for snorkeling.",
          image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=80"
        }
      ],
      environmentalNotes: "Coron has implemented sustainable tourism practices to protect its fragile marine ecosystems. Visitors are encouraged to follow strict guidelines when snorkeling or diving to minimize damage to coral reefs."
    },
    // Cebu
    "cebu": {
      name: "Kawasan Falls",
      location: "Badian, Cebu",
      description: "Kawasan Falls is a three-stage cascade of crystal clear turquoise water flowing from the mountains of Badian. It's one of the most famous waterfalls in the Philippines, known for its stunning color and natural swimming pools.",
      culturalNotes: "The falls have long been a sacred site for locals who believe in the healing properties of the water. Traditional ceremonies are still occasionally performed in the area.",
      bestTimeToVisit: "January to April (less rainfall)",
      localCuisine: ["Lechon Cebu (roasted pig)", "Sutukil (grilled seafood)", "Dried mangoes"],
      traditionalCrafts: ["Guitar making", "Basket weaving", "Shell crafts"],
      localFestivals: [
        { name: "Sinulog Festival", date: "Third Sunday of January", description: "One of the biggest festivals in the Philippines celebrating the Santo Niño (Child Jesus) with colorful street dancing and parades." }
      ]
    },
    // Default data for other destinations
    "default": {
      name: "Siargao Island",
      location: "Surigao del Norte",
      description: "Known as the 'Surfing Capital of the Philippines', Siargao is a tear-drop shaped island in the province of Surigao del Norte. This tropical paradise is known for its pristine beaches, crystal-clear waters, and world-class waves. Beyond surfing, the island offers a range of activities from island hopping to exploring lush mangrove forests.",
      culturalNotes: "Siargao has a rich cultural heritage influenced by its history of fishing and agriculture. The local Surigaonon people are known for their warmth and hospitality. Traditional practices like the 'bayanihan' (community cooperation) are still observed, especially during festivals and community events."
    }
  };
  
  return regions[id] || regions.default;
};

const getDestinationData = (id: string) => {
  const regionalData = getRegionalData(id);
  
  return {
    id,
    name: regionalData.name,
    location: regionalData.location,
    description: regionalData.description,
    rating: 4.8,
    reviewCount: 236,
    images: [
      "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1501286353178-1ec881214838?auto=format&fit=crop&w=800&q=80",
    ],
    activities: [
      { id: "act1", name: "Cloud 9 Surfing", price: "₱500", duration: "2 hours" },
      { id: "act2", name: "Island Hopping Tour", price: "₱1,500", duration: "Full day" },
      { id: "act3", name: "Sugba Lagoon Trip", price: "₱800", duration: "Half day" },
    ],
    hiddenGems: regionalData.hiddenGems || [
      {
        id: "gem1",
        name: "Secret Beach",
        location: "North Siargao",
        image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=800&q=80",
        description: "A hidden beach only accessible by boat, known only to locals."
      },
      {
        id: "gem2",
        name: "Pacifico Village",
        location: "North Siargao",
        image: "https://images.unsplash.com/photo-1439886183900-e79ec0057170?auto=format&fit=crop&w=800&q=80",
        description: "A quiet fishing village with untouched beaches and authentic local culture."
      }
    ],
    localBusinesses: [
      {
        id: "biz1",
        name: "Kermit Surf & Dine",
        type: "Restaurant",
        image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&q=80",
        description: "Local restaurant serving authentic Filipino cuisine with a modern twist."
      },
      {
        id: "biz2",
        name: "Harana Surf Resort",
        type: "Accommodation",
        image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=800&q=80",
        description: "Locally-owned surf resort that promotes sustainable tourism."
      }
    ],
    culturalNotes: regionalData.culturalNotes,
    bestTimeToVisit: regionalData.bestTimeToVisit,
    localCuisine: regionalData.localCuisine,
    traditionalCrafts: regionalData.traditionalCrafts,
    localFestivals: regionalData.localFestivals,
    environmentalNotes: regionalData.environmentalNotes
  };
};

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const destination = getDestinationData(id || "unknown");
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="min-h-screen pb-16">
      <Header transparent={true} showSearch={false} />
      
      <div className="relative h-[40vh]">
        <img
          src={destination.images[0]}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-1">{destination.name}</h1>
          <div className="flex items-center mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{destination.location}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-filipino-yellow mr-1" />
            <span className="mr-1">{destination.rating}</span>
            <span className="text-white/80">({destination.reviewCount} reviews)</span>
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Button 
            size="icon" 
            variant="secondary" 
            className={`rounded-full ${isFavorite ? 'bg-filipino-vibrantRed text-white' : 'bg-white/20 backdrop-blur-sm'}`}
            onClick={toggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-sm">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex space-x-4 mb-6">
          <Link to="/itineraries">
            <Button className="flex-1 bg-filipino-terracotta hover:bg-filipino-terracotta/90">
              <CalendarPlus className="h-4 w-4 mr-2" />
              Add to Itinerary
            </Button>
          </Link>
          <Link to={`/explore?view=map&destination=${id}`}>
            <Button variant="outline" className="flex-1">
              <Map className="h-4 w-4 mr-2" />
              View on Map
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="hidden-gems">Hidden Gems</TabsTrigger>
            <TabsTrigger value="local">Local</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <p className="text-muted-foreground mb-6">
              {destination.description}
            </p>
            
            {destination.bestTimeToVisit && (
              <div className="mb-4 flex items-start">
                <Sunrise className="h-5 w-5 text-filipino-warmOchre mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Best Time to Visit</h4>
                  <p className="text-sm text-muted-foreground">{destination.bestTimeToVisit}</p>
                </div>
              </div>
            )}
            
            {destination.environmentalNotes && (
              <div className="mb-4 flex items-start">
                <Cloud className="h-5 w-5 text-filipino-vibrantGreen mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Environmental Notes</h4>
                  <p className="text-sm text-muted-foreground">{destination.environmentalNotes}</p>
                </div>
              </div>
            )}
            
            <h3 className="font-bold text-lg mb-3">Photos</h3>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {destination.images.map((image, index) => (
                <div key={index} className="aspect-square rounded-md overflow-hidden">
                  <img
                    src={image}
                    alt={`${destination.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-filipino-terracotta/10 rounded-lg border border-filipino-terracotta/20 mb-6">
              <h3 className="font-bold mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2 text-filipino-terracotta" />
                Cultural Notes
              </h3>
              <p className="text-sm">{destination.culturalNotes}</p>
            </div>
            
            {destination.localCuisine && (
              <div className="mb-6">
                <h3 className="font-bold mb-3 flex items-center">
                  <Utensils className="h-4 w-4 mr-2 text-filipino-vibrantRed" />
                  Local Cuisine
                </h3>
                <div className="flex flex-wrap gap-2">
                  {destination.localCuisine.map((dish, index) => (
                    <Badge key={index} variant="outline" className="bg-filipino-warmOchre/10">
                      {dish}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {destination.localFestivals && (
              <div className="mb-6">
                <h3 className="font-bold mb-3">Local Festivals</h3>
                {destination.localFestivals.map((festival, index) => (
                  <div key={index} className="mb-2 p-3 border rounded-lg">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{festival.name}</h4>
                      <Badge variant="secondary">{festival.date}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{festival.description}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Popular Activities</h3>
              <Button variant="link" className="text-filipino-terracotta p-0">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-3 mb-6">
              {destination.activities.slice(0, 2).map((activity) => (
                <div
                  key={activity.id}
                  className="border rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-medium">{activity.name}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="mr-3">{activity.duration}</span>
                      <Tag className="h-3 w-3 mr-1" />
                      <span>{activity.price}</span>
                    </div>
                  </div>
                  <Link to={`/bookings?activity=${activity.id}&destination=${id}`}>
                    <Button size="sm">Book</Button>
                  </Link>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="activities" className="mt-4">
            <div className="space-y-4">
              {destination.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-medium">{activity.name}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="mr-3">{activity.duration}</span>
                      <Tag className="h-3 w-3 mr-1" />
                      <span>{activity.price}</span>
                    </div>
                  </div>
                  <Link to={`/bookings?activity=${activity.id}&destination=${id}`}>
                    <Button size="sm">Book</Button>
                  </Link>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="hidden-gems" className="mt-4">
            <p className="text-muted-foreground mb-4">
              Discover these lesser-known spots that only locals know about.
            </p>
            
            <div className="space-y-6">
              {destination.hiddenGems.map((gem) => (
                <div key={gem.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video">
                    <img
                      src={gem.image}
                      alt={gem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold">{gem.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{gem.location || "Hidden location"}</span>
                        </div>
                      </div>
                      <Badge className="bg-filipino-teal text-white">
                        Hidden Gem
                      </Badge>
                    </div>
                    <p className="text-sm">{gem.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="local" className="mt-4">
            <p className="text-muted-foreground mb-4">
              Support these local businesses that showcase authentic Filipino culture and traditions.
            </p>
            
            {destination.traditionalCrafts && (
              <div className="mb-6">
                <h3 className="font-bold mb-3 flex items-center">
                  <Camera className="h-4 w-4 mr-2 text-filipino-teal" />
                  Local Crafts
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.traditionalCrafts.map((craft, index) => (
                    <Badge key={index} variant="outline" className="bg-filipino-teal/10">
                      {craft}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              {destination.localBusinesses.map((business) => (
                <div key={business.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video">
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold">{business.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {business.type}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm mt-2">{business.description}</p>
                    <Link to={`/bookings?business=${business.id}&destination=${id}`}>
                      <Button className="w-full mt-3 bg-filipino-terracotta hover:bg-filipino-terracotta/90">
                        Support This Business
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav />
    </div>
  );
}
