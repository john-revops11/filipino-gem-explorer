
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MapPin, ChevronRight, Clock } from "lucide-react";
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
    <div className="min-h-screen pb-16">
      <Header title="Itineraries" />
      
      <div className="p-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full mb-6 bg-filipino-terracotta hover:bg-filipino-terracotta/90">
              <Plus className="h-4 w-4 mr-2" />
              Create New Itinerary
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Itinerary</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="itinerary-name">Itinerary Name</Label>
                <Input 
                  id="itinerary-name" 
                  placeholder="e.g., Weekend Getaway to Palawan" 
                  value={newItinerary.title}
                  onChange={(e) => setNewItinerary({...newItinerary, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input 
                    id="start-date" 
                    type="date" 
                    value={newItinerary.startDate}
                    onChange={(e) => setNewItinerary({...newItinerary, startDate: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input 
                    id="end-date" 
                    type="date" 
                    value={newItinerary.endDate}
                    onChange={(e) => setNewItinerary({...newItinerary, endDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Destinations</Label>
                <div className="grid grid-cols-2 gap-2 mt-1 max-h-40 overflow-y-auto">
                  {popularDestinations.map((destination) => (
                    <div key={destination.id} className="flex items-start space-x-2">
                      <Checkbox 
                        id={`destination-${destination.id}`} 
                        checked={newItinerary.destinations.includes(destination.id)}
                        onCheckedChange={() => handleDestinationToggle(destination.id)}
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
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Any special requirements or ideas for this trip..." 
                  value={newItinerary.notes}
                  onChange={(e) => setNewItinerary({...newItinerary, notes: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleCreateItinerary} className="bg-filipino-terracotta hover:bg-filipino-terracotta/90">Create</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {itineraries.length > 0 ? (
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4 space-y-4">
              {itineraries.map((itinerary) => (
                <ItineraryCard key={itinerary.id} itinerary={itinerary} />
              ))}
            </TabsContent>
            
            <TabsContent value="upcoming" className="mt-4 space-y-4">
              {itineraries
                .filter((itinerary) => itinerary.status === "upcoming")
                .map((itinerary) => (
                  <ItineraryCard key={itinerary.id} itinerary={itinerary} />
                ))}
            </TabsContent>
            
            <TabsContent value="planning" className="mt-4 space-y-4">
              {itineraries
                .filter((itinerary) => itinerary.status === "planning")
                .map((itinerary) => (
                  <ItineraryCard key={itinerary.id} itinerary={itinerary} />
                ))}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex justify-center items-center flex-col py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Itineraries Yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Start planning your adventure in the Philippines by creating your first itinerary.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-filipino-terracotta hover:bg-filipino-terracotta/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Itinerary
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                {/* Same dialog content as above */}
                <DialogHeader>
                  <DialogTitle>Create New Itinerary</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="itinerary-name-first">Itinerary Name</Label>
                    <Input 
                      id="itinerary-name-first" 
                      placeholder="e.g., Weekend Getaway to Palawan" 
                      value={newItinerary.title}
                      onChange={(e) => setNewItinerary({...newItinerary, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start-date-first">Start Date</Label>
                      <Input 
                        id="start-date-first" 
                        type="date" 
                        value={newItinerary.startDate}
                        onChange={(e) => setNewItinerary({...newItinerary, startDate: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="end-date-first">End Date</Label>
                      <Input 
                        id="end-date-first" 
                        type="date" 
                        value={newItinerary.endDate}
                        onChange={(e) => setNewItinerary({...newItinerary, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Destinations</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1 max-h-40 overflow-y-auto">
                      {popularDestinations.map((destination) => (
                        <div key={destination.id} className="flex items-start space-x-2">
                          <Checkbox 
                            id={`destination-first-${destination.id}`} 
                            checked={newItinerary.destinations.includes(destination.id)}
                            onCheckedChange={() => handleDestinationToggle(destination.id)}
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
                    <Label htmlFor="notes-first">Notes</Label>
                    <Textarea 
                      id="notes-first" 
                      placeholder="Any special requirements or ideas for this trip..." 
                      value={newItinerary.notes}
                      onChange={(e) => setNewItinerary({...newItinerary, notes: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleCreateItinerary} className="bg-filipino-terracotta hover:bg-filipino-terracotta/90">Create</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}

// Itinerary Card Component
function ItineraryCard({ itinerary }: { itinerary: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="h-32 relative">
        <img 
          src={itinerary.coverImage} 
          alt={itinerary.title}
          className="w-full h-full object-cover"
        />
        <Badge 
          className="absolute top-2 right-2" 
          style={{
            backgroundColor: itinerary.status === 'upcoming' 
              ? 'var(--filipino-teal)' 
              : 'var(--filipino-vibrantBlue)'
          }}
        >
          {itinerary.status === 'upcoming' ? 'Upcoming' : 'Planning'}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{itinerary.title}</h3>
        
        <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" /> 
            {itinerary.dateRange}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" /> 
            {itinerary.days} days
          </div>
          <div className="flex items-center text-muted-foreground col-span-2">
            <MapPin className="h-4 w-4 mr-2" /> 
            {itinerary.locations.join(', ')}
          </div>
        </div>
        
        <Button className="w-full mt-2" variant="outline">
          View Details <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
