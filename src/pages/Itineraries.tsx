
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MapPin, ChevronRight, Clock, Palmtree, Filter, Flag, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "@/hooks/use-toast";
import { ItineraryCard } from "@/components/itinerary/ItineraryCard";
import { EmptyState } from "@/components/shared/EmptyState";

// Mock data for itineraries
const mockItineraries = [
  {
    id: "1",
    title: "Weekend in Boracay",
    dateRange: "May 15-18, 2025",
    days: 4,
    locations: ["Boracay", "Aklan"],
    activities: 12,
    coverImage: "https://images.unsplash.com/photo-1551966775-a4ddc8df052b?q=80&w=2070",
    status: "upcoming"
  },
  {
    id: "2",
    title: "Cultural Tour of Vigan",
    dateRange: "June 5-8, 2025",
    days: 4,
    locations: ["Vigan", "Ilocos Sur"],
    activities: 8,
    coverImage: "https://images.unsplash.com/photo-1646622566863-1e2c04784ae1?q=80&w=2071",
    status: "planning"
  },
  {
    id: "3",
    title: "Island Hopping in Coron",
    dateRange: "July 20-25, 2025",
    days: 6,
    locations: ["Coron", "Palawan"],
    activities: 15,
    coverImage: "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=725",
    status: "planning"
  }
];

// Destinations data for new itinerary creation
const popularDestinations = [
  { id: "bora", name: "Boracay", region: "Western Visayas" },
  { id: "pal", name: "El Nido, Palawan", region: "MIMAROPA" },
  { id: "cebu", name: "Cebu", region: "Central Visayas" },
  { id: "bohol", name: "Bohol", region: "Central Visayas" },
  { id: "siargao", name: "Siargao", region: "Caraga" },
  { id: "manila", name: "Manila", region: "NCR" },
  { id: "banaue", name: "Banaue Rice Terraces", region: "Cordillera" },
  { id: "batanes", name: "Batanes", region: "Cagayan Valley" },
];

export default function Itineraries() {
  const [itineraries, setItineraries] = useState(mockItineraries);
  const [newItinerary, setNewItinerary] = useState({
    title: "",
    startDate: "",
    endDate: "",
    notes: "",
    destinations: [] as string[]
  });
  
  const handleCreateItinerary = () => {
    // Validate form
    if (!newItinerary.title || !newItinerary.startDate || !newItinerary.endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Create new itinerary object
    const startDate = new Date(newItinerary.startDate);
    const endDate = new Date(newItinerary.endDate);
    
    // Calculate number of days
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Format date range
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    const dateRange = `${formatDate(startDate)}-${formatDate(endDate)}, ${endDate.getFullYear()}`;
    
    // Get selected destination names
    const selectedDestinations = newItinerary.destinations.map(destId => {
      const dest = popularDestinations.find(d => d.id === destId);
      return dest ? dest.name : '';
    }).filter(Boolean);
    
    const newItineraryObj = {
      id: (itineraries.length + 1).toString(),
      title: newItinerary.title,
      dateRange,
      days: diffDays,
      locations: selectedDestinations,
      activities: 0,
      coverImage: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070",
      status: "planning"
    };
    
    // Add to itineraries list
    setItineraries([newItineraryObj, ...itineraries]);
    
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
                    {popularDestinations.map((destination) => (
                      <div key={destination.id} className="flex items-start space-x-2">
                        <Checkbox 
                          id={`destination-${destination.id}`} 
                          checked={newItinerary.destinations.includes(destination.id)}
                          onCheckedChange={() => handleDestinationToggle(destination.id)}
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
                    <Palmtree className="h-4 w-4 text-filipino-terracotta" />
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
                      <ItineraryCard key={itinerary.id} itinerary={itinerary} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="upcoming" className="mt-4 space-y-4 animate-fade-in">
                  <div className="grid gap-4 md:grid-cols-2">
                    {itineraries
                      .filter((itinerary) => itinerary.status === "upcoming")
                      .map((itinerary) => (
                        <ItineraryCard key={itinerary.id} itinerary={itinerary} />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="planning" className="mt-4 space-y-4 animate-fade-in">
                  <div className="grid gap-4 md:grid-cols-2">
                    {itineraries
                      .filter((itinerary) => itinerary.status === "planning")
                      .map((itinerary) => (
                        <ItineraryCard key={itinerary.id} itinerary={itinerary} />
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
                  {/* Same dialog content as above */}
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
                        {popularDestinations.map((destination) => (
                          <div key={destination.id} className="flex items-start space-x-2">
                            <Checkbox 
                              id={`destination-first-${destination.id}`} 
                              checked={newItinerary.destinations.includes(destination.id)}
                              onCheckedChange={() => handleDestinationToggle(destination.id)}
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
                        <Palmtree className="h-4 w-4 text-filipino-terracotta" />
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
