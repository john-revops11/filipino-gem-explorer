
import { DestinationCard } from "./DestinationCard";
import { Calendar } from "lucide-react";

// Mock data for cultural events
const culturalEvents = [
  {
    id: "event1",
    name: "Sinulog Festival",
    location: "Cebu City",
    image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=800&q=80",
    date: "January 15, 2025",
  },
  {
    id: "event2",
    name: "Kadayawan Festival",
    location: "Davao City",
    image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&q=80",
    date: "August 17-23, 2024",
  },
  {
    id: "event3",
    name: "Pahiyas Festival",
    location: "Lucban, Quezon",
    image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?auto=format&fit=crop&w=800&q=80",
    date: "May 15, 2025",
  },
];

export function UpcomingEvents() {
  return (
    <section className="py-6">
      <h2 className="section-title mb-4">Upcoming Cultural Events</h2>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {culturalEvents.map((event) => (
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
