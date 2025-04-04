
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
import { generateTravelRecommendations } from "@/services/gemini-api";
import { Wand, Plus, Edit, Trash2 } from "lucide-react";

export function AdminDestinations() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    name: "",
    region: "",
    description: "",
    tags: [],
    image: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const queryClient = useQueryClient();

  // Fetch all locations
  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: databaseService.getLocations,
  });

  // Create location mutation
  const createLocationMutation = useMutation({
    mutationFn: databaseService.saveLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      setNewLocation({
        name: "",
        region: "",
        description: "",
        tags: [],
        image: "",
      });
      setOpenDialog(false);
      toast.success("Destination added successfully");
    },
    onError: (error) => {
      console.error("Error creating location:", error);
      toast.error("Failed to add destination");
    },
  });

  const handleGenerateDestination = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a detailed description for a tourist destination in the Philippines called ${newLocation.name || "this location"}. Include details about its attractions, culture, and why people should visit.`;
      
      const response = await generateTravelRecommendations({
        location: newLocation.name || undefined,
      });
      
      // Parse the generated content and extract useful information
      const generatedDescription = response.split("\n\n")[1] || response;
      
      // Update the form with generated content
      setNewLocation({
        ...newLocation,
        description: generatedDescription,
        tags: ["Generated", "Popular", "Tourist Spot"],
      });
      
      toast.success("Destination details generated");
    } catch (error) {
      console.error("Error generating destination:", error);
      toast.error("Failed to generate destination details");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput && !newLocation.tags?.includes(tagInput)) {
      setNewLocation({
        ...newLocation,
        tags: [...(newLocation.tags || []), tagInput],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewLocation({
      ...newLocation,
      tags: newLocation.tags?.filter((t) => t !== tag),
    });
  };

  const handleCreateLocation = () => {
    if (!newLocation.name || !newLocation.region) {
      toast.error("Please fill in required fields");
      return;
    }

    // If no image is provided, use a placeholder
    if (!newLocation.image) {
      newLocation.image = "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80";
    }

    createLocationMutation.mutate(newLocation as Location);
  };

  const regionOptions = ["Luzon", "Visayas", "Mindanao"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Destinations</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Destination
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Destination</DialogTitle>
              <DialogDescription>
                Create a new destination or generate it with AI assistance.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name (required)</Label>
                <Input
                  id="name"
                  value={newLocation.name || ""}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  placeholder="e.g., Manila"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="region">Region (required)</Label>
                <Select
                  value={newLocation.region || ""}
                  onValueChange={(value) => setNewLocation({ ...newLocation, region: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regionOptions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newLocation.description || ""}
                  onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                  placeholder="Describe this destination..."
                  rows={5}
                />
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={handleGenerateDestination}
                  disabled={isGenerating}
                  className="mt-2"
                >
                  <Wand className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate with AI"}
                </Button>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={newLocation.image || ""}
                  onChange={(e) => setNewLocation({ ...newLocation, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g., Beach, Mountain"
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
                {newLocation.tags && newLocation.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newLocation.tags.map((tag) => (
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
              <Button onClick={handleCreateLocation}>
                Save Destination
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-filipino-teal border-t-transparent rounded-full"></div>
        </div>
      ) : locations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No destinations found. Add your first destination.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Card key={location.id}>
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                  src={location.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{location.name}</CardTitle>
                    <CardDescription>{location.region}</CardDescription>
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
                  {location.description}
                </p>
                {location.tags && location.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {location.tags.map((tag) => (
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
    </div>
  );
}
