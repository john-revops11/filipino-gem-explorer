
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkIcon, Calendar, Heart, LogOut, MapPin, Settings, User, Bookmark } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock user data
const userData = {
  name: "Maria Santos",
  email: "maria@example.com",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
  location: "Manila, Philippines",
  bio: "Passionate traveler exploring the beautiful islands of the Philippines. Love food, culture, and adventure!",
  memberSince: "January 2024",
  interests: ["Beaches", "Food", "Cultural Heritage", "Island Hopping", "Adventure"],
};

// Mock saved trips
const savedItems = [
  {
    id: "save1",
    type: "destination",
    name: "Boracay Island",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    date: "Saved on Oct 15, 2024",
  },
  {
    id: "save2",
    type: "itinerary",
    name: "3 Days in Palawan",
    image: "https://images.unsplash.com/photo-1573790387438-4da905039392?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=725&q=80",
    date: "Saved on Sep 20, 2024",
  },
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(userData);

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    // In a real app, this would handle actual logout logic
  };

  return (
    <div className="min-h-screen pb-16">
      <Header title="Profile" showSearch={false} />
      
      <div className="p-4">
        <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-filipino-sand/30 mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{profile.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {profile.location}
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input 
                    id="bio" 
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  />
                </div>
                <Button onClick={handleSaveProfile} className="w-full">Save Profile</Button>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mt-4">{profile.bio}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="bg-filipino-teal/10 text-filipino-teal">
                      {interest}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Member since {profile.memberSince}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          {!isEditing && (
            <CardFooter className="border-t pt-4">
              <Button variant="ghost" className="text-filipino-red flex items-center" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="trips">My Trips</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved">
            <div className="grid grid-cols-1 gap-4 mt-4">
              {savedItems.map((item) => (
                <div key={item.id} className="flex rounded-lg overflow-hidden border">
                  <div className="w-1/3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-filipino-teal text-white">
                          {item.type === 'destination' ? 'Destination' : 'Itinerary'}
                        </Badge>
                      </div>
                      <h3 className="font-semibold mt-1">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm" className="h-8">
                        <Bookmark className="h-4 w-4 mr-1 fill-filipino-yellow" />
                        Saved
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trips">
            <div className="flex items-center justify-center h-40 text-center">
              <div>
                <p className="text-muted-foreground">You haven't booked any trips yet.</p>
                <Button className="mt-4 bg-filipino-terracotta">Start Planning</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="flex items-center justify-center h-40 text-center">
              <div>
                <p className="text-muted-foreground">You haven't left any reviews yet.</p>
                <Button className="mt-4 bg-filipino-terracotta">Start Exploring</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav />
    </div>
  );
}
