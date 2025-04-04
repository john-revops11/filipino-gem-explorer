
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
import databaseService, { Food, Location } from "@/services/database-service";
import { answerTravelQuestion } from "@/services/gemini-api";
import { Wand, Plus, Edit, Trash2, UtensilsCrossed } from "lucide-react";

export function AdminFoods() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [newFood, setNewFood] = useState<Partial<Food>>({
    name: "",
    type: "",
    description: "",
    price_range: "",
    location_id: "",
    image: "",
    tags: [],
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const queryClient = useQueryClient();

  // Fetch all locations
  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: databaseService.getLocations,
  });

  // Fetch all foods
  const { data: foods = [], isLoading } = useQuery({
    queryKey: ["foods"],
    queryFn: async () => {
      // Since we don't have a getAll foods method, we'll fetch per location and combine
      const allFoods: Food[] = [];
      for (const location of locations) {
        if (location.id) {
          const locationFoods = await databaseService.getFoodItemsByLocation(location.id);
          allFoods.push(...locationFoods);
        }
      }
      return allFoods;
    },
    enabled: locations.length > 0,
  });

  // Create food mutation
  const createFoodMutation = useMutation({
    mutationFn: databaseService.saveFoodItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      setNewFood({
        name: "",
        type: "",
        description: "",
        price_range: "",
        location_id: "",
        image: "",
        tags: [],
      });
      setOpenDialog(false);
      toast.success("Food item added successfully");
    },
    onError: (error) => {
      console.error("Error creating food item:", error);
      toast.error("Failed to add food item");
    },
  });

  const handleGenerateFood = async () => {
    if (!newFood.location_id) {
      toast.error("Please select a location first");
      return;
    }

    setIsGenerating(true);
    try {
      const location = locations.find(loc => loc.id === newFood.location_id);
      if (!location) {
        throw new Error("Location not found");
      }

      const prompt = `Describe a famous local dish or food specialty from ${location.name} in the Philippines. Include the name of the dish, what type of food it is (e.g., dessert, main course), a detailed description, and an estimated price range. Format your response to clearly separate these sections.`;
      
      const response = await answerTravelQuestion(prompt);
      
      // Parse the generated content
      const lines = response.split('\n');
      let foodName = "";
      let foodType = "";
      let description = "";
      let priceRange = "";
      
      // Simple parsing logic - can be improved
      for (const line of lines) {
        if (line.match(/name|dish|food/i) && !foodName) {
          foodName = line.replace(/name|dish|food[:\s-]*/i, "").trim();
        } else if (line.match(/type|category|classification/i) && !foodType) {
          foodType = line.replace(/type|category|classification[:\s-]*/i, "").trim();
        } else if (line.match(/description|about/i)) {
          // Extract description - this is simplified
          description = lines.slice(lines.indexOf(line) + 1).join(" ");
          break;
        } else if (line.match(/price|cost|range/i) && !priceRange) {
          priceRange = line.replace(/price|cost|range[:\s-]*/i, "").trim();
          // Make sure it has the peso sign
          if (!priceRange.includes("₱")) {
            priceRange = "₱" + priceRange.replace(/[₱P]/, "");
          }
        }
      }
      
      // If no clear values were found, use defaults
      if (!foodName) foodName = `Local Delicacy from ${location.name}`;
      if (!foodType) foodType = "Local Specialty";
      if (!priceRange) priceRange = "₱100 - ₱300";
      
      // Update the form with generated content
      setNewFood({
        ...newFood,
        name: foodName,
        type: foodType,
        description: description.trim(),
        price_range: priceRange,
        tags: ["Local", "Traditional", "Filipino Cuisine"],
      });
      
      toast.success("Food details generated");
    } catch (error) {
      console.error("Error generating food:", error);
      toast.error("Failed to generate food details");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput && !newFood.tags?.includes(tagInput)) {
      setNewFood({
        ...newFood,
        tags: [...(newFood.tags || []), tagInput],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewFood({
      ...newFood,
      tags: newFood.tags?.filter((t) => t !== tag),
    });
  };

  const handleCreateFood = () => {
    if (!newFood.name || !newFood.location_id || !newFood.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    createFoodMutation.mutate(newFood as Food);
  };

  // Find location name by ID
  const getLocationName = (locationId: string): string => {
    const location = locations.find((loc) => loc.id === locationId);
    return location ? location.name : "Unknown Location";
  };

  const foodTypes = [
    "Local Specialty",
    "Seafood",
    "Main Course",
    "Dessert",
    "Street Food",
    "Snack",
    "Beverage",
    "Appetizer",
    "Soup",
    "Traditional"
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Foods</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-filipino-maroon hover:bg-filipino-maroon/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Food Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Food Item</DialogTitle>
              <DialogDescription>
                Create a new food item or generate it with AI assistance.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location (required)</Label>
                <Select
                  value={newFood.location_id || ""}
                  onValueChange={(value) => setNewFood({ ...newFood, location_id: value })}
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
                <Label htmlFor="name">Food Name (required)</Label>
                <Input
                  id="name"
                  value={newFood.name || ""}
                  onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  placeholder="e.g., Adobo"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Food Type (required)</Label>
                <Select
                  value={newFood.type || ""}
                  onValueChange={(value) => setNewFood({ ...newFood, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a food type" />
                  </SelectTrigger>
                  <SelectContent>
                    {foodTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newFood.description || ""}
                  onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
                  placeholder="Describe this food item..."
                  rows={4}
                />
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={handleGenerateFood}
                  disabled={isGenerating}
                  className="mt-2"
                >
                  <Wand className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate with AI"}
                </Button>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price_range">Price Range</Label>
                <Input
                  id="price_range"
                  value={newFood.price_range || ""}
                  onChange={(e) => setNewFood({ ...newFood, price_range: e.target.value })}
                  placeholder="e.g., ₱100 - ₱300"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={newFood.image || ""}
                  onChange={(e) => setNewFood({ ...newFood, image: e.target.value })}
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
                    placeholder="e.g., Spicy, Traditional"
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
                {newFood.tags && newFood.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newFood.tags.map((tag) => (
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
              <Button onClick={handleCreateFood} className="bg-filipino-maroon hover:bg-filipino-maroon/90">
                Save Food Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-filipino-maroon border-t-transparent rounded-full"></div>
        </div>
      ) : foods.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No food items found. Add your first food item.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {foods.map((food) => (
            <Card key={food.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{food.name}</CardTitle>
                    <CardDescription>
                      {food.type} • {getLocationName(food.location_id)}
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
                  {food.description}
                </p>
                
                {food.price_range && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <UtensilsCrossed className="h-4 w-4 mr-1 text-filipino-maroon" />
                    {food.price_range}
                  </div>
                )}
                
                {food.tags && food.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {food.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-filipino-maroon/10 text-filipino-maroon px-2 py-1 rounded-md text-xs"
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
