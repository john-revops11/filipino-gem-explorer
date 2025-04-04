
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Star, User } from "lucide-react";
import { Link } from "react-router-dom";

type ActivityItem = {
  id: string;
  type: 'visit' | 'review' | 'booking';
  title: string;
  location: string;
  date: string;
  image?: string;
  rating?: number;
};

type UserActivityProps = {
  activities: ActivityItem[];
};

export const UserActivity = ({ activities }: UserActivityProps) => {
  if (activities.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-center">
        <div>
          <User className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">You don't have any recent activity.</p>
          <Link to="/explore">
            <Button className="mt-4 bg-filipino-terracotta">Explore Destinations</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex p-3 rounded-lg border border-border">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <Badge 
                className="mr-2" 
                style={{ 
                  backgroundColor: 
                    activity.type === 'visit' ? 'var(--filipino-teal)' : 
                    activity.type === 'review' ? 'var(--filipino-yellow)' : 
                    'var(--filipino-terracotta)'
                }}
              >
                {activity.type === 'visit' ? 'Visited' : 
                 activity.type === 'review' ? 'Reviewed' : 'Booked'}
              </Badge>
              <span className="text-xs text-muted-foreground">{activity.date}</span>
            </div>
            
            <h4 className="font-medium">{activity.title}</h4>
            
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {activity.location}
            </div>
            
            {activity.type === 'review' && activity.rating && (
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < activity.rating! ? 'fill-filipino-yellow text-filipino-yellow' : 'text-muted'}`} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
