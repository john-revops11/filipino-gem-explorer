
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { SavedItems } from "@/components/profile/SavedItems";
import { UserActivity } from "@/components/profile/UserActivity";

type SavedItem = {
  id: string;
  type: 'destination' | 'itinerary';
  name: string;
  image: string;
  date: string;
};

type ActivityItem = {
  id: string;
  type: 'visit' | 'review' | 'booking';
  title: string;
  location: string;
  date: string;
  image?: string;
  rating?: number;
};

type ProfileTabsProps = {
  savedItems: SavedItem[];
  userActivity: ActivityItem[];
  userId?: string; // Make userId an optional prop
};

export const ProfileTabs = ({ savedItems, userActivity, userId }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="saved" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="saved">Saved</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="trips">My Trips</TabsTrigger>
      </TabsList>
      
      <TabsContent value="saved">
        <SavedItems userId={userId} />
      </TabsContent>
      
      <TabsContent value="activity">
        <UserActivity activities={userActivity} />
      </TabsContent>
      
      <TabsContent value="trips">
        <div className="flex items-center justify-center h-40 text-center">
          <div>
            <User className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">You haven't booked any trips yet.</p>
            <Link to="/itineraries">
              <Button className="mt-4 bg-filipino-terracotta">Start Planning</Button>
            </Link>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
