
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
import databaseService, { Itinerary, Location } from "@/services/database-service";
import { generateItinerary } from "@/services/gemini-api";
import { Wand, Plus, Edit, Trash2, Calendar, Eye } from "lucide-react";

export function AdminItineraries() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [newItinerary, setNewItinerary] = useState<Partial<Itinerary>>({
    name: "",
    description: "",
    days: 3,
    location: {
      name: "",
    },
    tags: [],
    content: "",
    is_public: true,
  });
  const [preferences, setPreferences] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const queryClient = useQueryClient();

  // Fetch all locations
  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: databaseService.getLocations,
  });

  // Fetch all itineraries
  const { data: itineraries = [], isLoading } = useQuery({
    queryKey: ["itineraries"],
    queryFn: databaseService.getPublicItineraries,
  });

  // Create itinerary mutation
  const createItineraryMutation = useMutation({
    mutationFn: databaseService.saveItinerary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
      setNewItinerary({
        name: "",
        description: "",
        days: 3,
        location: {
          name: "",
        },
        tags: [],
        content: "",
        is_public: true,
      });
      setPreferences("");
      setOpenDialog(false);
      toast.success("Itinerary added successfully");
    },
    onError: (error) => {
      console.error("Error creating itinerary:", error);
      toast.error("Failed to add itinerary");
    },
  });

  const handleGenerateItinerary = async () => {
    if (!newItinerary.location?.name) {
      toast.error("Please enter a destination");
      return;
    }

    setIsGenerating(true);
    try {
      const content = await generateItinerary(
        newItinerary.location.name,
        newItinerary.days || 3,
        preferences
      );
      
      setNewItinerary({
        ...newItinerary,
        content: content,
        name: `${newItinerary.days}-Day ${newItinerary.location.name} Itinerary`,
        description: `Explore the best of ${newItinerary.location.name} in ${newItinerary.days} days${preferences ? ` with focus on ${preferences}` : ""}.`,
        tags: ["AI-generated", newItinerary.location.name, `${newItinerary.days}-day`],
      });
      
      toast.success("Itinerary generated successfully");
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast.error("Failed to generate itinerary");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput && !newItinerary.tags?.includes(tagInput)) {
      setNewItinerary({
        ...newItinerary,
        tags: [...(newItinerary.tags || []), tagInput],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewItinerary({
      ...newItinerary,
      tags: newItinerary.tags?.filter((t) => t !== tag),
    });
  };

  const handleCreateItinerary = () => {
    if (!newItinerary.name || !newItinerary.location?.name || !newItinerary.days || !newItinerary.content) {
      toast.error("Please fill in all required fields and generate content");
      return;
    }

    // Create a timestamp for the itinerary
    const timestamp = new Date().toISOString();
    
    const itineraryData: Itinerary = {
      ...newItinerary as Itinerary,
      created_at: timestamp,
      updated_at: timestamp,
      created_by: "admin", // In a real app, use the actual user ID
    };

    createItineraryMutation.mutate(itineraryData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Itineraries</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Itinerary
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Itinerary</DialogTitle>
              <DialogDescription>
                Generate an itinerary using AI or create it manually.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="destination">Destination (required)</Label>
                <Input
                  id="destination"
                  value={newItinerary.location?.name || ""}
                  onChange={(e) => 
                    setNewItinerary({ 
                      ...newItinerary, 
                      location: { ...newItinerary.location, name: e.target.value } 
                    })
                  }
                  placeholder="e.g., Manila"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="days">Number of Days (required)</Label>
                <Select
                  value={newItinerary.days?.toString() || "3"}
                  onValueChange={(value) => 
                    setNewItinerary({ ...newItinerary, days: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of days" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 7, 10, 14].map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day} {day === 1 ? "day" : "days"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="preferences">Preferences</Label>
                <Textarea
                  id="preferences"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g., cultural experiences, food tours, adventure activities"
                  rows={2}
                />
              </div>

              <Button 
                variant="secondary" 
                onClick={handleGenerateItinerary}
                disabled={isGenerating}
              >
                <Wand className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating Itinerary..." : "Generate Itinerary with AI"}
              </Button>

              {newItinerary.content && (
                <>
                  <div className="grid gap-2 mt-4">
                    <Label htmlFor="name">Itinerary Name (required)</Label>
                    <Input
                      id="name"
                      value={newItinerary.name || ""}
                      onChange={(e) => setNewItinerary({ ...newItinerary, name: e.target.value })}
                      placeholder="e.g., 3-Day Manila Adventure"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItinerary.description || ""}
                      onChange={(e) => setNewItinerary({ ...newItinerary, description: e.target.value })}
                      placeholder="Describe this itinerary..."
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select
                      value={newItinerary.is_public ? "public" : "private"}
                      onValueChange={(value) => 
                        setNewItinerary({ ...newItinerary, is_public: value === "public" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="e.g., Family-friendly, Budget"
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
                    {newItinerary.tags && newItinerary.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newItinerary.tags.map((tag) => (
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
                    <Label>Generated Content Preview</Label>
                    <div className="border rounded-md p-4 max-h-40 overflow-y-auto bg-muted/50">
                      <div dangerouslySetInnerHTML={{ __html: newItinerary.content || "" }} />
                    </div>
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateItinerary}
                disabled={!newItinerary.content || !newItinerary.name || !newItinerary.location?.name}
              >
                Save Itinerary
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-filipino-teal border-t-transparent rounded-full"></div>
        </div>
      ) : itineraries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No itineraries found. Create your first itinerary.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{itinerary.name}</CardTitle>
                    <CardDescription>
                      {itinerary.location.name} • {itinerary.days} {itinerary.days === 1 ? "day" : "days"}
                    </CardDescription>
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
                  {itinerary.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {itinerary.tags && itinerary.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(itinerary.created_at || "").toLocaleDateString()}
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
