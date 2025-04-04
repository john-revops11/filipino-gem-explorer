import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Map, 
  Search, 
  Filter, 
  X,
  ChevronDown,
  Star
} from "lucide-react";
import { DestinationCard } from "@/components/home/DestinationCard";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Toggle } from "@/components/ui/toggle";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import EnhancedSearch from "@/components/ai/EnhancedSearch";
import ItineraryOptimizer from "@/components/ai/ItineraryOptimizer";

// Define interface for destination
interface Destination {
  id: string;
  name: string;
  location: string;
  image: string;
  tags: string[];
  isHiddenGem: boolean;
  rating?: number;
  priceRange?: string;
}

// Mock data for destinations
const destinations: Destination[] = [
  {
    id: "siargao",
    name: "Siargao Island",
    location: "Surigao del Norte",
    image: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80",
    tags: ["Surfing", "Beach"],
    isHiddenGem: false,
    rating: 4.8,
    priceRange: "$$",
  },
  {
    id: "bohol",
    name: "Chocolate Hills",
    location: "Bohol",
    image: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?auto=format&fit=crop&w=800&q=80",
    tags: ["Nature", "Landmark"],
    isHiddenGem: false,
    rating: 4.6,
    priceRange: "$",
  },
  {
    id: "banaue",
    name: "Banaue Rice Terraces",
    location: "Ifugao",
    image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=800&q=80",
    tags: ["Nature", "Cultural Heritage"],
    isHiddenGem: true,
    rating: 4.9,
    priceRange: "$",
  },
  {
    id: "elnido",
    name: "El Nido",
    location: "Palawan",
    image: "https://images.unsplash.com/photo-1501286353178-1ec871214838?auto=format&fit=crop&w=800&q=80",
    tags: ["Island Hopping", "Beach"],
    isHiddenGem: false,
    rating: 4.9,
    priceRange: "$$$",
  },
  {
    id: "kalanggaman",
    name: "Kalanggaman Island",
    location: "Leyte",
    image: "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=800&q=80",
    tags: ["Beach", "Island"],
    isHiddenGem: true,
    rating: 4.7,
    priceRange: "$$",
  },
  {
    id: "mayon",
    name: "Mayon Volcano",
    location: "Albay",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
    tags: ["Volcano", "Nature"],
    isHiddenGem: false,
    rating: 4.5,
    priceRange: "$",
  },
  {
    id: "coron",
    name: "Coron Island",
    location: "Palawan",
    image: "https://images.unsplash.com/photo-1517971053567-8bde93bc6a58?auto=format&fit=crop&w=800&q=80",
    tags: ["Diving", "Beach", "Island"],
    isHiddenGem: false,
    rating: 4.8,
    priceRange: "$$$",
  },
  {
    id: "siquijor",
    name: "Siquijor Island",
    location: "Central Visayas",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=800&q=80",
    tags: ["Mystic", "Beach", "Cultural"],
    isHiddenGem: true,
    rating: 4.6,
    priceRange: "$$",
  },
];

// Filter categories
const filterCategories = [
  {
    name: "Activities",
    options: ["Beach", "Diving", "Hiking", "Island Hopping", "Cultural", "Surfing", "Wildlife"],
  },
  {
    name: "Price Range",
    options: ["$", "$$", "$$$"],
  },
  {
    name: "Rating",
    options: ["4.5+", "4.0+", "3.5+"],
  },
  {
    name: "Experience Type",
    options: ["Family Friendly", "Adventure", "Relaxation", "Romantic", "Cultural"],
  },
];

