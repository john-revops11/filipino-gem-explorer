
import { useParams } from "react-router-dom";
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
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DestinationCard } from "@/components/home/DestinationCard";

// Mock data for destination details
const getDestinationData = (id: string) => {
  return {
    id,
    name: "Siargao Island",
    location: "Surigao del Norte",
    description: "Known as the 'Surfing Capital of the Philippines', Siargao is a tear-drop shaped island in the province of Surigao del Norte. This tropical paradise is known for its pristine beaches, crystal-clear waters, and world-class waves. Beyond surfing, the island offers a range of activities from island hopping to exploring lush mangrove forests.",
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
    hiddenGems: [
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
    culturalNotes: "Siargao has a rich cultural heritage influenced by its history of fishing and agriculture. The local Surigaonon people are known for their warmth and hospitality. Traditional practices like the 'bayanihan' (community cooperation) are still observed, especially during festivals and community events."
  };
};

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const destination = getDestinationData(id || "unknown");

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
          <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-sm">
            <Heart className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-sm">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex space-x-4 mb-6">
          <Button className="flex-1 bg-filipino-terracotta hover:bg-filipino-terracotta/90">
            <CalendarPlus className="h-4 w-4 mr-2" />
            Add to Itinerary
          </Button>
          <Button variant="outline" className="flex-1">
            <Map className="h-4 w-4 mr-2" />
            View on Map
          </Button>
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
              <h3 className="font-bold mb-2">Cultural Notes</h3>
              <p className="text-sm">{destination.culturalNotes}</p>
            </div>
            
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
                  <Button size="sm">Book</Button>
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
                  <Button size="sm">Book</Button>
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
                          <span>{gem.location}</span>
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
                    <Button className="w-full mt-3 bg-filipino-terracotta hover:bg-filipino-terracotta/90">
                      Support This Business
                    </Button>
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
