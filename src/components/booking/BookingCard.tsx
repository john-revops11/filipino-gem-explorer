
import { MapPin, Calendar, Clock, ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type BookingProps = {
  booking: {
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
};

export function BookingCard({ booking }: BookingProps) {
  const getStatusColor = (status: string) => {
    return status === "confirmed" 
      ? "bg-green-100 text-green-800 border-green-200" 
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 h-32 md:h-auto">
          <img 
            src={booking.image} 
            alt={booking.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold line-clamp-1">{booking.title}</h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <MapPin className="h-3 w-3 mr-1 text-filipino-terracotta" />
                <span className="line-clamp-1">{booking.location}</span>
              </div>
            </div>
            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
          </div>
          
          <div className="flex items-center mt-2 text-sm">
            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{booking.dateRange}</span>
          </div>
          
          {booking.paymentStatus === "partial" && booking.paymentProgress && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Payment Progress</span>
                <span>{booking.paymentProgress}%</span>
              </div>
              <Progress value={booking.paymentProgress} className="h-1.5" />
            </div>
          )}
          
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm font-medium">
              {booking.price}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
