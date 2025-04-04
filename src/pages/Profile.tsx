
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, MapPin, Settings, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { SavedItems } from "@/components/profile/SavedItems";
import { UserActivity } from "@/components/profile/UserActivity";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

// Mock saved items
const savedItems = [
  {
    id: "save1",
    type: "destination" as const,
    name: "Boracay Island",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    date: "Saved on Oct 15, 2024",
  },
  {
    id: "save2",
    type: "itinerary" as const,
    name: "3 Days in Palawan",
    image: "https://images.unsplash.com/photo-1573790387438-4da905039392?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=725&q=80",
    date: "Saved on Sep 20, 2024",
  },
];

// Mock user activity
const userActivity = [
  {
    id: "act1",
    type: "visit" as const,
    title: "Chocolate Hills",
    location: "Bohol",
    date: "April 1, 2024",
  },
  {
    id: "act2",
    type: "review" as const,
    title: "El Nido Resorts",
    location: "Palawan",
    date: "March 22, 2024", 
    rating: 5,
  },
  {
    id: "act3",
    type: "booking" as const,
    title: "Island Hopping Tour",
    location: "Coron, Palawan",
    date: "Booked for May 15, 2024",
  },
];

export default function Profile() {
  const [profile, setProfile] = useState(userData);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSaveProfile = (updatedProfile: any) => {
    setProfile({...profile, ...updatedProfile});
    setIsSettingsOpen(false);
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
              
              <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="py-6">
                    <h2 className="text-lg font-semibold mb-6">Edit Profile</h2>
                    <ProfileSettings 
                      profile={profile}
                      onSave={handleSaveProfile}
                      onCancel={() => setIsSettingsOpen(false)}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mt-4">{profile.bio}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.interests.map((interest) => (
                <span key={interest} className="px-2 py-1 rounded-full text-xs bg-filipino-teal/10 text-filipino-teal">
                  {interest}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="ghost" className="text-filipino-terracotta flex items-center" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardFooter>
        </Card>
        
        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="trips">My Trips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved">
            <SavedItems items={savedItems} />
          </TabsContent>
          
          <TabsContent value="activity">
            <UserActivity activities={userActivity} />
          </TabsContent>
          
          <TabsContent value="trips">
            <div className="flex items-center justify-center h-40 text-center">
              <div>
                <User className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">You haven't booked any trips yet.</p>
                <Button className="mt-4 bg-filipino-terracotta">Start Planning</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav />
    </div>
  );
}
