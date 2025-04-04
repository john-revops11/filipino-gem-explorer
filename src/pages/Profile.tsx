
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

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
        />
      </div>
      
      <BottomNav />
    </div>
  );
}