export default function Explore() {
  const [viewType, setViewType] = useState<"grid" | "map" | "itinerary">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>(destinations);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
  // Check URL for category filter on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    const viewParam = params.get('view');
    
    if (categoryParam) {
      setFilters(prev => ({
        ...prev,
        Activities: [...(prev.Activities || []), categoryParam]
      }));
    }
    
    if (viewParam === 'map') {
      setViewType('map');
    } else if (viewParam === 'itinerary') {
      setViewType('itinerary');
    }
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    let results = destinations;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        dest => 
          dest.name.toLowerCase().includes(query) || 
          dest.location.toLowerCase().includes(query) ||
          dest.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by tab
    if (activeTab === "popular") {
      results = results.filter(dest => !dest.isHiddenGem);
    } else if (activeTab === "hidden-gems") {
      results = results.filter(dest => dest.isHiddenGem);
    } else if (activeTab === "nearby") {
      // This would use geolocation in a real app
      // For now just show any 3 destinations as "nearby"
      results = results.slice(0, 3);
    }
    
    // Apply additional filters
    Object.entries(filters).forEach(([category, selectedOptions]) => {
      if (selectedOptions.length > 0) {
        if (category === "Activities") {
          results = results.filter(dest => 
            dest.tags.some(tag => selectedOptions.includes(tag))
          );
        } else if (category === "Price Range") {
          results = results.filter(dest => 
            selectedOptions.includes(dest.priceRange || "")
          );
        } else if (category === "Rating") {
          results = results.filter(dest => {
            const rating = dest.rating || 0;
            return selectedOptions.some(option => {
              const minRating = parseFloat(option.replace("+", ""));
              return rating >= minRating;
            });
          });
        } else if (category === "Experience Type") {
          results = results.filter(dest => 
            dest.tags.some(tag => selectedOptions.includes(tag))
          );
        }
      }
    });
    
    setFilteredDestinations(results);
  }, [searchQuery, activeTab, filters]);
  
  const handleFilterToggle = (category: string, option: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (!newFilters[category]) {
        newFilters[category] = [option];
      } else if (newFilters[category].includes(option)) {
        newFilters[category] = newFilters[category].filter(item => item !== option);
        if (newFilters[category].length === 0) {
          delete newFilters[category];
        }
      } else {
        newFilters[category] = [...newFilters[category], option];
      }
      
      return newFilters;
    });
  };
  
  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery("");
  };
  
  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, options) => count + options.length, 0);
  };
  
  return (
    <div className="min-h-screen pb-16">
      <Header title="Explore" showSearch={false} />
      
      <div className="p-4">
        <div className="mb-4">
          <EnhancedSearch />
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button
              variant={viewType === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("grid")}
            >
              <span className="text-lg">▤</span>
              <span className="ml-1 hidden sm:inline">Gallery</span>
            </Button>
            <Button
              variant={viewType === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("map")}
            >
              <Map className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Map</span>
            </Button>
            <Button
              variant={viewType === "itinerary" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("itinerary")}
            >
              <Star className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Itinerary</span>
            </Button>
          </div>
          
          <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className={`rounded-full ${
                  getActiveFilterCount() > 0 ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                }`}
              >
                {getActiveFilterCount() > 0 ? (
                  <Badge className="h-6 w-6 p-0 flex items-center justify-center">
                    {getActiveFilterCount()}
                  </Badge>
                ) : (
                  <Filter className="h-4 w-4" />
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>Filters</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAllFilters}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                </DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-auto py-2">
                {filterCategories.map((category) => (
                  <div key={category.name} className="border-b border-border last:border-0 py-4">
                    <div className="font-medium mb-2">{category.name}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {category.options.map((option) => {
                        const isSelected = filters[category.name]?.includes(option) || false;
                        return (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`${category.name}-${option}`}
                              checked={isSelected}
                              onCheckedChange={() => handleFilterToggle(category.name, option)}
                            />
                            <Label 
                              htmlFor={`${category.name}-${option}`}
                              className={`text-sm ${isSelected ? "font-medium" : ""}`}
                            >
                              {option}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsFilterDialogOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Active filters display */}
        {getActiveFilterCount() > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.entries(filters).map(([category, options]) => 
              options.map(option => (
                <Badge 
                  key={`${category}-${option}`} 
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1"
                >
                  {option}
                  <button onClick={() => handleFilterToggle(category, option)}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              ))
            )}
          </div>
        )}
        
        {viewType !== "itinerary" && (
          <div className="flex justify-between items-center mb-6">
            <Tabs 
              defaultValue="all" 
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="hidden-gems">Hidden Gems</TabsTrigger>
                <TabsTrigger value="nearby">Nearby</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
        
        {viewType === "grid" ? (
          filteredDestinations.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {filteredDestinations.map((destination, index) => (
                <motion.div 
                  key={destination.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <DestinationCard
                    id={destination.id}
                    name={destination.name}
                    location={destination.location}
                    image={destination.image}
                    tags={destination.tags}
                    isHiddenGem={destination.isHiddenGem}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-10">
              <div className="bg-muted/30 inline-flex rounded-full p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No destinations found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your filters or search terms
              </p>
              <Button variant="outline" onClick={clearAllFilters} className="mt-4">
                Clear All Filters
              </Button>
            </div>
          )
        ) : viewType === "map" ? (
          <div className="bg-muted rounded-lg flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <Map className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p>Map view will be implemented here</p>
              <p className="text-sm text-muted-foreground">
                Using Google Maps or Mapbox integration
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-white rounded-lg border">
            <ItineraryOptimizer />
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}
