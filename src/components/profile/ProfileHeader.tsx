
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, MapPin, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { toast } from "@/hooks/use-toast";

type ProfileHeaderProps = {
  profile: {
    name: string;
    email: string;
    avatar: string;
    location: string;
    bio: string;
    memberSince: string;
    interests: string[];
  };
  setProfile: (profile: any) => void;
};

export const ProfileHeader = ({ profile, setProfile }: ProfileHeaderProps) => {
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
  );
};
