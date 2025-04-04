
import { useState } from "react";
import { 
  Calendar, 
  Sparkles, 
  Clock, 
  MapPin, 
  Star, 
  ArrowRight, 
  Coffee, 
  Utensils, 
  Car, 
  Sunrise, 
  Sunset, 
  Sun, 
  Moon, 
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

type ItineraryItem = {
  id: string;
  title: string;
  time: string;
  type: "activity" | "transport" | "food" | "accommodation" | "rest";
  location?: string;
  notes?: string;
  duration?: string;
};

type ItineraryDay = {
  date: string;
  description: string;
  items: ItineraryItem[];
};

// Sample itinerary data
const sampleItinerary: ItineraryDay[] = [
  {
    date: "Day 1 - April 5, 2025",
    description: "Arrival & Manila Exploration",
    items: [
      {
        id: "d1-1",
        title: "Arrival at Ninoy Aquino International Airport",
        time: "08:00 AM",
        type: "transport",
        location: "Manila",
        duration: "1-2 hours",
        notes: "Clear immigration, collect baggage, exchange currency"
      },
      {
        id: "d1-2",
        title: "Check-in at Hotel",
        time: "10:30 AM",
        type: "accommodation",
        location: "Makati, Manila",
        notes: "Early check-in requested"
      },
      {
        id: "d1-3",
        title: "Lunch at Greenbelt",
        time: "12:00 PM",
        type: "food",
        location: "Makati, Manila",
        duration: "1.5 hours"
      },
      {
        id: "d1-4",
        title: "Intramuros Tour",
        time: "02:00 PM",
        type: "activity",
        location: "Intramuros, Manila",
        duration: "3 hours",
        notes: "Visit San Agustin Church, Fort Santiago, Casa Manila"
      },
      {
        id: "d1-5",
        title: "Dinner at Ilustrado Restaurant",
        time: "06:00 PM",
        type: "food",
        location: "Intramuros, Manila",
        duration: "1.5 hours"
      },
      {
        id: "d1-6",
        title: "Rest at Hotel",
        time: "08:00 PM",
        type: "rest"
      }
    ]
  },
  {
    date: "Day 2 - April 6, 2025",
    description: "Day Trip to Tagaytay",
    items: [
      {
        id: "d2-1",
        title: "Breakfast at Hotel",
        time: "07:00 AM",
        type: "food",
        duration: "1 hour"
      },
      {
        id: "d2-2",
        title: "Drive to Tagaytay",
        time: "08:30 AM",
        type: "transport",
        location: "Manila to Tagaytay",
        duration: "2 hours",
        notes: "Private car arrangement"
      },
      {
        id: "d2-3",
        title: "Taal Volcano Viewing",
        time: "10:30 AM",
        type: "activity",
        location: "Tagaytay",
        duration: "1 hour"
      },
      {
        id: "d2-4",
        title: "Lunch at Sonya's Garden",
        time: "12:00 PM",
        type: "food",
        location: "Tagaytay",
        duration: "1.5 hours"
      },
      {
        id: "d2-5",
        title: "Sky Ranch Amusement Park",
        time: "02:00 PM",
        type: "activity",
        location: "Tagaytay",
        duration: "2 hours"
      },
      {
        id: "d2-6",
        title: "Drive back to Manila",
        time: "05:00 PM",
        type: "transport",
        location: "Tagaytay to Manila",
        duration: "2 hours"
      },
      {
        id: "d2-7",
        title: "Dinner at SM Mall of Asia",
        time: "07:30 PM",
        type: "food",
        location: "Pasay, Manila",
        duration: "1.5 hours"
      }
    ]
  },
  {
    date: "Day 3 - April 7, 2025",
    description: "Flight to Palawan & El Nido Arrival",
    items: [
      {
        id: "d3-1",
        title: "Breakfast at Hotel",
        time: "06:00 AM",
        type: "food",
        duration: "45 minutes"
      },
      {
        id: "d3-2",
        title: "Transfer to Airport",
        time: "07:00 AM",
        type: "transport",
        location: "Manila",
        duration: "1 hour"
      },
      {
        id: "d3-3",
        title: "Flight to Puerto Princesa",
        time: "09:15 AM",
        type: "transport",
        location: "Manila to Puerto Princesa",
        duration: "1.5 hours"
      },
      {
        id: "d3-4",
        title: "Van Transfer to El Nido",
        time: "11:30 AM",
        type: "transport",
        location: "Puerto Princesa to El Nido",
        duration: "5-6 hours",
        notes: "Shared van, lunch stop included"
      },
      {
        id: "d3-5",
        title: "Check-in at El Nido Resort",
        time: "06:00 PM",
        type: "accommodation",
        location: "El Nido, Palawan"
      },
      {
        id: "d3-6",
        title: "Dinner at Resort Restaurant",
        time: "07:30 PM",
        type: "food",
        location: "El Nido, Palawan",
        duration: "1.5 hours"
      }
    ]
  }
];

// Define the icons for each activity type
const getActivityIcon = (type: ItineraryItem["type"]) => {
  switch (type) {
    case "activity":
      return <Star className="h-4 w-4 text-filipino-vibrantGreen" />;
    case "transport":
      return <Car className="h-4 w-4 text-filipino-teal" />;
    case "food":
      return <Utensils className="h-4 w-4 text-filipino-terracotta" />;
    case "accommodation":
      return <Sunset className="h-4 w-4 text-filipino-warmOchre" />;
    case "rest":
      return <Coffee className="h-4 w-4 text-filipino-vibrantRed" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export default function ItineraryOptimizer() {
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(sampleItinerary);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showOptimizedDialog, setShowOptimizedDialog] = useState(false);
  const [optimization, setOptimization] = useState<{
    changes: string[];
    reasons: string[];
  }>({
    changes: [],
    reasons: []
  });

  const optimizeItinerary = () => {
    setIsOptimizing(true);
    
    // Simulate AI optimization process
    setTimeout(() => {
      // This would be replaced with actual AI optimization logic in a real app
      const optimized = [...itinerary];
      
      // Simulate some optimizations
      // Day 1: Move Intramuros tour earlier
      optimized[0].items[3].time = "01:30 PM";
      optimized[0].items[2].time = "11:30 AM";
      optimized[0].items[2].duration = "1 hour";
      
      // Day 2: Add a new activity
      optimized[1].items.splice(5, 0, {
        id: "d2-5b",
        title: "Picnic Coffee Break with Lake View",
        time: "04:00 PM",
        type: "food",
        location: "Tagaytay",
        duration: "30 minutes",
        notes: "Local coffee shop recommendation"
      });
      
      // Day 3: Adjust transfer time
      optimized[2].items[3].time = "12:00 PM";
      optimized[2].items[3].notes = "Private van transfer for comfort after flight";
      
      setItinerary(optimized);
      
      // Record what changes were made for the summary
      setOptimization({
        changes: [
          "Adjusted Day 1 schedule to reduce midday heat exposure at Intramuros",
          "Added a relaxing coffee break with lake view on Day 2",
          "Optimized transfer time on Day 3 for better comfort"
        ],
        reasons: [
          "Weather data shows higher temperatures between 2-4 PM in Manila",
          "Added short rest periods to prevent fatigue during full-day tours",
          "Recommended local experiences based on traveler preferences"
        ]
      });
      
      setIsOptimizing(false);
      setShowOptimizedDialog(true);
      
      toast({
        title: "Itinerary Optimized",
        description: "Your itinerary has been optimized for better experience",
      });
    }, 2000);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-filipino-terracotta" />
          Your Itinerary
        </h2>
        
        <Button
          onClick={optimizeItinerary}
          disabled={isOptimizing}
          className="bg-filipino-teal hover:bg-filipino-teal/90 text-white"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isOptimizing ? "Optimizing..." : "AI Optimize"}
        </Button>
      </div>
      
      {/* Days navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {itinerary.map((day, index) => (
          <button
            key={index}
            className="min-w-32 px-3 py-2 border rounded-md hover:bg-filipino-teal/10 text-left"
          >
            <p className="font-medium text-sm">{day.date.split(' - ')[0]}</p>
            <p className="text-xs text-muted-foreground truncate">{day.description}</p>
          </button>
        ))}
      </div>
      
      {/* Display current itinerary */}
      <div className="space-y-6">
        {itinerary.map((day, dayIndex) => (
          <div key={dayIndex} className="border rounded-lg overflow-hidden">
            <div className="bg-filipino-teal/10 p-3 border-b">
              <h3 className="font-bold">{day.date}</h3>
              <p className="text-sm text-muted-foreground">{day.description}</p>
            </div>
            
            <div className="relative">
              {/* Time guide line */}
              <div className="absolute left-[4.5rem] top-0 bottom-0 w-[1px] bg-muted" />
              
              {day.items.map((item, itemIndex) => (
                <div key={item.id} className="flex relative">
                  {/* Time column */}
                  <div className="w-20 py-4 px-3 flex justify-end flex-shrink-0">
                    <span className="text-sm font-medium">
                      {item.time.split(' ')[0]}
                    </span>
                  </div>
                  
                  {/* AM/PM indicator */}
                  <div className="w-6 py-4 text-xs text-muted-foreground flex-shrink-0">
                    {item.time.includes('AM') ? 'AM' : 'PM'}
                  </div>
                  
                  {/* Activity dot */}
                  <div className="absolute left-[4.5rem] top-[1.25rem] -ml-[0.3rem] z-10">
                    <div className="h-[1.25rem] w-[1.25rem] rounded-full bg-background border-2 border-muted flex items-center justify-center">
                      {getActivityIcon(item.type)}
                    </div>
                  </div>
                  
                  {/* Activity content */}
                  <div className={`flex-1 py-3 px-5 ml-3 border-b ${itemIndex === day.items.length - 1 ? 'border-b-0' : ''}`}>
                    <div className="flex justify-between">
                      <h4 className="font-medium">{item.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                    </div>
                    
                    {item.location && (
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {item.location}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 mt-1">
                      {item.duration && (
                        <span className="text-xs flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          {item.duration}
                        </span>
                      )}
                    </div>
                    
                    {item.notes && (
                      <p className="text-xs italic mt-1 text-muted-foreground">
                        Note: {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Optimization Dialog */}
      <Dialog open={showOptimizedDialog} onOpenChange={setShowOptimizedDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-filipino-teal" />
              AI Optimization Complete
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <p className="text-sm">
              Your itinerary has been optimized for better experience and efficiency.
              Here's what our AI assistant improved:
            </p>
            
            <div className="space-y-3">
              <h4 className="font-medium">Changes Made:</h4>
              <ul className="space-y-2">
                {optimization.changes.map((change, index) => (
                  <li key={index} className="flex text-sm">
                    <Check className="h-4 w-4 mr-2 text-filipino-vibrantGreen flex-shrink-0" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Optimization Reasons:</h4>
              <ul className="space-y-2">
                {optimization.reasons.map((reason, index) => (
                  <li key={index} className="flex text-sm">
                    <ArrowRight className="h-4 w-4 mr-2 text-filipino-teal flex-shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setShowOptimizedDialog(false)}
              className="w-full bg-filipino-teal hover:bg-filipino-teal/90"
            >
              Continue with Optimized Itinerary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
