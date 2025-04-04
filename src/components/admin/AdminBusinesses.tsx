
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
import { Store, MapPin, Plus, Edit, Trash2, Search, Phone, Globe, Clock } from "lucide-react";
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

// Business categories
const BUSINESS_CATEGORIES = [
  { id: "restaurant", name: "Restaurant", color: "bg-orange-500" },
  { id: "cafe", name: "Café", color: "bg-amber-500" },
  { id: "shop", name: "Shop", color: "bg-green-500" },
  { id: "artisan", name: "Artisan", color: "bg-blue-500" },
  { id: "service", name: "Service", color: "bg-purple-500" },
  { id: "market", name: "Market", color: "bg-red-500" },
];

export function AdminBusinesses() {
  const [isAddBusinessOpen, setIsAddBusinessOpen] = useState(false);
  const [isEditBusinessOpen, setIsEditBusinessOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  
  // Form state
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [businessCategory, setBusinessCategory] = useState("restaurant");
  const [businessImage, setBusinessImage] = useState("");
  const [businessFeatured, setBusinessFeatured] = useState(false);
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [businessOwner, setBusinessOwner] = useState("");
  
  const queryClient = useQueryClient();
  
  // Fetch businesses
  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['admin', 'businesses'],
    queryFn: () => databaseService.getAllBusinesses(),
  });
  
  // Add business mutation
  const addBusinessMutation = useMutation({
    mutationFn: (newBusiness: any) => databaseService.addBusiness(newBusiness),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] });
      toast.success("Business added successfully");
      resetForm();
      setIsAddBusinessOpen(false);
    },
    onError: (error) => {
      console.error("Error adding business:", error);
      toast.error("Failed to add business");
    },
  });
  
  // Update business mutation
  const updateBusinessMutation = useMutation({
    mutationFn: (updatedBusiness: any) => databaseService.updateBusiness(selectedBusinessId!, updatedBusiness),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] });
      toast.success("Business updated successfully");
      resetForm();
      setIsEditBusinessOpen(false);
    },
    onError: (error) => {
      console.error("Error updating business:", error);
      toast.error("Failed to update business");
    },
  });
  
  // Delete business mutation
  const deleteBusinessMutation = useMutation({
    mutationFn: (businessId: string) => databaseService.deleteBusiness(businessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] });
      toast.success("Business deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting business:", error);
      toast.error("Failed to delete business");
    },
  });
  
  // Toggle feature status mutation
  const toggleFeatureMutation = useMutation({
    mutationFn: ({ businessId, featured }: { businessId: string; featured: boolean }) => 
      databaseService.updateBusinessFeaturedStatus(businessId, featured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] });
      toast.success("Featured status updated");
    },
    onError: (error) => {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
    },
  });
  
  // Handle form submission
  const handleAddBusiness = () => {
    const newBusiness = {
      name: businessName,
      description: businessDescription,
      location: businessLocation,
      category: businessCategory,
      image: businessImage || "https://source.unsplash.com/random/800x600/?business",
      featured: businessFeatured,
      phone: businessPhone,
      website: businessWebsite,
      hours: businessHours,
      owner: businessOwner,
      createdAt: new Date().toISOString(),
    };
    
    addBusinessMutation.mutate(newBusiness);
  };
  
  // Handle update business
  const handleUpdateBusiness = () => {
    const updatedBusiness = {
      name: businessName,
      description: businessDescription,
      location: businessLocation,
      category: businessCategory,
      image: businessImage,
      featured: businessFeatured,
      phone: businessPhone,
      website: businessWebsite,
      hours: businessHours,
      owner: businessOwner,
      updatedAt: new Date().toISOString(),
    };
    
    updateBusinessMutation.mutate(updatedBusiness);
  };
  
  // Handle delete business
  const handleDeleteBusiness = (businessId: string) => {
    if (confirm("Are you sure you want to delete this business? This action cannot be undone.")) {
      deleteBusinessMutation.mutate(businessId);
    }
  };
  
  // Handle featured toggle
  const handleToggleFeature = (businessId: string, featured: boolean) => {
    toggleFeatureMutation.mutate({ businessId, featured });
  };
  
  // Set form for editing
  const handleEditBusiness = (business: any) => {
    setSelectedBusinessId(business.id);
    setBusinessName(business.name);
    setBusinessDescription(business.description);
    setBusinessLocation(business.location);
    setBusinessCategory(business.category);
    setBusinessImage(business.image);
    setBusinessFeatured(business.featured || false);
    setBusinessPhone(business.phone || "");
    setBusinessWebsite(business.website || "");
    setBusinessHours(business.hours || "");
    setBusinessOwner(business.owner || "");
    setIsEditBusinessOpen(true);
  };
  
  // Reset form
  const resetForm = () => {
    setBusinessName("");
    setBusinessDescription("");
    setBusinessLocation("");
    setBusinessCategory("restaurant");
    setBusinessImage("");
    setBusinessFeatured(false);
    setBusinessPhone("");
    setBusinessWebsite("");
    setBusinessHours("");
    setBusinessOwner("");
    setSelectedBusinessId(null);
  };
  
  // Filter businesses based on search query
  const filteredBusinesses = businesses.filter((business: any) => 
    business.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.owner?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get category name and color
  const getCategoryInfo = (categoryId: string) => {
    const category = BUSINESS_CATEGORIES.find(cat => cat.id === categoryId);
    return category || { name: "Other", color: "bg-gray-500" };
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Local Businesses</h2>
        
        <Dialog open={isAddBusinessOpen} onOpenChange={setIsAddBusinessOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Business
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Local Business</DialogTitle>
              <DialogDescription>
                Add a local business to promote authentic experiences.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  placeholder="Enter business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="business-description">Description</Label>
                <Textarea
                  id="business-description"
                  placeholder="Enter a detailed description"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="business-location">Location</Label>
                  <Input
                    id="business-location"
                    placeholder="Enter location"
                    value={businessLocation}
                    onChange={(e) => setBusinessLocation(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="business-category">Category</Label>
                  <select
                    id="business-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                  >
                    {BUSINESS_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="business-phone">Phone Number</Label>
                  <Input
                    id="business-phone"
                    placeholder="Enter phone number"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="business-website">Website</Label>
                  <Input
                    id="business-website"
                    placeholder="Enter website URL"
                    value={businessWebsite}
                    onChange={(e) => setBusinessWebsite(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="business-hours">Business Hours</Label>
                <Input
                  id="business-hours"
                  placeholder="E.g., Mon-Fri: 9AM-5PM, Sat: 10AM-2PM"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="business-owner">Owner/Contact Person</Label>
                <Input
                  id="business-owner"
                  placeholder="Enter owner's name"
                  value={businessOwner}
                  onChange={(e) => setBusinessOwner(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="business-image">Image URL</Label>
                <Input
                  id="business-image"
                  placeholder="Enter image URL (optional)"
                  value={businessImage}
                  onChange={(e) => setBusinessImage(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="business-featured" 
                  checked={businessFeatured}
                  onCheckedChange={setBusinessFeatured}
                />
                <Label htmlFor="business-featured">Feature on homepage</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddBusinessOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBusiness}>
                Add Business
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Edit Business Dialog */}
        <Dialog open={isEditBusinessOpen} onOpenChange={setIsEditBusinessOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Business</DialogTitle>
              <DialogDescription>
                Update the details of this local business.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-business-name">Business Name</Label>
                <Input
                  id="edit-business-name"
                  placeholder="Enter business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-business-description">Description</Label>
                <Textarea
                  id="edit-business-description"
                  placeholder="Enter a detailed description"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-business-location">Location</Label>
                  <Input
                    id="edit-business-location"
                    placeholder="Enter location"
                    value={businessLocation}
                    onChange={(e) => setBusinessLocation(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-business-category">Category</Label>
                  <select
                    id="edit-business-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                  >
                    {BUSINESS_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-business-phone">Phone Number</Label>
                  <Input
                    id="edit-business-phone"
                    placeholder="Enter phone number"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-business-website">Website</Label>
                  <Input
                    id="edit-business-website"
                    placeholder="Enter website URL"
                    value={businessWebsite}
                    onChange={(e) => setBusinessWebsite(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-business-hours">Business Hours</Label>
                <Input
                  id="edit-business-hours"
                  placeholder="E.g., Mon-Fri: 9AM-5PM, Sat: 10AM-2PM"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-business-owner">Owner/Contact Person</Label>
                <Input
                  id="edit-business-owner"
                  placeholder="Enter owner's name"
                  value={businessOwner}
                  onChange={(e) => setBusinessOwner(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-business-image">Image URL</Label>
                <Input
                  id="edit-business-image"
                  placeholder="Enter image URL (optional)"
                  value={businessImage}
                  onChange={(e) => setBusinessImage(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-business-featured" 
                  checked={businessFeatured}
                  onCheckedChange={setBusinessFeatured}
                />
                <Label htmlFor="edit-business-featured">Feature on homepage</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditBusinessOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateBusiness}>
                Update Business
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
          placeholder="Search businesses..."
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Businesses grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-filipino-teal border-t-transparent rounded-full"></div>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <Store className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No businesses found</h3>
            <p className="text-muted-foreground">
              Add your first local business to get started.
            </p>
          </div>
        ) : (
          filteredBusinesses.map((business: any) => (
            <Card key={business.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <img
                  src={business.image || "https://source.unsplash.com/random/800x600/?business"}
                  alt={business.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 bg-white/90 text-black" 
                    onClick={() => handleEditBusiness(business)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 bg-white/90 text-black" 
                    onClick={() => handleDeleteBusiness(business.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge className={getCategoryInfo(business.category).color}>
                    {getCategoryInfo(business.category).name}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="line-clamp-1">{business.name}</span>
                  {business.featured && (
                    <Badge variant="outline" className="ml-2 border-amber-500 text-amber-500">
                      Featured
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {business.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {business.description}
                </p>
                
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {business.hours && (
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      {business.hours}
                    </div>
                  )}
                  
                  {business.phone && (
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 mr-1.5" />
                      {business.phone}
                    </div>
                  )}
                  
                  {business.website && (
                    <div className="flex items-center text-muted-foreground">
                      <Globe className="h-3.5 w-3.5 mr-1.5" />
                      <a 
                        href={business.website.startsWith('http') ? business.website : `https://${business.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="truncate hover:underline"
                      >
                        {business.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`feature-${business.id}`}
                    checked={business.featured || false}
                    onCheckedChange={(checked) => handleToggleFeature(business.id, checked)}
                  />
                  <Label htmlFor={`feature-${business.id}`} className="text-sm">
                    Feature
                  </Label>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-500" 
                  onClick={() => handleEditBusiness(business)}
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
