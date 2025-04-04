
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, Calendar, Clock, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

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
      <div className="min-h-screen pb-16">
        <Header title="Bookings" />
        
        <div className="p-4">
          <div className="flex justify-center items-center flex-col py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Bookmark className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Your bookings for activities, accommodations, and experiences will appear here.
            </p>
            <Link to="/explore">
              <Button className="bg-filipino-terracotta hover:bg-filipino-terracotta/90">
                Explore Activities
              </Button>
            </Link>
          </div>
        </div>
        
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <Header title="Bookings" />
      
      <div className="p-4">
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="accommodation">Stays</TabsTrigger>
            <TabsTrigger value="activity">Activities</TabsTrigger>
            <TabsTrigger value="transport">Transport</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4 space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>
          
          <TabsContent value="accommodation" className="mt-4 space-y-4">
            {bookings
              .filter((booking) => booking.type === "accommodation")
              .map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
          </TabsContent>
          
          <TabsContent value="activity" className="mt-4 space-y-4">
            {bookings
              .filter((booking) => booking.type === "activity")
              .map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
          </TabsContent>
          
          <TabsContent value="transport" className="mt-4 space-y-4">
            {bookings
              .filter((booking) => booking.type === "transport")
              .map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
          </TabsContent>
        </Tabs>
        
        <div className="bg-filipino-sand/30 rounded-lg p-4 shadow-sm mt-8">
          <h3 className="font-semibold text-lg mb-3 flex items-center">
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

// Booking Card Component
function BookingCard({ booking }: { booking: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <div className="w-1/3">
          <img 
            src={booking.image} 
            alt={booking.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="w-2/3 p-3">
          <div className="flex items-center justify-between mb-1">
            <Badge 
              className="text-xs" 
              style={{
                backgroundColor: 
                  booking.type === 'accommodation' ? 'var(--filipino-teal)' : 
                  booking.type === 'activity' ? 'var(--filipino-vibrantGreen)' : 
                  'var(--filipino-vibrantBlue)'
              }}
            >
              {booking.type === 'accommodation' ? 'Stay' : 
               booking.type === 'activity' ? 'Activity' : 'Transport'}
            </Badge>
            <Badge 
              className="text-xs" 
              style={{
                backgroundColor: 
                  booking.status === 'confirmed' ? 'var(--filipino-vibrantGreen)' : 
                  'var(--filipino-vibrantOrange)'
              }}
            >
              {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
            </Badge>
          </div>
          
          <h3 className="font-semibold mb-1 line-clamp-1">{booking.title}</h3>
          
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <MapPin className="h-3 w-3 mr-1" />
            {booking.location}
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <Calendar className="h-3 w-3 mr-1" />
            {booking.dateRange}
          </div>
          
          {booking.paymentStatus === 'partial' && (
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Payment Progress</span>
                <span className="font-medium">{booking.paymentProgress}%</span>
              </div>
              <Progress value={booking.paymentProgress} className="h-2" />
            </div>
          )}
          
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-xs text-muted-foreground">Total Price</p>
              <p className="font-semibold">{booking.price}</p>
            </div>
            <Button variant="outline" size="sm" className="h-8">
              Details
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
