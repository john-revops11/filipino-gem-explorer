import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
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
import databaseService, { Tour, Location } from "@/services/database-service";
import { answerTravelQuestion } from "@/services/gemini-api";
import { Wand, Plus, Edit, Trash2, Clock, DollarSign } from "lucide-react";

export function AdminTours() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTour, setNewTour] = useState<Partial<Tour>>({
    name: "",
    description: "",
    price_range: "",
    duration: "",
    location_id: "",
    image: "",
    includes: [],
    highlights: [],
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [highlightInput, setHighlightInput] = useState("");
  const [includeInput, setIncludeInput] = useState("");
  const queryClient = useQueryClient();

  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: databaseService.getLocations,
  });

  const { data: tours = [], isLoading } = useQuery({
    queryKey: ["tours"],
    queryFn: async () => {
      const allTours: Tour[] = [];
      for (const location of locations) {
        if (location.id) {
          const locationTours = await databaseService.getToursByLocation(location.id);
          allTours.push(...locationTours);
        }
      }
      return allTours;
    },
    enabled: locations.length > 0,
  });

  const createTourMutation = useMutation({
    mutationFn: databaseService.saveTour,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      setNewTour({
        name: "",
        description: "",
        price_range: "",
        duration: "",
        location_id: "",
        image: "",
        includes: [],
        highlights: [],
      });
      setOpenDialog(false);
      toast.success("Tour added successfully");
    },
    onError: (error) => {
      console.error("Error creating tour:", error);
      toast.error("Failed to add tour");
    },
  });

  const handleGenerateTour = async () => {
    if (!newTour.location_id) {
      toast.error("Please select a location first");
      return;
    }

    setIsGenerating(true);
    try {
      const location = locations.find(loc => loc.id === newTour.location_id);
      if (!location) {
        throw new Error("Location not found");
      }

      const prompt = `Create a tour package for ${location.name} in the Philippines. Include a tour name, description, highlights, and what's included in the package. Format your response to clearly separate these sections.`;
      
      const response = await answerTravelQuestion(prompt);
      
      const lines = response.split('\n');
      let tourName = "";
      let description = "";
      let highlights: string[] = [];
      let includes: string[] = [];
      
      let currentSection = "";
      for (const line of lines) {
        if (line.match(/tour name|package name|title/i) && !tourName) {
          tourName = line.replace(/tour name|package name|title[:\s-]*/i, "").trim();
        } else if (line.match(/description|overview/i) && currentSection !== "description") {
          currentSection = "description";
        } else if (line.match(/highlight|feature/i) && currentSection !== "highlights") {
          currentSection = "highlights";
        } else if (line.match(/include|offer|provide/i) && currentSection !== "includes") {
          currentSection = "includes";
        } else if (line.trim()) {
          if (currentSection === "description") {
            description += line.trim() + " ";
          } else if (currentSection === "highlights" && line.replace(/^[•\-\*]\s*/, "").trim()) {
            highlights.push(line.replace(/^[•\-\*]\s*/, "").trim());
          } else if (currentSection === "includes" && line.replace(/^[•\-\*]\s*/, "").trim()) {
            includes.push(line.replace(/^[•\-\*]\s*/, "").trim());
          }
        }
      }
      
      if (!tourName) tourName = `Explore ${location.name}`;
      
      setNewTour({
        ...newTour,
        name: tourName,
        description: description.trim(),
        price_range: "₱1,000 - ₱5,000",
        duration: "Full day",
        highlights: highlights.length > 0 ? highlights : ["Scenic views", "Cultural experience", "Local guides"],
        includes: includes.length > 0 ? includes : ["Transportation", "Lunch", "Guide"],
      });
      
      toast.success("Tour details generated");
    } catch (error) {
      console.error("Error generating tour:", error);
      toast.error("Failed to generate tour details");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddHighlight = () => {
    if (highlightInput && !newTour.highlights?.includes(highlightInput)) {
      setNewTour({
        ...newTour,
        highlights: [...(newTour.highlights || []), highlightInput],
      });
      setHighlightInput("");
    }
  };

  const handleAddInclude = () => {
    if (includeInput && !newTour.includes?.includes(includeInput)) {
      setNewTour({
        ...newTour,
        includes: [...(newTour.includes || []), includeInput],
      });
      setIncludeInput("");
    }
  };

  const handleRemoveHighlight = (highlight: string) => {
    setNewTour({
      ...newTour,
      highlights: newTour.highlights?.filter((h) => h !== highlight),
    });
  };

  const handleRemoveInclude = (include: string) => {
    setNewTour({
      ...newTour,
      includes: newTour.includes?.filter((i) => i !== include),
    });
  };

  const handleCreateTour = () => {
    if (!newTour.name || !newTour.location_id || !newTour.price_range || !newTour.duration) {
      toast.error("Please fill in all required fields");
      return;
    }

    createTourMutation.mutate(newTour as Tour);
  };

  const getLocationName = (locationId: string): string => {
    const location = locations.find((loc) => loc.id === locationId);
    return location ? location.name : "Unknown Location";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Tours</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tour
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Tour</DialogTitle>
              <DialogDescription>
                Create a new tour or generate it with AI assistance.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location (required)</Label>
                <Select
                  value={newTour.location_id || ""}
                  onValueChange={(value) => setNewTour({ ...newTour, location_id: value })}
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
                <Label htmlFor="name">Tour Name (required)</Label>
                <Input
                  id="name"
                  value={newTour.name || ""}
                  onChange={(e) => setNewTour({ ...newTour, name: e.target.value })}
                  placeholder="e.g., Manila Heritage Tour"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTour.description || ""}
                  onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
                  placeholder="Describe this tour..."
                  rows={4}
                />
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={handleGenerateTour}
                  disabled={isGenerating}
                  className="mt-2"
                >
                  <Wand className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate with AI"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price_range">Price Range (required)</Label>
                  <Input
                    id="price_range"
                    value={newTour.price_range || ""}
                    onChange={(e) => setNewTour({ ...newTour, price_range: e.target.value })}
                    placeholder="e.g., ₱1,000 - ₱2,000"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (required)</Label>
                  <Input
                    id="duration"
                    value={newTour.duration || ""}
                    onChange={(e) => setNewTour({ ...newTour, duration: e.target.value })}
                    placeholder="e.g., 4 hours"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={newTour.image || ""}
                  onChange={(e) => setNewTour({ ...newTour, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="highlights">Highlights</Label>
                <div className="flex gap-2">
                  <Input
                    id="highlights"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    placeholder="e.g., Historical landmarks"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddHighlight} variant="outline">
                    Add
                  </Button>
                </div>
                {newTour.highlights && newTour.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newTour.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm flex items-center"
                      >
                        {highlight}
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(highlight)}
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
                <Label htmlFor="includes">What's Included</Label>
                <div className="flex gap-2">
                  <Input
                    id="includes"
                    value={includeInput}
                    onChange={(e) => setIncludeInput(e.target.value)}
                    placeholder="e.g., Entrance fees"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInclude();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddInclude} variant="outline">
                    Add
                  </Button>
                </div>
                {newTour.includes && newTour.includes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newTour.includes.map((include) => (
                      <div
                        key={include}
                        className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm flex items-center"
                      >
                        {include}
                        <button
                          type="button"
                          onClick={() => handleRemoveInclude(include)}
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
              <Button onClick={handleCreateTour}>
                Save Tour
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-filipino-teal border-t-transparent rounded-full"></div>
        </div>
      ) : tours.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tours found. Add your first tour.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <Card key={tour.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{tour.name}</CardTitle>
                    <CardDescription>{getLocationName(tour.location_id)}</CardDescription>
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
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {tour.description}
                </p>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {tour.duration}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {tour.price_range}
                  </div>
                </div>
                
                {tour.highlights && tour.highlights.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Highlights:</h4>
                    <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                      {tour.highlights.slice(0, 3).map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                      {tour.highlights.length > 3 && (
                        <li>+{tour.highlights.length - 3} more</li>
                      )}
                    </ul>
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
