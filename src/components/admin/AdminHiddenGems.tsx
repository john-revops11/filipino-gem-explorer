
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import databaseService from "@/services/database-service";
import { toast } from "sonner";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Gem, MapPin, Plus, Edit, Trash2, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// Hidden gem categories
const GEM_CATEGORIES = [
  { id: "nature", name: "Natural Wonder", color: "bg-green-500" },
  { id: "cultural", name: "Cultural Site", color: "bg-purple-500" },
  { id: "historical", name: "Historical Place", color: "bg-amber-500" },
  { id: "activity", name: "Unique Activity", color: "bg-blue-500" },
  { id: "food", name: "Food Secret", color: "bg-red-500" },
  { id: "viewpoint", name: "Scenic Viewpoint", color: "bg-cyan-500" },
];

export function AdminHiddenGems() {
  const [isAddGemOpen, setIsAddGemOpen] = useState(false);
  const [isEditGemOpen, setIsEditGemOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGemId, setSelectedGemId] = useState<string | null>(null);
  
  // Form state
  const [gemName, setGemName] = useState("");
  const [gemDescription, setGemDescription] = useState("");
  const [gemLocation, setGemLocation] = useState("");
  const [gemCategory, setGemCategory] = useState("nature");
  const [gemImage, setGemImage] = useState("");
  const [gemFeatured, setGemFeatured] = useState(false);
  const [gemAccessTips, setGemAccessTips] = useState("");
  const [gemBestTime, setGemBestTime] = useState("");
  
  const queryClient = useQueryClient();
  
  // Fetch hidden gems
  const { data: hiddenGems = [], isLoading } = useQuery({
    queryKey: ['admin', 'hiddenGems'],
    queryFn: () => databaseService.getAllHiddenGems(),
  });
  
  // Add hidden gem mutation
  const addGemMutation = useMutation({
    mutationFn: (newGem: any) => databaseService.addHiddenGem(newGem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'hiddenGems'] });
      toast.success("Hidden gem added successfully");
      resetForm();
      setIsAddGemOpen(false);
    },
    onError: (error) => {
      console.error("Error adding hidden gem:", error);
      toast.error("Failed to add hidden gem");
    },
  });
  
  // Update hidden gem mutation
  const updateGemMutation = useMutation({
    mutationFn: (updatedGem: any) => databaseService.updateHiddenGem(selectedGemId!, updatedGem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'hiddenGems'] });
      toast.success("Hidden gem updated successfully");
      resetForm();
      setIsEditGemOpen(false);
    },
    onError: (error) => {
      console.error("Error updating hidden gem:", error);
      toast.error("Failed to update hidden gem");
    },
  });
  
  // Delete hidden gem mutation
  const deleteGemMutation = useMutation({
    mutationFn: (gemId: string) => databaseService.deleteHiddenGem(gemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'hiddenGems'] });
      toast.success("Hidden gem deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting hidden gem:", error);
      toast.error("Failed to delete hidden gem");
    },
  });
  
  // Toggle feature status mutation
  const toggleFeatureMutation = useMutation({
    mutationFn: ({ gemId, featured }: { gemId: string; featured: boolean }) => 
      databaseService.updateHiddenGemFeaturedStatus(gemId, featured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'hiddenGems'] });
      toast.success("Featured status updated");
    },
    onError: (error) => {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
    },
  });
  
  // Handle form submission
  const handleAddGem = () => {
    const newGem = {
      name: gemName,
      description: gemDescription,
      location: gemLocation,
      category: gemCategory,
      image: gemImage || "https://source.unsplash.com/random/800x600/?nature",
      featured: gemFeatured,
      accessTips: gemAccessTips,
      bestTime: gemBestTime,
      createdAt: new Date().toISOString(),
    };
    
    addGemMutation.mutate(newGem);
  };
  
  // Handle update gem
  const handleUpdateGem = () => {
    const updatedGem = {
      name: gemName,
      description: gemDescription,
      location: gemLocation,
      category: gemCategory,
      image: gemImage,
      featured: gemFeatured,
      accessTips: gemAccessTips,
      bestTime: gemBestTime,
      updatedAt: new Date().toISOString(),
    };
    
    updateGemMutation.mutate(updatedGem);
  };
  
  // Handle delete gem
  const handleDeleteGem = (gemId: string) => {
    if (confirm("Are you sure you want to delete this hidden gem? This action cannot be undone.")) {
      deleteGemMutation.mutate(gemId);
    }
  };
  
  // Handle featured toggle
  const handleToggleFeature = (gemId: string, featured: boolean) => {
    toggleFeatureMutation.mutate({ gemId, featured });
  };
  
  // Set form for editing
  const handleEditGem = (gem: any) => {
    setSelectedGemId(gem.id);
    setGemName(gem.name);
    setGemDescription(gem.description);
    setGemLocation(gem.location);
    setGemCategory(gem.category);
    setGemImage(gem.image);
    setGemFeatured(gem.featured || false);
    setGemAccessTips(gem.accessTips || "");
    setGemBestTime(gem.bestTime || "");
    setIsEditGemOpen(true);
  };
  
  // Reset form
  const resetForm = () => {
    setGemName("");
    setGemDescription("");
    setGemLocation("");
    setGemCategory("nature");
    setGemImage("");
    setGemFeatured(false);
    setGemAccessTips("");
    setGemBestTime("");
    setSelectedGemId(null);
  };
  
  // Filter gems based on search query
  const filteredGems = hiddenGems.filter((gem: any) => 
    gem.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gem.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gem.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get category name and color
  const getCategoryInfo = (categoryId: string) => {
    const category = GEM_CATEGORIES.find(cat => cat.id === categoryId);
    return category || { name: "Other", color: "bg-gray-500" };
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Hidden Gems Management</h2>
        
        <Dialog open={isAddGemOpen} onOpenChange={setIsAddGemOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Hidden Gem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Hidden Gem</DialogTitle>
              <DialogDescription>
                Add a secret spot that tourists don't usually know about.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="gem-name">Name</Label>
                <Input
                  id="gem-name"
                  placeholder="Enter hidden gem name"
                  value={gemName}
                  onChange={(e) => setGemName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="gem-description">Description</Label>
                <Textarea
                  id="gem-description"
                  placeholder="Enter a detailed description"
                  value={gemDescription}
                  onChange={(e) => setGemDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="gem-location">Location</Label>
                  <Input
                    id="gem-location"
                    placeholder="Enter location"
                    value={gemLocation}
                    onChange={(e) => setGemLocation(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="gem-category">Category</Label>
                  <select
                    id="gem-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={gemCategory}
                    onChange={(e) => setGemCategory(e.target.value)}
                  >
                    {GEM_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="gem-best-time">Best Time to Visit</Label>
                <Input
                  id="gem-best-time"
                  placeholder="E.g., Early morning, Sunset, Dry season"
                  value={gemBestTime}
                  onChange={(e) => setGemBestTime(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="gem-access-tips">Access Tips</Label>
                <Textarea
                  id="gem-access-tips"
                  placeholder="How to get there, special instructions"
                  value={gemAccessTips}
                  onChange={(e) => setGemAccessTips(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="gem-image">Image URL</Label>
                <Input
                  id="gem-image"
                  placeholder="Enter image URL (optional)"
                  value={gemImage}
                  onChange={(e) => setGemImage(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="gem-featured" 
                  checked={gemFeatured}
                  onCheckedChange={setGemFeatured}
                />
                <Label htmlFor="gem-featured">Feature on homepage</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddGemOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGem}>
                Add Hidden Gem
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Edit Hidden Gem Dialog */}
        <Dialog open={isEditGemOpen} onOpenChange={setIsEditGemOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Hidden Gem</DialogTitle>
              <DialogDescription>
                Update the details of this hidden gem.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-gem-name">Name</Label>
                <Input
                  id="edit-gem-name"
                  placeholder="Enter hidden gem name"
                  value={gemName}
                  onChange={(e) => setGemName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-gem-description">Description</Label>
                <Textarea
                  id="edit-gem-description"
                  placeholder="Enter a detailed description"
                  value={gemDescription}
                  onChange={(e) => setGemDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-gem-location">Location</Label>
                  <Input
                    id="edit-gem-location"
                    placeholder="Enter location"
                    value={gemLocation}
                    onChange={(e) => setGemLocation(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-gem-category">Category</Label>
                  <select
                    id="edit-gem-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={gemCategory}
                    onChange={(e) => setGemCategory(e.target.value)}
                  >
                    {GEM_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-gem-best-time">Best Time to Visit</Label>
                <Input
                  id="edit-gem-best-time"
                  placeholder="E.g., Early morning, Sunset, Dry season"
                  value={gemBestTime}
                  onChange={(e) => setGemBestTime(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-gem-access-tips">Access Tips</Label>
                <Textarea
                  id="edit-gem-access-tips"
                  placeholder="How to get there, special instructions"
                  value={gemAccessTips}
                  onChange={(e) => setGemAccessTips(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-gem-image">Image URL</Label>
                <Input
                  id="edit-gem-image"
                  placeholder="Enter image URL (optional)"
                  value={gemImage}
                  onChange={(e) => setGemImage(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-gem-featured" 
                  checked={gemFeatured}
                  onCheckedChange={setGemFeatured}
                />
                <Label htmlFor="edit-gem-featured">Feature on homepage</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditGemOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateGem}>
                Update Hidden Gem
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search bar */}
      <div className="relative w-full md:w-[400px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search hidden gems..."
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Hidden gems grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-filipino-teal border-t-transparent rounded-full"></div>
          </div>
        ) : filteredGems.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <Gem className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No hidden gems found</h3>
            <p className="text-muted-foreground">
              Add your first hidden gem to get started.
            </p>
          </div>
        ) : (
          filteredGems.map((gem: any) => (
            <Card key={gem.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <img
                  src={gem.image || "https://source.unsplash.com/random/800x600/?nature"}
                  alt={gem.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 bg-white/90 text-black" 
                    onClick={() => handleEditGem(gem)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 bg-white/90 text-black" 
                    onClick={() => handleDeleteGem(gem.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge className={getCategoryInfo(gem.category).color}>
                    {getCategoryInfo(gem.category).name}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="line-clamp-1">{gem.name}</span>
                  {gem.featured && (
                    <Badge variant="outline" className="ml-2 border-amber-500 text-amber-500">
                      Featured
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {gem.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                  {gem.description}
                </p>
                
                {gem.bestTime && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium">Best time to visit:</span> {gem.bestTime}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`feature-${gem.id}`}
                    checked={gem.featured || false}
                    onCheckedChange={(checked) => handleToggleFeature(gem.id, checked)}
                  />
                  <Label htmlFor={`feature-${gem.id}`} className="text-sm">
                    Feature
                  </Label>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-500" 
                  onClick={() => handleEditGem(gem)}
                >
                  Edit Details
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
