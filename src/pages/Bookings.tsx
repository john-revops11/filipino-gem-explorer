
import { useState, useEffect } from "react";
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
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

type BookingType = {
  id: string;
  type: "accommodation" | "activity" | "transport";
  title: string;
  location: string;
  dateRange: string;
  status: "confirmed" | "pending";
  image: string;
  price: string;
  paymentStatus: "full" | "partial";
  paymentProgress?: number;
  confirmationCode: string;
  bookingDate: string;
};

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      setIsLoading(true);
      
      // In a real app, this would fetch from a database via API
      // For this demo, we'll check if the user is logged in
      if (user) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // User is logged in, but we don't have real bookings yet
        // Show empty state instead of mock data
        setBookings([]);
      } else {
        // User is not logged in
        setBookings([]);
      }
      
      setIsLoading(false);
    }
    
    fetchBookings();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen pb-16 bg-gradient-to-b from-white to-filipino-sand/10">
        <Header title="Bookings" />
        <div className="p-4 flex items-center justify-center min-h-[50vh]">
          <p className="text-filipino-terracotta animate-pulse">Loading your bookings...</p>
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
      
        {bookings.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No Bookings Yet"
            description="Your bookings for activities, accommodations, and experiences will appear here when you make them."
            action={
              <Link to="/explore">
                <Button className="bg-filipino-terracotta hover:bg-filipino-terracotta/90">
                  Explore Activities
                </Button>
              </Link>
            }
          />
        ) : (
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
                <Link to={`/booking/${booking.id}`} key={booking.id}>
                  <BookingCard booking={booking} />
                </Link>
              ))}
            </TabsContent>
            
            <TabsContent value="accommodation" className="mt-4 space-y-4 animate-fade-in">
              {bookings
                .filter((booking) => booking.type === "accommodation")
                .map((booking) => (
                  <Link to={`/booking/${booking.id}`} key={booking.id}>
                    <BookingCard booking={booking} />
                  </Link>
                ))}
            </TabsContent>
            
            <TabsContent value="activity" className="mt-4 space-y-4 animate-fade-in">
              {bookings
                .filter((booking) => booking.type === "activity")
                .map((booking) => (
                  <Link to={`/booking/${booking.id}`} key={booking.id}>
                    <BookingCard booking={booking} />
                  </Link>
                ))}
            </TabsContent>
            
            <TabsContent value="transport" className="mt-4 space-y-4 animate-fade-in">
              {bookings
                .filter((booking) => booking.type === "transport")
                .map((booking) => (
                  <Link to={`/booking/${booking.id}`} key={booking.id}>
                    <BookingCard booking={booking} />
                  </Link>
                ))}
            </TabsContent>
          </Tabs>
        )}
        
        {!user && (
          <div className="bg-filipino-sand/20 rounded-lg p-4 shadow-sm mt-8 border border-filipino-teal/10">
            <h3 className="font-semibold text-lg mb-3 flex items-center text-filipino-darkGray">
              <Calendar className="h-5 w-5 mr-2 text-filipino-terracotta" />
              Sign in to view your bookings
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sign in or create an account to view and manage your bookings and itineraries.
            </p>
            <Link to="/login">
              <Button className="bg-filipino-terracotta hover:bg-filipino-terracotta/90">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}
