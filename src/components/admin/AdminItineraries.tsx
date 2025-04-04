import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { addDays, isBefore } from 'date-fns';
import { auth } from "@/services/firebase";
import databaseService, { Itinerary } from "@/services/database-service";

const AdminItineraries = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState<number>(1);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [locationName, setLocationName] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [createdAt, setCreatedAt] = useState<Date | undefined>(undefined);
  const [updatedAt, setUpdatedAt] = useState<Date | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const fetchedItineraries = await databaseService.getItineraries();
      setItineraries(fetchedItineraries);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch itineraries"
      });
    }
  };

  const handleOpenDialog = (itinerary: Itinerary) => {
    setSelectedItinerary(itinerary);
    setIsDialogOpen(true);
    setIsEditing(false);

    // Populate the form fields with the selected itinerary data
    setName(itinerary.name);
    setDescription(itinerary.description);
    setDays(itinerary.days);
    setDestinations(itinerary.destinations);
    setLocationName(itinerary.location.name);
    setContent(itinerary.content);
    setTags(itinerary.tags);
    setIsPublic(itinerary.is_public);
    setCreatedAt(itinerary.createdAt ? new Date(itinerary.createdAt) : undefined);
    setUpdatedAt(itinerary.updatedAt ? new Date(itinerary.updatedAt) : undefined);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedItinerary(null);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!selectedItinerary) return;

    try {
      setIsSaving(true);
      const currentTime = new Date().toISOString();

      const updatedItineraryData: Itinerary = {
        ...selectedItinerary,
        name: name,
        description: description,
        days: days,
        destinations: destinations,
        location: {
          name: locationName
        },
        content: content,
        tags: tags,
        is_public: isPublic,
        updated_at: currentTime,
        createdAt: createdAt ? createdAt.toISOString() : currentTime,
        updatedAt: currentTime
      };

      await databaseService.updateItinerary(selectedItinerary.id, updatedItineraryData);
      toast({
        title: "Success",
        description: "Itinerary updated successfully"
      });
      fetchItineraries(); // Refresh the itineraries list
    } catch (error) {
      console.error("Error updating itinerary:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update itinerary"
      });
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedItinerary) return;

    try {
      setIsDeleting(true);
      await databaseService.deleteItinerary(selectedItinerary.id);
      toast({
        title: "Success",
        description: "Itinerary deleted successfully"
      });
      fetchItineraries(); // Refresh the itineraries list
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete itinerary"
      });
    } finally {
      setIsDeleting(false);
      handleCloseDialog();
    }
  };

  const handleCreateItinerary = async () => {
    try {
      setIsSaving(true);
      const currentTime = new Date().toISOString();

      const itineraryData: Itinerary = {
        name: name,
        description: description,
        days: days,
        destinations: destinations,
        location: {
          name: locationName
        },
        content: content,
        tags: tags,
        userId_created: auth.currentUser?.uid || 'admin',
        is_public: isPublic,
        created_at: currentTime,
        updated_at: currentTime,
        createdAt: currentTime
      };

      await databaseService.addItinerary(itineraryData);
      toast({
        title: "Success",
        description: "Itinerary created successfully"
      });
      fetchItineraries(); // Refresh the itineraries list
    } catch (error) {
      console.error("Error creating itinerary:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create itinerary"
      });
    } finally {
      setIsSaving(false);
      handleCloseDialog();
    }
  };

  const filteredItineraries = itineraries.filter(itinerary =>
    itinerary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    itinerary.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search itineraries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Destinations</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItineraries.map((itinerary) => (
            <TableRow key={itinerary.id}>
              <TableCell>{itinerary.name}</TableCell>
              <TableCell>{itinerary.days}</TableCell>
              <TableCell>{itinerary.destinations.join(', ')}</TableCell>
              <TableCell>{itinerary.createdAt}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenDialog(itinerary)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => {
            setSelectedItinerary(null);
            setIsDialogOpen(true);
            setIsEditing(true);
            setName('');
            setDescription('');
            setDays(1);
            setDestinations([]);
            setLocationName('');
            setContent('');
            setTags([]);
            setIsPublic(true);
            setCreatedAt(undefined);
            setUpdatedAt(undefined);
          }}>
            Create Itinerary
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[80%]">
          <DialogHeader>
            <DialogTitle>{selectedItinerary ? (isEditing ? 'Edit Itinerary' : 'View Itinerary') : 'Create Itinerary'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="days" className="text-right">
                Days
              </Label>
              <Input
                type="number"
                id="days"
                value={days.toString()}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="col-span-3"
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destinations" className="text-right">
                Destinations
              </Label>
              <Input
                id="destinations"
                value={destinations.join(', ')}
                onChange={(e) => setDestinations(e.target.value.split(',').map(s => s.trim()))}
                className="col-span-3"
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locationName" className="text-right">
                Location Name
              </Label>
              <Input
                id="locationName"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="col-span-3"
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3"
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                value={tags.join(', ')}
                onChange={(e) => setTags(e.target.value.split(',').map(s => s.trim()))}
                className="col-span-3"
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isPublic" className="text-right">
                Is Public
              </Label>
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked)}
                className="col-span-3"
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="createdAt" className="text-right">
                Created At
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !createdAt && "text-muted-foreground"
                    )}
                    disabled={!isEditing}
                  >
                    {createdAt ? format(createdAt, "PPP") : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={createdAt}
                    onSelect={setCreatedAt}
                    disabled={isBefore(new Date(), addDays(new Date(), -1))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="updatedAt" className="text-right">
                Updated At
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !updatedAt && "text-muted-foreground"
                    )}
                    disabled={!isEditing}
                  >
                    {updatedAt ? format(updatedAt, "PPP") : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={updatedAt}
                    onSelect={setUpdatedAt}
                    disabled={isBefore(new Date(), addDays(new Date(), -1))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end">
            {selectedItinerary ? (
              isEditing ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={handleCloseDialog}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="ml-2 bg-filipino-terracotta hover:bg-filipino-terracotta/90"
                    onClick={handleSaveClick}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        Saving...
                      </>
                    ) : (
                      <>
                        Save
                      </>
                    )}
                  </Button>
                  <Button
                    className="ml-2 bg-red-500 hover:bg-red-500/90"
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        Deleting...
                      </>
                    ) : (
                      <>
                        Delete
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={handleCloseDialog}
                  >
                    Close
                  </Button>
                  <Button
                    className="ml-2 bg-filipino-teal hover:bg-filipino-teal/90"
                    onClick={handleEditClick}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </>
              )
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={handleCloseDialog}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  className="ml-2 bg-filipino-terracotta hover:bg-filipino-terracotta/90"
                  onClick={handleCreateItinerary}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      Saving...
                    </>
                  ) : (
                    <>
                      Create
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminItineraries;
