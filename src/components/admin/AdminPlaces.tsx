
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import databaseService, { Location, Place } from "@/services/database-service";
import { PlaceCard } from "@/components/home/PlaceCard";
import { Building, Hotel, MapPin, Plus, Edit, Trash2, Store, Gem, Coffee, Utensils } from "lucide-react";

// Place category definitions
const PLACE_CATEGORIES = {
  hotel: {
    icon: Hotel,
    label: "Hotels",
    description: "Accommodations for travelers"
  },
  resort: {
    icon: Building,
    label: "Resorts",
    description: "Luxury accommodations with amenities"
  },
  tourist_spot: {
    icon: MapPin,
    label: "Tourist Spots",
    description: "Popular attractions and landmarks"
  },
  restaurant: {
    icon: Utensils,
    label: "Restaurants",
    description: "Dining establishments"
  },
  hidden_gem: {
    icon: Gem,
    label: "Hidden Gems",
    description: "Lesser-known but exceptional places"
  },
  local_business: {
    icon: Store,
    label: "Local Businesses",
    description: "Locally owned establishments"
  },
  cafe: {
    icon: Coffee,
    label: "Cafes",
    description: "Coffee shops and casual dining"
  }
};

export function AdminPlaces() {
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [newPlace, setNewPlace] = useState<Place>({
    name: "",
    type: "hotel",
    description: "",
    location: "",
    location_id: "",
    tags: [],
    amenities: [],
    is_hidden_gem: false,
    is_local_business: false,
  });
  const [tagInput, setTagInput] = useState("");
  const [amenityInput, setAmenityInput] = useState("");
  const queryClient = useQueryClient();

  // Fetch all locations for dropdown
  const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ["locations"],
    queryFn: databaseService.getLocations,
  });

  // Fetch all places
  const { data: places = [], isLoading } = useQuery({
    queryKey: ["places"],
    queryFn: databaseService.getPlaces,
  });

  // Create place mutation
  const createPlaceMutation = useMutation({
    mutationFn: async (placeData: Place) => {
      return await databaseService.savePlace(placeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
      setNewPlace({
        name: "",
        type: "hotel",
        description: "",
        location: "",
        location_id: "",
        tags: [],
        amenities: [],
        is_hidden_gem: false,
        is_local_business: false,
      });
      setOpenDialog(false);
      toast.success("Place added successfully");
    },
    onError: (error) => {
      console.error("Error creating place:", error);
      toast.error("Failed to add place");
    },
  });

  const handleAddTag = () => {
    if (tagInput && !newPlace.tags?.includes(tagInput)) {
      setNewPlace({
        ...newPlace,
        tags: [...(newPlace.tags || []), tagInput],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewPlace({
      ...newPlace,
      tags: newPlace.tags?.filter((t) => t !== tag),
    });
  };

  const handleAddAmenity = () => {
    if (amenityInput && !newPlace.amenities?.includes(amenityInput)) {
      setNewPlace({
        ...newPlace,
        amenities: [...(newPlace.amenities || []), amenityInput],
      });
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setNewPlace({
      ...newPlace,
      amenities: newPlace.amenities?.filter((a) => a !== amenity),
    });
  };

  const handleCreatePlace = () => {
    if (!newPlace.name || !newPlace.type || !newPlace.location_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    // If no image is provided, use a placeholder
    if (!newPlace.image) {
      newPlace.image = "https://images.unsplash.com/photo-1596386461350-326ccb383e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
    }

    createPlaceMutation.mutate(newPlace);
  };

  // Get location name by ID
  const getLocationName = (locationId: string) => {
    const location = locations.find((loc) => loc.id === locationId);
    return location ? location.name : "Unknown Location";
  };

  // Get icon based on place type
  const getPlaceIcon = (type: string) => {
    const category = PLACE_CATEGORIES[type as keyof typeof PLACE_CATEGORIES];
    if (category) {
      return <category.icon className="h-4 w-4" />;
    }
    return <Building className="h-4 w-4" />;
  };

  // Filter places based on selected tab
  const getFilteredPlaces = () => {
    if (!places) return [];
    if (activeTab === "all") return places;
    if (activeTab === "hidden_gems") return places.filter(place => place.is_hidden_gem);
    if (activeTab === "local_businesses") return places.filter(place => place.is_local_business);
    return places.filter(place => place.type === activeTab);
  };

  const filteredPlaces = getFilteredPlaces();

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Places</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Place
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Place</DialogTitle>
              <DialogDescription>
                Add hotels, resorts, tourist spots and other attractions.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name (required)</Label>
                <Input
                  id="name"
                  value={newPlace.name || ""}
                  onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                  placeholder="e.g., Grand Hotel"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Type (required)</Label>
                <Select
                  value={newPlace.type || "hotel"}
                  onValueChange={(value) => setNewPlace({ ...newPlace, type: value as Place["type"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="resort">Resort</SelectItem>
                    <SelectItem value="tourist_spot">Tourist Spot</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="cafe">Cafe</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location (required)</Label>
                <Select
                  value={newPlace.location_id || ""}
                  onValueChange={(value) => setNewPlace({ ...newPlace, location_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id || ""}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newPlace.description || ""}
                  onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
                  placeholder="Describe this place..."
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newPlace.address || ""}
                  onChange={(e) => setNewPlace({ ...newPlace, address: e.target.value })}
                  placeholder="e.g., 123 Main St, City"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price_range">Price Range</Label>
                <Input
                  id="price_range"
                  value={newPlace.price_range || ""}
                  onChange={(e) => setNewPlace({ ...newPlace, price_range: e.target.value })}
                  placeholder="e.g., ₱1,000 - ₱3,000"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  value={typeof newPlace.contact === 'string' ? newPlace.contact : ''}
                  onChange={(e) => setNewPlace({ ...newPlace, contact: e.target.value })}
                  placeholder="e.g., +63 123 456 7890"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={newPlace.website || ""}
                  onChange={(e) => setNewPlace({ ...newPlace, website: e.target.value })}
                  placeholder="e.g., https://example.com"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={newPlace.image || ""}
                  onChange={(e) => setNewPlace({ ...newPlace, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amenities">Amenities</Label>
                <div className="flex gap-2">
                  <Input
                    id="amenities"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    placeholder="e.g., WiFi, Pool"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAmenity();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddAmenity} variant="outline">
                    Add
                  </Button>
                </div>
                {newPlace.amenities && newPlace.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newPlace.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm flex items-center"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(amenity)}
                          className="ml-1 text-muted-foreground/70 hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g., Family-friendly, Luxury"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                {newPlace.tags && newPlace.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newPlace.tags.map((tag) => (
                      <div
                        key={tag}
                        className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-muted-foreground/70 hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="is_hidden_gem">Is this a Hidden Gem?</Label>
                <Select
                  value={newPlace.is_hidden_gem ? "true" : "false"}
                  onValueChange={(value) => setNewPlace({ ...newPlace, is_hidden_gem: value === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="is_local_business">Is this a Local Business?</Label>
                <Select
                  value={newPlace.is_local_business ? "true" : "false"}
                  onValueChange={(value) => setNewPlace({ ...newPlace, is_local_business: value === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePlace}>
                Save Place
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all">All Places</TabsTrigger>
          {Object.keys(PLACE_CATEGORIES).map(key => (
            <TabsTrigger key={key} value={key}>
              {PLACE_CATEGORIES[key as keyof typeof PLACE_CATEGORIES].label}
            </TabsTrigger>
          ))}
          <TabsTrigger value="hidden_gems">Hidden Gems</TabsTrigger>
          <TabsTrigger value="local_businesses">Local Businesses</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-filipino-teal border-t-transparent rounded-full"></div>
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No places found in this category. Add your first place.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPlaces.map((place) => (
                <Card key={place.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          {getPlaceIcon(place.type)}
                          <CardTitle className="line-clamp-1">{place.name}</CardTitle>
                        </div>
                        <CardDescription>{getLocationName(place.location_id || '')}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {place.is_hidden_gem && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200">Hidden Gem</Badge>
                      )}
                      {place.is_local_business && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">Local Business</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {place.description}
                    </p>
                    
                    {place.price_range && (
                      <div className="text-sm text-muted-foreground">
                        Price Range: {place.price_range}
                      </div>
                    )}
                    
                    {place.tags && place.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {place.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
