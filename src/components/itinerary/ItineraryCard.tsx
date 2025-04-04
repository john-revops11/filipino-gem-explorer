
import { Calendar, MapPin, Clock, ChevronRight, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ItineraryCardProps {
  itinerary: {
    id: string;
    title: string;
    dateRange: string;
    days: number;
    locations: string[];
    activities: number;
    coverImage: string;
    status: string;
  }
}

export function ItineraryCard({ itinerary }: ItineraryCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="h-40 relative overflow-hidden">
        <img 
          src={itinerary.coverImage} 
          alt={itinerary.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge 
          className="absolute top-2 right-2 z-10" 
          style={{
            backgroundColor: itinerary.status === 'upcoming' 
              ? 'var(--filipino-teal)' 
              : 'var(--filipino-vibrantBlue)'
          }}
        >
          {itinerary.status === 'upcoming' ? 'Upcoming' : 'Planning'}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-filipino-darkGray">{itinerary.title}</h3>
        
        <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 text-filipino-terracotta" /> 
            {itinerary.dateRange}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 text-filipino-teal" /> 
            {itinerary.days} days
          </div>
          <div className="flex items-center text-muted-foreground col-span-2">
            <MapPin className="h-4 w-4 mr-2 text-filipino-deepTeal" /> 
            {itinerary.locations.join(', ')}
          </div>
          {itinerary.activities > 0 && (
            <div className="flex items-center text-muted-foreground col-span-2 mt-1">
              <Users className="h-4 w-4 mr-2 text-filipino-vibrantBlue" /> 
              {itinerary.activities} activities planned
            </div>
          )}
        </div>
        
        <Link to={`/itinerary/${itinerary.id}`}>
          <Button 
            className="w-full group relative overflow-hidden bg-white hover:bg-filipino-teal hover:text-white border border-filipino-teal/30 text-filipino-deepTeal transition-all duration-300"
            variant="outline"
          >
            <span className="relative z-10 flex items-center">
              View Details <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
