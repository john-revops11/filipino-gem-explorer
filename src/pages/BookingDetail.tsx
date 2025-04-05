import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Download, 
  Share2, 
  MessageSquare
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

// This should match the BookingType in Bookings.tsx
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

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect to bookings page if no ID provided
    if (!id) {
      navigate('/bookings');
      return;
    }
    
    async function fetchBookingDetails() {
      setIsLoading(true);
      
      try {
        // In a real app, this would fetch from an API
        // For this demo, we'll check if user is logged in
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Since we're removing mock data, we'll always show booking not found
        setBooking(null);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        toast.error("Failed to load booking details");
        setBooking(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchBookingDetails();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen pb-16 bg-gradient-to-b from-white to-filipino-sand/10">
        <Header title="Booking Details" showSearch={false} />
        <div className="p-4 flex justify-center items-center h-[60vh]">
          <div className="animate-pulse text-filipino-terracotta">Loading booking details...</div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen pb-16 bg-gradient-to-b from-white to-filipino-sand/10">
        <Header title="Booking Details" showSearch={false} />
        <div className="p-4">
          <EmptyState
            icon={AlertCircle}
            title="Booking Not Found"
            description="We couldn't find the booking you're looking for. You need to make a booking first."
            action={
              <Link to="/bookings">
                <Button className="bg-filipino-terracotta hover:bg-filipino-terracotta/90">
                  Back to Bookings
                </Button>
              </Link>
            }
          />
        </div>
        <BottomNav />
      </div>
    );
  }

  // The code below will not be reached since we're always setting booking to null,
  // but I'm keeping it for reference in case real booking data is implemented later
  const getStatusColor = (status: string) => {
    return status === "confirmed" 
      ? "bg-green-100 text-green-800 border-green-200" 
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "accommodation": return "Accommodation";
      case "activity": return "Activity";
      case "transport": return "Transportation";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-white to-filipino-sand/10">
      <div className="relative">
        <div className="absolute left-4 top-4 z-20">
          <Link to="/bookings">
            <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="h-64 overflow-hidden">
          <img 
            src={booking.image} 
            alt={booking.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-bold text-filipino-darkGray">{booking.title}</h1>
          <Badge className={`${getStatusColor(booking.status)} ml-2 capitalize`}>
            {booking.status}
          </Badge>
        </div>
        
        <div className="flex items-center text-filipino-terracotta mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{booking.location}</span>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-filipino-darkGray">
                  <Calendar className="h-5 w-5 mr-2 text-filipino-terracotta" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{booking.dateRange}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-filipino-sand/20">
                  {getTypeLabel(booking.type)}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-filipino-darkGray">
                  <CheckCircle className="h-5 w-5 mr-2 text-filipino-terracotta" />
                  <div>
                    <p className="font-medium">Confirmation Code</p>
                    <p className="text-sm font-mono bg-filipino-sand/20 px-2 py-1 rounded">{booking.confirmationCode}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-filipino-darkGray">
                  <Clock className="h-5 w-5 mr-2 text-filipino-terracotta" />
                  <div>
                    <p className="font-medium">Booking Date</p>
                    <p className="text-sm text-muted-foreground">{booking.bookingDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-3">Payment Details</h3>
            <div className="flex justify-between items-center mb-2">
              <span>Total Price</span>
              <span className="font-bold">{booking.price}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Payment Status</span>
              <Badge className={booking.paymentStatus === "full" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                {booking.paymentStatus === "full" ? "Paid in Full" : "Partially Paid"}
              </Badge>
            </div>
            
            {booking.paymentStatus === "partial" && booking.paymentProgress && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span>Payment Progress</span>
                  <span>{booking.paymentProgress}%</span>
                </div>
                <Progress value={booking.paymentProgress} className="h-2" />
                <div className="mt-4">
                  <Button className="w-full bg-filipino-terracotta hover:bg-filipino-terracotta/90">
                    Complete Payment
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex gap-2 mb-6">
          <Button variant="outline" className="flex-1 gap-1 border-filipino-teal text-filipino-teal">
            <Download className="h-4 w-4" />
            Receipt
          </Button>
          <Button variant="outline" className="flex-1 gap-1 border-filipino-teal text-filipino-teal">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" className="flex-1 gap-1 border-filipino-teal text-filipino-teal">
            <MessageSquare className="h-4 w-4" />
            Support
          </Button>
        </div>
        
        {booking.status === "confirmed" ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <p className="font-medium">Your booking is confirmed!</p>
            </div>
            <p className="text-sm mt-1 pl-7">You're all set for your trip. Enjoy your experience!</p>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p className="font-medium">Waiting for confirmation</p>
            </div>
            <p className="text-sm mt-1 pl-7">We'll notify you once your booking is confirmed.</p>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}
