
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
import { Calendar as CalendarIcon, MapPin, Plus, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Sample event categories
const EVENT_CATEGORIES = [
  { id: "festival", name: "Festival", color: "bg-orange-500" },
  { id: "cultural", name: "Cultural", color: "bg-purple-500" },
  { id: "food", name: "Food", color: "bg-green-500" },
  { id: "music", name: "Music", color: "bg-blue-500" },
  { id: "sports", name: "Sports", color: "bg-red-500" },
  { id: "art", name: "Art", color: "bg-pink-500" },
];

export function AdminEvents() {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Form state
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventCategory, setEventCategory] = useState("festival");
  const [eventImage, setEventImage] = useState("");
  
  const queryClient = useQueryClient();
  
  // Fetch events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['admin', 'events'],
    queryFn: () => databaseService.getAllEvents(),
  });
  
  // Add event mutation
  const addEventMutation = useMutation({
    mutationFn: (newEvent: any) => databaseService.addEvent(newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] });
      toast.success("Event added successfully");
      resetForm();
      setIsAddEventOpen(false);
    },
    onError: (error) => {
      console.error("Error adding event:", error);
      toast.error("Failed to add event");
    },
  });
  
  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: (updatedEvent: any) => databaseService.updateEvent(selectedEventId!, updatedEvent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] });
      toast.success("Event updated successfully");
      resetForm();
      setIsEditEventOpen(false);
    },
    onError: (error) => {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    },
  });
  
  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => databaseService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] });
      toast.success("Event deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    },
  });
  
  // Handle form submission
  const handleAddEvent = () => {
    const newEvent = {
      name: eventName,
      description: eventDescription,
      location: eventLocation,
      category: eventCategory,
      date: date!.toISOString(),
      image: eventImage || "https://source.unsplash.com/random/800x600/?event",
      createdAt: new Date().toISOString(),
    };
    
    addEventMutation.mutate(newEvent);
  };
  
  // Handle update event
  const handleUpdateEvent = () => {
    const updatedEvent = {
      name: eventName,
      description: eventDescription,
      location: eventLocation,
      category: eventCategory,
      date: date!.toISOString(),
      image: eventImage,
      updatedAt: new Date().toISOString(),
    };
    
    updateEventMutation.mutate(updatedEvent);
  };
  
  // Handle delete event
  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      deleteEventMutation.mutate(eventId);
    }
  };
  
  // Set form for editing
  const handleEditEvent = (event: any) => {
    setSelectedEventId(event.id);
    setEventName(event.name);
    setEventDescription(event.description);
    setEventLocation(event.location);
    setEventCategory(event.category);
    setDate(new Date(event.date));
    setEventImage(event.image);
    setIsEditEventOpen(true);
  };
  
  // Reset form
  const resetForm = () => {
    setEventName("");
    setEventDescription("");
    setEventLocation("");
    setEventCategory("festival");
    setDate(new Date());
    setEventImage("");
    setSelectedEventId(null);
  };
  
  // Group events by category
  const eventsByCategory: Record<string, any[]> = {};
  EVENT_CATEGORIES.forEach(category => {
    eventsByCategory[category.id] = events.filter((event: any) => event.category === category.id);
  });
  
  // Filter upcoming and past events
  const currentDate = new Date();
  const upcomingEvents = events.filter((event: any) => new Date(event.date) >= currentDate);
  const pastEvents = events.filter((event: any) => new Date(event.date) < currentDate);
  
  // Get category color
  const getCategoryColor = (categoryId: string) => {
    const category = EVENT_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.color : "bg-gray-500";
  };
  
  // Get category name
  const getCategoryName = (categoryId: string) => {
    const category = EVENT_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Event Management</h2>
        
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Create a new cultural or local event. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="event-name">Event Name</Label>
                <Input
                  id="event-name"
                  placeholder="Enter event name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  placeholder="Enter event description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-location">Location</Label>
                  <Input
                    id="event-location"
                    placeholder="Enter event location"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="event-category">Category</Label>
                  <select
                    id="event-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                  >
                    {EVENT_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="event-image">Image URL</Label>
                <Input
                  id="event-image"
                  placeholder="Enter image URL (optional)"
                  value={eventImage}
                  onChange={(e) => setEventImage(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Edit Event Dialog */}
        <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>
                Update the event details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-event-name">Event Name</Label>
                <Input
                  id="edit-event-name"
                  placeholder="Enter event name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-event-description">Description</Label>
                <Textarea
                  id="edit-event-description"
                  placeholder="Enter event description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-event-location">Location</Label>
                  <Input
                    id="edit-event-location"
                    placeholder="Enter event location"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-event-category">Category</Label>
                  <select
                    id="edit-event-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                  >
                    {EVENT_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-event-image">Image URL</Label>
                <Input
                  id="edit-event-image"
                  placeholder="Enter image URL (optional)"
                  value={eventImage}
                  onChange={(e) => setEventImage(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditEventOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateEvent}>
                Update Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-filipino-teal border-t-transparent rounded-full"></div>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No upcoming events found.</p>
              </div>
            ) : (
              upcomingEvents.map((event: any) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onEdit={() => handleEditEvent(event)}
                  onDelete={() => handleDeleteEvent(event.id)}
                  getCategoryColor={getCategoryColor}
                  getCategoryName={getCategoryName}
                />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-filipino-teal border-t-transparent rounded-full"></div>
              </div>
            ) : pastEvents.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No past events found.</p>
              </div>
            ) : (
              pastEvents.map((event: any) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onEdit={() => handleEditEvent(event)}
                  onDelete={() => handleDeleteEvent(event.id)}
                  getCategoryColor={getCategoryColor}
                  getCategoryName={getCategoryName}
                />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="space-y-6">
            {EVENT_CATEGORIES.map((category) => (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge className={category.color}>{category.name}</Badge>
                  <h3 className="text-lg font-medium">{category.name} Events</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    <div className="col-span-full flex items-center justify-center py-10">
                      <div className="animate-spin h-8 w-8 border-4 border-filipino-teal border-t-transparent rounded-full"></div>
                    </div>
                  ) : eventsByCategory[category.id].length === 0 ? (
                    <div className="col-span-full text-center py-4">
                      <p className="text-muted-foreground">No {category.name.toLowerCase()} events found.</p>
                    </div>
                  ) : (
                    eventsByCategory[category.id].map((event: any) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onEdit={() => handleEditEvent(event)}
                        onDelete={() => handleDeleteEvent(event.id)}
                        getCategoryColor={getCategoryColor}
                        getCategoryName={getCategoryName}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Event Card Component
function EventCard({ 
  event, 
  onEdit, 
  onDelete,
  getCategoryColor,
  getCategoryName
}: { 
  event: any;
  onEdit: () => void;
  onDelete: () => void;
  getCategoryColor: (categoryId: string) => string;
  getCategoryName: (categoryId: string) => string;
}) {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate >= new Date();
  
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <img
          src={event.image || "https://source.unsplash.com/random/800x600/?event"}
          alt={event.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 text-black" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 text-black" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge className={`${getCategoryColor(event.category)}`}>
            {getCategoryName(event.category)}
          </Badge>
          {!isUpcoming && (
            <Badge variant="outline" className="ml-2 bg-black/70 text-white border-none">
              Past Event
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="line-clamp-1">{event.name}</CardTitle>
        <CardDescription className="flex items-center">
          <CalendarIcon className="mr-1 h-4 w-4" />
          {format(eventDate, "PPP")}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {event.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          {event.location}
        </div>
      </CardFooter>
    </Card>
  );
}
