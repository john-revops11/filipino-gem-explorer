
import { useState, useEffect } from "react";
import { DestinationCard } from "./DestinationCard";
import { Calendar } from "lucide-react";
import { generateToursAndEvents } from "@/services/gemini-api";
import { Skeleton } from "@/components/ui/skeleton";

type Event = {
  id: string;
  name: string;
  location: string;
  image: string;
  date: string;
};

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchEvents() {
      try {
        // Generate cultural events for Philippines using AI
        const eventsData = await generateToursAndEvents({
          location: "Philippines",
          eventType: "Cultural Festival",
          date: "Upcoming months",
          description: "Traditional celebrations and festivals"
        });
        
        // Parse the response
        let parsedEvents;
        try {
          parsedEvents = JSON.parse(eventsData);
        } catch (e) {
          console.error("Error parsing events data:", e);
          // If parsing fails, create a basic event
          parsedEvents = [{
            name: "Filipino Cultural Festival",
            location: "Manila",
            date: "Coming soon"
          }];
        }
        
        // Transform data into events format
        let transformedEvents: Event[] = [];
        
        if (Array.isArray(parsedEvents)) {
          transformedEvents = parsedEvents.map((event, index) => ({
            id: `event${index + 1}`,
            name: event.name,
            location: event.location || "Philippines",
            image: event.image || `https://images.unsplash.com/photo-${1450000000000 + index * 1000}-${100000000 + index}?auto=format&fit=crop&w=800&q=80`,
            date: event.date || "Coming soon"
          }));
        } else {
          transformedEvents = [{
            id: "event1",
            name: parsedEvents.name || "Filipino Cultural Festival",
            location: parsedEvents.location || "Philippines",
            image: parsedEvents.image || "https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=800&q=80",
            date: parsedEvents.date || "Coming soon"
          }];
        }
        
        setEvents(transformedEvents.slice(0, 3)); // Limit to 3 events
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <section className="py-6">
        <h2 className="section-title mb-4">Upcoming Cultural Events</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <h2 className="section-title mb-4">Upcoming Cultural Events</h2>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {events.map((event) => (
          <div key={event.id} className="relative">
            <DestinationCard
              id={event.id}
              name={event.name}
              location={event.location}
              image={event.image}
              size="sm"
            />
            <div className="flex items-center mt-2">
              <Calendar className="h-4 w-4 mr-2 text-filipino-terracotta" />
              <span className="text-sm">{event.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
