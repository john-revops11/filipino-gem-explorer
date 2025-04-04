
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, Calendar, Clock, ChevronRight, ArrowRight, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookingCard } from "@/components/booking/BookingCard";
import { EmptyState } from "@/components/shared/EmptyState";

// Mock data for bookings
const mockBookings = [
  {
    id: "1",
    type: "accommodation",
    title: "Shangri-La Boracay Resort & Spa",
    location: "Boracay, Aklan",
    dateRange: "May 15-18, 2025",
    status: "confirmed",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925",
    price: "₱45,000",
    paymentStatus: "full",
    confirmationCode: "SLBR-12345",
    bookingDate: "January 15, 2025"
  },
  {
    id: "2",
    type: "activity",
    title: "Palawan Island Hopping Tour",
    location: "El Nido, Palawan",
    dateRange: "June 10, 2025",
    status: "pending",
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdbc75?q=80&w=1974",
    price: "₱2,500",
    paymentStatus: "partial",
    paymentProgress: 50,
    confirmationCode: "PLTOUR-6789",
    bookingDate: "February 2, 2025"
  },
  {
    id: "3",
    type: "transport",
    title: "Manila to Cebu - One-way Flight",
    location: "Manila to Cebu",
    dateRange: "April 5, 2025 • 8:30 AM",
    status: "confirmed",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074",
    price: "₱3,200",
    paymentStatus: "full",
    confirmationCode: "PAL-87654",
    bookingDate: "January 30, 2025"
  }
];

export default function Bookings() {
  const [bookings, setBookings] = useState(mockBookings);

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen pb-16 bg-gradient-to-b from-white to-filipino-sand/10">
        <Header title="Bookings" />
        
        <div className="p-4">
          <EmptyState
            icon={Bookmark}
            title="No Bookings Yet"
            description="Your bookings for activities, accommodations, and experiences will appear here."
            action={
              <Link to="/explore">
                <Button className="bg-filipino-terracotta hover:bg-filipino-terracotta/90">
                  Explore Activities
                </Button>
              </Link>
            }
          />
        </div>
        
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-white to-filipino-sand/10">
      <Header title="Bookings" />
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-filipino-darkGray">Your Bookings</h1>
          
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full grid-cols-4 bg-filipino-sand/20">
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-filipino-teal data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="accommodation"
              className="data-[state=active]:bg-filipino-teal data-[state=active]:text-white"
            >
              Stays
            </TabsTrigger>
            <TabsTrigger 
              value="activity"
              className="data-[state=active]:bg-filipino-teal data-[state=active]:text-white"
            >
              Activities
            </TabsTrigger>
            <TabsTrigger 
              value="transport"
              className="data-[state=active]:bg-filipino-teal data-[state=active]:text-white"
            >
              Transport
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4 space-y-4 animate-fade-in">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>
          
          <TabsContent value="accommodation" className="mt-4 space-y-4 animate-fade-in">
            {bookings
              .filter((booking) => booking.type === "accommodation")
              .map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
          </TabsContent>
          
          <TabsContent value="activity" className="mt-4 space-y-4 animate-fade-in">
            {bookings
              .filter((booking) => booking.type === "activity")
              .map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
          </TabsContent>
          
          <TabsContent value="transport" className="mt-4 space-y-4 animate-fade-in">
            {bookings
              .filter((booking) => booking.type === "transport")
              .map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
          </TabsContent>
        </Tabs>
        
        <div className="bg-filipino-sand/20 rounded-lg p-4 shadow-sm mt-8 border border-filipino-teal/10">
          <h3 className="font-semibold text-lg mb-3 flex items-center text-filipino-darkGray">
            <Calendar className="h-5 w-5 mr-2 text-filipino-terracotta" />
            Upcoming Trips
          </h3>
          <div className="flex items-center justify-between border-b border-filipino-terracotta/20 pb-3 mb-3">
            <div>
              <p className="font-medium">Boracay Getaway</p>
              <p className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-3 w-3 mr-1" /> May 15-18, 2025
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-transparent border-filipino-terracotta text-filipino-terracotta hover:bg-filipino-terracotta hover:text-white"
            >
              View Bookings <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <Link to="/itineraries" className="text-sm text-filipino-terracotta hover:underline flex items-center">
            View all trips <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
