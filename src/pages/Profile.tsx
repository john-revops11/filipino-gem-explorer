
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import databaseService from "@/services/database-service";

// Default user data for non-logged in users or when data is loading
const defaultUserData = {
  name: "Guest User",
  email: "guest@example.com",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
  location: "Philippines",
  bio: "Join our community to personalize your experience!",
  memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  interests: ["Beaches", "Food", "Cultural Heritage"],
};

export default function Profile() {
  const [profile, setProfile] = useState(defaultUserData);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedItems, setSavedItems] = useState([]);
  const [userActivity, setUserActivity] = useState([]);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      
      if (user) {
        // User is logged in
        setUserId(user.uid);
        
        // Here you would typically fetch the user profile from your database
        // For now, we'll just use some dummy data with the user's email
        setProfile({
          ...defaultUserData,
          name: user.displayName || "Filipino Traveler",
          email: user.email || "user@example.com",
          avatar: user.photoURL || defaultUserData.avatar,
          memberSince: new Date(user.metadata.creationTime || Date.now()).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          }),
        });
        
        try {
          // Fetch saved items for the user
          const userItineraries = await databaseService.getUserItineraries(user.uid);
          
          // Fetch user activity (mock data for now)
          // In a real app, you would have a separate collection for user activity
          const activity = [
            {
              id: "act1",
              type: "visit" as const,
              title: "Visited Profile Page",
              location: "App",
              date: new Date().toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              }),
            }
          ];
          
          // Update state
          setSavedItems(userItineraries);
          setUserActivity(activity);
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load user data", {
            description: "There was an error loading your profile data. Please try again."
          });
        }
      } else {
        // No user is logged in
        setUserId(null);
        setProfile(defaultUserData);
        setSavedItems([]);
        setUserActivity([]);
      }
      
      setIsLoading(false);
    });
    
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pb-16">
        <Header title="Profile" showSearch={false} />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-filipino-teal mx-auto" />
            <p className="mt-4 text-filipino-darkGray">Loading profile...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <Header title="Profile" showSearch={false} />
      
      <div className="p-4">
        <ProfileHeader 
          profile={profile} 
          setProfile={setProfile} 
        />
        
        <ProfileTabs 
          savedItems={savedItems} 
          userActivity={userActivity}
          userId={userId} // Pass userId as a prop to ProfileTabs
        />
      </div>
      
      <BottomNav />
    </div>
  );
}
