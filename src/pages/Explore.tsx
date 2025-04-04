
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Search, Filter } from "lucide-react";
import { DestinationCard } from "@/components/home/DestinationCard";
import { useState } from "react";

// Mock data for destinations
const destinations = [
  {
    id: "dest1",
    name: "Siargao Island",
    location: "Surigao del Norte",
    image: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80",
    tags: ["Surfing", "Beach"],
    isHiddenGem: false,
  },
  {
    id: "dest2",
    name: "Chocolate Hills",
    location: "Bohol",
    image: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?auto=format&fit=crop&w=800&q=80",
    tags: ["Nature", "Landmark"],
    isHiddenGem: false,
  },
  {
    id: "gem1",
    name: "Batad Rice Terraces",
    location: "Ifugao",
    image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=800&q=80",
    tags: ["Nature", "Cultural Heritage"],
    isHiddenGem: true,
  },
  {
    id: "dest3",
    name: "El Nido",
    location: "Palawan",
    image: "https://images.unsplash.com/photo-1501286353178-1ec881214838?auto=format&fit=crop&w=800&q=80",
    tags: ["Island Hopping", "Beach"],
    isHiddenGem: false,
  },
  {
    id: "gem2",
    name: "Kalanggaman Island",
    location: "Leyte",
    image: "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=800&q=80",
    tags: ["Beach", "Island"],
    isHiddenGem: true,
  },
  {
    id: "dest4",
    name: "Mayon Volcano",
    location: "Albay",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
    tags: ["Volcano", "Nature"],
    isHiddenGem: false,
  },
];

export default function Explore() {
  const [viewType, setViewType] = useState<"grid" | "map">("grid");
  
  return (
    <div className="min-h-screen pb-16">
      <Header title="Explore" />
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-1 mr-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search destinations..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-input bg-background"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="hidden-gems">Hidden Gems</TabsTrigger>
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex ml-2 border rounded-md">
            <Button
              variant={viewType === "grid" ? "default" : "ghost"}
              size="sm"
              className="px-2"
              onClick={() => setViewType("grid")}
            >
              <span className="text-lg">▤</span>
            </Button>
            <Button
              variant={viewType === "map" ? "default" : "ghost"}
              size="sm"
              className="px-2"
              onClick={() => setViewType("map")}
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {viewType === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                id={destination.id}
                name={destination.name}
                location={destination.location}
                image={destination.image}
                tags={destination.tags}
                isHiddenGem={destination.isHiddenGem}
              />
            ))}
          </div>
        ) : (
          <div className="bg-muted rounded-lg flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <Map className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p>Map view will be implemented here</p>
              <p className="text-sm text-muted-foreground">
                Using Google Maps or Mapbox integration
              </p>
            </div>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}
