
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Filter, Flag, CalendarDays, Loader2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ItineraryCard } from "@/components/itinerary/ItineraryCard";
import { EmptyState } from "@/components/shared/EmptyState";
import databaseService, { Itinerary, Location } from "@/services/database-service";

export default function Itineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newItinerary, setNewItinerary] = useState({
    title: "",
    startDate: "",
    endDate: "",
    notes: "",
    destinations: [] as string[]
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch itineraries
        const publicItineraries = await databaseService.getPublicItineraries();
        
        // Fetch locations for the destinations dropdown
        const availableLocations = await databaseService.getLocations();
        
        setItineraries(publicItineraries);
        setLocations(availableLocations);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load itineraries", {
          description: "There was an error loading itineraries. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleCreateItinerary = async () => {
    // Validate form
    if (!newItinerary.title || !newItinerary.startDate || !newItinerary.endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Calculate number of days
      const startDate = new Date(newItinerary.startDate);
      const endDate = new Date(newItinerary.endDate);
      
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      // Format date range
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      };
      
      const dateRange = `${formatDate(startDate)}-${formatDate(endDate)}, ${endDate.getFullYear()}`;
      
      // Get selected destination names
      const selectedDestinations = newItinerary.destinations.map(destId => {
        const dest = locations.find(d => d.id === destId);
        return dest ? dest.name : '';
      }).filter(Boolean);
      
      if (selectedDestinations.length === 0) {
        toast({
          title: "Missing destination",
          description: "Please select at least one destination.",
          variant: "destructive"
        });
        return;
      }
      
      // Create new itinerary object
      const mainDestination = selectedDestinations[0];
      
      // Generate AI content based on the first selected destination
      const content = await databaseService.generateItinerary(mainDestination, diffDays, newItinerary.notes || "balanced itinerary");
      
      const newItineraryObj: Itinerary = {
        name: newItinerary.title,
        description: `${diffDays}-day trip to ${mainDestination}${selectedDestinations.length > 1 ? ' and other destinations' : ''}`,
        days: diffDays,
        location: {
          name: mainDestination
        },
        tags: ["Custom", ...selectedDestinations],
        content: content,
        created_by: "current-user", // Should be replaced with the actual user ID
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        duration: diffDays.toString(),
        destination: mainDestination,
        image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        status: 'planning',
        dateRange
      };
      
      // Save to database
      const itineraryId = await databaseService.saveItinerary(newItineraryObj);
      
      // Add to itineraries list
      setItineraries([{...newItineraryObj, id: itineraryId}, ...itineraries]);
      
      // Reset form
      setNewItinerary({
        title: "",
        startDate: "",
        endDate: "",
        notes: "",
        destinations: []
      });
      
      toast({
        title: "Itinerary created",
        description: "Your new itinerary has been created successfully."
      });
    } catch (error) {
      console.error("Error creating itinerary:", error);
      toast.error("Failed to create itinerary", {
        description: "There was an error creating your itinerary. Please try again."
      });
    }
  };
  
  const handleDestinationToggle = (destId: string) => {
    if (newItinerary.destinations.includes(destId)) {
      setNewItinerary({
        ...newItinerary,
        destinations: newItinerary.destinations.filter(id => id !== destId)
      });
    } else {
      setNewItinerary({
        ...newItinerary,
        destinations: [...newItinerary.destinations, destId]
      });
    }
  };

  // Return a loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen pb-16 bg-gradient-to-b from-white to-filipino-sand/10">
        <Header title="Itineraries" />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-filipino-teal mx-auto" />
            <p className="mt-4 text-filipino-darkGray">Loading itineraries...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-white to-filipino-sand/10">
      <Header title="Itineraries" />
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-filipino-darkGray">Your Adventures</h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-filipino-terracotta hover:bg-filipino-terracotta/90 gap-1">
                <Plus className="h-4 w-4" />
                New Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-center text-filipino-darkGray">Create New Adventure</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="itinerary-name">Trip Name</Label>
                  <Input 
                    id="itinerary-name" 
                    placeholder="e.g., Weekend Getaway to Palawan" 
                    value={newItinerary.title}
                    onChange={(e) => setNewItinerary({...newItinerary, title: e.target.value})}
                    className="border-filipino-teal/30 focus-visible:ring-filipino-teal"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="start-date" 
                        type="date" 
                        value={newItinerary.startDate}
                        onChange={(e) => setNewItinerary({...newItinerary, startDate: e.target.value})}
                        className="pl-10 border-filipino-teal/30 focus-visible:ring-filipino-teal"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="end-date" 
                        type="date" 
                        value={newItinerary.endDate}
                        onChange={(e) => setNewItinerary({...newItinerary, endDate: e.target.value})}
                        className="pl-10 border-filipino-teal/30 focus-visible:ring-filipino-teal"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label className="flex items-center gap-1">
                    <Flag className="h-4 w-4 text-filipino-terracotta" />
                    Destinations
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-1 max-h-40 overflow-y-auto bg-filipino-sand/10 rounded-md p-3">
                    {locations.map((destination) => (
                      <div key={destination.id} className="flex items-start space-x-2">
                        <Checkbox 
                          id={`destination-${destination.id}`} 
                          checked={newItinerary.destinations.includes(destination.id || '')}
                          onCheckedChange={() => handleDestinationToggle(destination.id || '')}
                          className="data-[state=checked]:bg-filipino-teal data-[state=checked]:border-filipino-teal"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={`destination-${destination.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {destination.name}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {destination.region}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-filipino-terracotta" />
                    Trip Notes
                  </Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Any special requirements or ideas for this trip..." 
                    value={newItinerary.notes}
                    onChange={(e) => setNewItinerary({...newItinerary, notes: e.target.value})}
                    className="min-h-[100px] border-filipino-teal/30 focus-visible:ring-filipino-teal"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleCreateItinerary} className="bg-filipino-terracotta hover:bg-filipino-terracotta/90">
                    Create Adventure
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {itineraries.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-filipino-sand/20">
                  <TabsTrigger 
                    value="all"
                    className="data-[state=active]:bg-filipino-teal data-[state=active]:text-white"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="upcoming"
                    className="data-[state=active]:bg-filipino-teal data-[state=active]:text-white"
                  >
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger 
                    value="planning"
                    className="data-[state=active]:bg-filipino-teal data-[state=active]:text-white"
                  >
                    Planning
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
                
                <TabsContent value="all" className="mt-4 space-y-4 animate-fade-in">
                  <div className="grid gap-4 md:grid-cols-2">
                    {itineraries.map((itinerary) => (
                      <ItineraryCard 
                        key={itinerary.id} 
                        itinerary={{
                          id: itinerary.id || '',
                          title: itinerary.name,
                          dateRange: itinerary.dateRange || `${itinerary.days} days`,
                          days: itinerary.days,
                          locations: [itinerary.destination || itinerary.location.name],
                          activities: 0,
                          coverImage: itinerary.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
                          status: itinerary.status || 'planning'
                        }} 
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="upcoming" className="mt-4 space-y-4 animate-fade-in">
                  <div className="grid gap-4 md:grid-cols-2">
                    {itineraries
                      .filter((itinerary) => itinerary.status === "upcoming")
                      .map((itinerary) => (
                        <ItineraryCard 
                          key={itinerary.id} 
                          itinerary={{
                            id: itinerary.id || '',
                            title: itinerary.name,
                            dateRange: itinerary.dateRange || `${itinerary.days} days`,
                            days: itinerary.days,
                            locations: [itinerary.destination || itinerary.location.name],
                            activities: 0,
                            coverImage: itinerary.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
                            status: itinerary.status || 'upcoming'
                          }} 
                        />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="planning" className="mt-4 space-y-4 animate-fade-in">
                  <div className="grid gap-4 md:grid-cols-2">
                    {itineraries
                      .filter((itinerary) => itinerary.status === "planning" || !itinerary.status)
                      .map((itinerary) => (
                        <ItineraryCard 
                          key={itinerary.id} 
                          itinerary={{
                            id: itinerary.id || '',
                            title: itinerary.name,
                            dateRange: itinerary.dateRange || `${itinerary.days} days`,
                            days: itinerary.days,
                            locations: [itinerary.destination || itinerary.location.name],
                            activities: 0,
                            coverImage: itinerary.image || "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
                            status: itinerary.status || 'planning'
                          }} 
                        />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : (
          <EmptyState 
            icon={Calendar}
            title="No Adventures Yet"
            description="Start planning your adventure in the Philippines by creating your first itinerary."
            action={
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-filipino-terracotta hover:bg-filipino-terracotta/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Adventure
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-center text-filipino-darkGray">Create New Adventure</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="itinerary-name-first">Trip Name</Label>
                      <Input 
                        id="itinerary-name-first" 
                        placeholder="e.g., Weekend Getaway to Palawan" 
                        value={newItinerary.title}
                        onChange={(e) => setNewItinerary({...newItinerary, title: e.target.value})}
                        className="border-filipino-teal/30 focus-visible:ring-filipino-teal"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="start-date-first">Start Date</Label>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="start-date-first" 
                            type="date" 
                            value={newItinerary.startDate}
                            onChange={(e) => setNewItinerary({...newItinerary, startDate: e.target.value})}
                            className="pl-10 border-filipino-teal/30 focus-visible:ring-filipino-teal"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="end-date-first">End Date</Label>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="end-date-first" 
                            type="date" 
                            value={newItinerary.endDate}
                            onChange={(e) => setNewItinerary({...newItinerary, endDate: e.target.value})}
                            className="pl-10 border-filipino-teal/30 focus-visible:ring-filipino-teal"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label className="flex items-center gap-1">
                        <Flag className="h-4 w-4 text-filipino-terracotta" />
                        Destinations
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-1 max-h-40 overflow-y-auto bg-filipino-sand/10 rounded-md p-3">
                        {locations.map((destination) => (
                          <div key={destination.id} className="flex items-start space-x-2">
                            <Checkbox 
                              id={`destination-first-${destination.id}`} 
                              checked={newItinerary.destinations.includes(destination.id || '')}
                              onCheckedChange={() => handleDestinationToggle(destination.id || '')}
                              className="data-[state=checked]:bg-filipino-teal data-[state=checked]:border-filipino-teal"
                            />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor={`destination-first-${destination.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {destination.name}
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {destination.region}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="notes-first" className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-filipino-terracotta" />
                        Trip Notes
                      </Label>
                      <Textarea 
                        id="notes-first" 
                        placeholder="Any special requirements or ideas for this trip..." 
                        value={newItinerary.notes}
                        onChange={(e) => setNewItinerary({...newItinerary, notes: e.target.value})}
                        className="min-h-[100px] border-filipino-teal/30 focus-visible:ring-filipino-teal"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={handleCreateItinerary} className="bg-filipino-terracotta hover:bg-filipino-terracotta/90">
                        Create Adventure
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            }
          />
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}
