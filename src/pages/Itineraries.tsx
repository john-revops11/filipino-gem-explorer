
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusCircle, Search, Filter, MapPin, 
  Clock, ChevronDown, Users, X, Loader2, Check, Trash2,
  CalendarDays
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import databaseService, { Itinerary, Location } from "@/services/database-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth"; // Correct import for useAuth
import { Link, useNavigate } from "react-router-dom";
import { ItineraryCard } from "@/components/itinerary/ItineraryCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { motion } from "framer-motion";

export default function Itineraries() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [currentTab, setCurrentTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newItinerary, setNewItinerary] = useState({
    name: "",
    description: "",
    destination: "",
    days: 3,
  });
  
  const auth = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: itineraries = [], isLoading: isLoadingItineraries } = useQuery({
    queryKey: ['itineraries'],
    queryFn: () => databaseService.getItineraries(),
  });
  
  const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: () => databaseService.getLocations(),
  });
  
  const createItineraryMutation = useMutation({
    mutationFn: (itineraryData: Itinerary) => databaseService.addItinerary(itineraryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      setIsCreateDialogOpen(false);
      toast.success("Itinerary created successfully!");
      setNewItinerary({
        name: "",
        description: "",
        destination: "",
        days: 3,
      });
    },
    onError: (error) => {
      console.error("Error creating itinerary:", error);
      toast.error("Failed to create itinerary. Please try again.");
    },
  });
  
  const handleCreateItinerary = async () => {
    if (!auth.user) {
      toast.error("You must be logged in to create an itinerary");
      return;
    }

    if (!newItinerary.name || !newItinerary.destination) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedLocation = locations.find((loc: Location) => loc.name === newItinerary.destination);
    
    const itineraryData: Itinerary = {
      name: newItinerary.name,
      description: newItinerary.description,
      days: newItinerary.days,
      destinations: [newItinerary.destination],
      location: { name: newItinerary.destination },
      content: "",
      tags: ["travel", "user-created"],
      userId_created: auth.user.uid,
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: "draft",
      dateRange: `${new Date().toLocaleDateString()} - ${new Date(Date.now() + newItinerary.days * 86400000).toLocaleDateString()}`
    };
    
    createItineraryMutation.mutate(itineraryData);
  };
  
  const handleGenerateItinerary = async () => {
    if (!auth.user) {
      toast.error("You must be logged in to generate an itinerary");
      return;
    }

    if (!newItinerary.destination || newItinerary.days < 1) {
      toast.error("Please provide a destination and number of days");
      return;
    }

    setIsGeneratingItinerary(true);
    
    try {
      const itineraryData = await databaseService.generateItinerary({
        destination: newItinerary.destination,
        days: newItinerary.days
      });
      
      // Add additional metadata
      itineraryData.userId_created = auth.user.uid;
      
      // Save the generated itinerary
      const itineraryId = await databaseService.addItinerary(itineraryData);
      
      // Close dialog and show success message
      setIsCreateDialogOpen(false);
      toast.success("Itinerary generated successfully!");
      
      // Reset form
      setNewItinerary({
        name: "",
        description: "",
        destination: "",
        days: 3
      });
      
      // Refresh itineraries list
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      
      // Navigate to the new itinerary
      navigate(`/itineraries/${itineraryId}`);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast.error("Failed to generate itinerary. Please try again.");
    } finally {
      setIsGeneratingItinerary(false);
    }
  };
  
  const getFilteredItineraries = () => {
    let filtered = [...itineraries];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((itinerary: Itinerary) => 
        itinerary.name.toLowerCase().includes(query) || 
        itinerary.description?.toLowerCase().includes(query) ||
        itinerary.location?.name.toLowerCase().includes(query)
      );
    }
    
    // Filter by tab
    if (currentTab === "my-itineraries" && auth.user) {
      filtered = filtered.filter((itinerary: Itinerary) => 
        itinerary.userId_created === auth.user?.uid
      );
    } else if (currentTab === "drafts" && auth.user) {
      filtered = filtered.filter((itinerary: Itinerary) => 
        itinerary.userId_created === auth.user?.uid && 
        itinerary.status === "draft"
      );
    } else if (currentTab === "published" && auth.user) {
      filtered = filtered.filter((itinerary: Itinerary) => 
        itinerary.userId_created === auth.user?.uid && 
        itinerary.status === "published"
      );
    }
    
    return filtered;
  };
  
  const filteredItineraries = getFilteredItineraries();
  
  return (
    <div className="min-h-screen pb-16">
      <Header title="Itineraries" showSearch={false} />
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Itineraries</h1>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Itinerary</DialogTitle>
                <DialogDescription>
                  Start planning your trip or let AI generate an itinerary for you.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="name" className="text-right col-span-1">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="My Dream Vacation"
                    className="col-span-3"
                    value={newItinerary.name}
                    onChange={(e) => setNewItinerary({ ...newItinerary, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="description" className="text-right col-span-1">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="A brief description of your itinerary"
                    className="col-span-3"
                    value={newItinerary.description}
                    onChange={(e) => setNewItinerary({ ...newItinerary, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="destination" className="text-right col-span-1">
                    Destination
                  </Label>
                  <Select 
                    value={newItinerary.destination}
                    onValueChange={(value) => setNewItinerary({ ...newItinerary, destination: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location: Location) => (
                        <SelectItem key={location.id} value={location.name}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="days" className="text-right col-span-1">
                    Days
                  </Label>
                  <Input
                    id="days"
                    type="number"
                    min="1"
                    max="14"
                    className="col-span-3"
                    value={newItinerary.days}
                    onChange={(e) => setNewItinerary({ ...newItinerary, days: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={handleGenerateItinerary}
                  disabled={isGeneratingItinerary}
                  className="w-full sm:w-auto"
                >
                  {isGeneratingItinerary ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate with AI"
                  )}
                </Button>
                <Button 
                  onClick={handleCreateItinerary} 
                  className="w-full sm:w-auto"
                  disabled={createItineraryMutation.isPending}
                >
                  {createItineraryMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Manually"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <Tabs 
            defaultValue="all" 
            className="w-full"
            value={currentTab}
            onValueChange={setCurrentTab}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="my-itineraries">My Itineraries</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search itineraries..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("grid")}
          >
            <span className="text-lg">▤</span>
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("list")}
          >
            <span className="text-lg">≡</span>
          </Button>
        </div>
        
        {isLoadingItineraries ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredItineraries.length > 0 ? (
          view === "grid" ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {filteredItineraries.map((itinerary: Itinerary, index: number) => (
                <motion.div 
                  key={itinerary.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link to={`/itineraries/${itinerary.id}`}>
                    <Card className="cursor-pointer h-full hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex justify-between items-start gap-2">
                          <span className="line-clamp-1">{itinerary.name}</span>
                          {itinerary.status && (
                            <Badge variant={itinerary.status === "published" ? "default" : "secondary"}>
                              {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {itinerary.location.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {itinerary.days} {itinerary.days === 1 ? 'day' : 'days'}
                          {itinerary.dateRange && (
                            <span className="ml-2 text-xs">
                              {itinerary.dateRange}
                            </span>
                          )}
                        </div>
                        <p className="text-sm line-clamp-2 mt-2">{itinerary.description}</p>
                      </CardContent>
                      <CardFooter>
                        <div className="flex gap-1">
                          {itinerary.tags?.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredItineraries.map((itinerary: Itinerary) => (
                <Link key={itinerary.id} to={`/itineraries/${itinerary.id}`}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="col-span-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{itinerary.name}</h3>
                            {itinerary.status && (
                              <Badge variant={itinerary.status === "published" ? "default" : "secondary"}>
                                {itinerary.status}
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm mt-1 line-clamp-1">
                            {itinerary.description}
                          </p>
                        </div>
                        
                        <div className="col-span-1 flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{itinerary.location.name}</span>
                        </div>
                        
                        <div className="col-span-1 flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{itinerary.days} {itinerary.days === 1 ? 'day' : 'days'}</span>
                        </div>
                        
                        <div className="col-span-1 flex items-center gap-1 text-sm justify-end">
                          {itinerary.tags?.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )
        ) : (
          <EmptyState 
            icon={<CalendarDays className="h-12 w-12 text-muted-foreground" />}
            title="No itineraries found"
            description={
              searchQuery 
                ? "Try adjusting your search terms" 
                : "Create your first itinerary to get started"
            }
            action={
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Itinerary
              </Button>
            }
          />
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}
