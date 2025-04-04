
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import databaseService, { Location } from "@/services/database-service";
import { Building, Hotel, MapPin, Plus, Edit, Trash2 } from "lucide-react";

// Define Place type
interface Place {
  id?: string;
  name: string;
  type: "hotel" | "resort" | "tourist_spot" | "restaurant" | "other";
  description: string;
  location_id: string;
  image?: string;
  address?: string;
  price_range?: string;
  contact?: string;
  website?: string;
  amenities?: string[];
  tags?: string[];
}

export function AdminPlaces() {
  const [openDialog, setOpenDialog] = useState(false);
  const [newPlace, setNewPlace] = useState<Partial<Place>>({
    name: "",
    type: "hotel",
    description: "",
    location_id: "",
    tags: [],
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
    queryFn: async () => {
      try {
        // This would be implemented in database-service.ts
        const placesSnapshot = await databaseService.getPlaces();
        return placesSnapshot || [];
      } catch (error) {
        console.error("Error fetching places:", error);
        return [];
      }
    },
  });

  // Create place mutation
  const createPlaceMutation = useMutation({
    mutationFn: async (placeData: Place) => {
      // This would be implemented in database-service.ts
      return await databaseService.savePlace(placeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
      setNewPlace({
        name: "",
        type: "hotel",
        description: "",
        location_id: "",
        tags: [],
        amenities: [],
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

    createPlaceMutation.mutate(newPlace as Place);
  };

  // Get location name by ID
  const getLocationName = (locationId: string) => {
    const location = locations.find((loc) => loc.id === locationId);
    return location ? location.name : "Unknown Location";
  };

  // Get icon based on place type
  const getPlaceIcon = (type: string) => {
    switch (type) {
      case "hotel":
        return <Hotel className="h-4 w-4" />;
      case "resort":
        return <Building className="h-4 w-4" />;
      case "tourist_spot":
        return <MapPin className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

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
          <DialogContent className="sm:max-w-[550px]">
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
                  value={newPlace.contact || ""}
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
                    placeholder="e.g., Luxury, Family-friendly"
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

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-filipino-teal border-t-transparent rounded-full"></div>
        </div>
      ) : places.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No places found. Add your first place.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {places.map((place: Place) => (
            <Card key={place.id}>
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                  src={place.image || "https://images.unsplash.com/photo-1596386461350-326ccb383e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getPlaceIcon(place.type)}
                    <div>
                      <CardTitle>{place.name}</CardTitle>
                      <CardDescription>{getLocationName(place.location_id)}</CardDescription>
                    </div>
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
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {place.description}
                </p>
                {place.price_range && (
                  <p className="text-sm mt-2 font-medium">
                    Price: {place.price_range}
                  </p>
                )}
                {place.amenities && place.amenities.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {place.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-md text-xs"
                        >
                          {amenity}
                        </span>
                      ))}
                      {place.amenities.length > 3 && (
                        <span className="bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-md text-xs">
                          +{place.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {place.tags && place.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {place.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-filipino-teal/10 text-filipino-deepTeal px-2 py-0.5 rounded-md text-xs"
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
    </div>
  );
}
