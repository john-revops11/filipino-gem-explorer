
import { MapPin, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface BookingCardProps {
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
  }
}

export function BookingCard({ booking }: BookingCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/3 h-32 sm:h-auto">
          <img 
            src={booking.image} 
            alt={booking.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="w-full sm:w-2/3 p-3">
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
          
          <h3 className="font-semibold mb-1 line-clamp-1 text-filipino-darkGray">{booking.title}</h3>
          
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <MapPin className="h-3 w-3 mr-1 text-filipino-deepTeal" />
            {booking.location}
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <Calendar className="h-3 w-3 mr-1 text-filipino-terracotta" />
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
              <p className="font-semibold text-filipino-darkGray">{booking.price}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 hover:bg-filipino-teal hover:text-white hover:border-filipino-teal transition-colors duration-300 group"
            >
              Details <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
