
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Calendar, ExternalLink, Map } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Place {
  name: string;
  time: string;
  description: string;
  entranceFee?: string;
  imageUrl: string;
}

interface ItinerarySection {
  title: string;
  description: string;
  places: Place[];
}

interface FormattedItineraryProps {
  title: string;
  date: string;
  subtitle: string;
  description: string;
  sections: ItinerarySection[];
}

const cebuPlaces = {
  "Fort San Pedro": "/lovable-uploads/0cc96d38-423d-462c-a3e7-8f0e3d4de6f3.png",
  "Magellan's Cross": "/lovable-uploads/18ecf041-866a-43f4-82c2-848f3bd674f5.png",
  "Basilica del Santo Niño": "/lovable-uploads/4c2638cd-0e7f-4814-adf8-5f0215c6afbd.png",
  "Yap-Sandiego Ancestral House": "/lovable-uploads/5c1116fa-cd0c-456a-a53f-8ec1c8b2420f.png",
  "Carbon Market": "https://images.unsplash.com/photo-1473177104440-ffee2f376098",
  "Cebu Heritage Monument": "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
  "Tops Lookout": "https://images.unsplash.com/photo-1501854140801-50d01698950b",
  "Temple of Leah": "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
  "Larsian Barbecue": "https://images.unsplash.com/photo-1426604966848-d7adac402bff"
};

export default function FormattedItinerary() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showMap, setShowMap] = useState(false);

  const handleVisitPlace = (place: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(place + " cebu philippines")}`, "_blank");
  };

  const cebuItinerary: FormattedItineraryProps = {
    title: "Cebu City 1-Day Itinerary",
    date: "April 14, 2025",
    subtitle: "Cultural, Adventure, Budget-Friendly",
    description: "April falls within Cebu's dry season, expect hot and sunny weather. It's the tail end of the summer season, so fewer crowds than peak months. Check for any specific local festivals or events happening around April 14th, 2025, closer to the date, as schedules may change.",
    sections: [
      {
        title: "Morning (Cultural & Historical)",
        description: "Explore Cebu's rich history and cultural heritage",
        places: [
          {
            name: "Local Carinderia",
            time: "7:00 AM",
            description: "Start your day with a hearty and cheap Cebuano breakfast at a local 'carinderia' (small eatery). Try 'Puso' (hanging rice) with 'Siomai' (steamed dumplings) or 'Danggit' (dried fish). (Cost: ~₱50-100)",
            imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e"
          },
          {
            name: "Fort San Pedro",
            time: "8:00 AM",
            description: "The oldest Spanish fort in the Philippines. Explore the historical grounds and museum.",
            entranceFee: "~₱30",
            imageUrl: cebuPlaces["Fort San Pedro"]
          },
          {
            name: "Magellan's Cross",
            time: "9:00 AM",
            description: "Housed in a small chapel next to the Basilica del Santo Niño. Witness this important historical landmark.",
            entranceFee: "Donation based",
            imageUrl: cebuPlaces["Magellan's Cross"]
          },
          {
            name: "Basilica del Santo Niño",
            time: "9:30 AM",
            description: "A significant historical and religious site. Observe the religious practices and admire the architecture.",
            entranceFee: "Free",
            imageUrl: cebuPlaces["Basilica del Santo Niño"]
          },
          {
            name: "Yap-Sandiego Ancestral House",
            time: "10:30 AM",
            description: "The oldest Chinese house outside of China. Get a glimpse into Cebu's rich cultural heritage.",
            entranceFee: "~₱50",
            imageUrl: cebuPlaces["Yap-Sandiego Ancestral House"]
          }
        ]
      },
      {
        title: "Midday (Local Flavors & Hidden Gem)",
        description: "Immerse yourself in local life and flavors",
        places: [
          {
            name: "Carbon Market",
            time: "11:30 AM",
            description: "Take a jeepney (₱10-15) to Carbon Market. Immerse yourself in the local life and sample fresh fruits.",
            imageUrl: cebuPlaces["Carbon Market"]
          },
          {
            name: "Sutukil Seafood",
            time: "12:30 PM",
            description: "Lunch at Sutukil (Sugba, Tuwa, Kilaw) at Carbon Market or a nearby restaurant. Choose fresh seafood and have it cooked to your liking (grilled, soup, raw). A budget-friendly and authentic Cebu experience. (Cost: ~₱200-300 per person)",
            imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098"
          },
          {
            name: "Cebu Heritage Monument",
            time: "1:30 PM",
            description: "Hidden Gem: A tableau depicting important scenes from Cebu's history. It's a lesser-known attraction but provides a fantastic overview of the island's past.",
            entranceFee: "Free, donations welcome",
            imageUrl: cebuPlaces["Cebu Heritage Monument"]
          }
        ]
      },
      {
        title: "Afternoon (Adventure & Nature)",
        description: "Enjoy panoramic views and natural beauty",
        places: [
          {
            name: "Tops Lookout",
            time: "2:30 PM",
            description: "Take a taxi or Grab car (~₱200-300) to the Tops Lookout. Enjoy panoramic views of Cebu City and the surrounding islands. Ideal for photo opportunities, especially during sunset.",
            entranceFee: "~₱100",
            imageUrl: cebuPlaces["Tops Lookout"]
          },
          {
            name: "Temple of Leah",
            time: "4:00 PM",
            description: "Head back towards the city. Consider stopping by the Temple of Leah, a Roman-inspired architectural marvel, if time permits.",
            entranceFee: "~₱50",
            imageUrl: cebuPlaces["Temple of Leah"]
          }
        ]
      },
      {
        title: "Evening (Relaxation & Dinner)",
        description: "Unwind and enjoy local cuisine",
        places: [
          {
            name: "City Center",
            time: "6:00 PM",
            description: "Return to the city center.",
            imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b"
          },
          {
            name: "Larsian Barbecue",
            time: "7:00 PM",
            description: "Enjoy dinner at a local restaurant. Try Larsian Barbecue for a budget-friendly and delicious BBQ experience. (Cost: ~₱150-250)",
            imageUrl: cebuPlaces["Larsian Barbecue"]
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-filipino-teal text-white p-6">
        <h1 className="text-2xl font-bold">{cebuItinerary.title}</h1>
        <div className="flex items-center mt-2">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{cebuItinerary.date}</span>
          <span className="mx-2">•</span>
          <span>{cebuItinerary.subtitle}</span>
        </div>
        <p className="mt-4 text-white/90 text-sm">{cebuItinerary.description}</p>
      </div>

      {/* Itinerary Content */}
      <div className="p-6">
        {cebuItinerary.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <h2 className="text-xl font-semibold text-filipino-deepTeal mb-2">{section.title}</h2>
            <p className="text-muted-foreground mb-4">{section.description}</p>
            
            <div className="space-y-6">
              {section.places.map((place, placeIndex) => (
                <Card key={placeIndex} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative h-48 md:h-full">
                      <img 
                        src={place.imageUrl} 
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">{place.name}</h3>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{place.time}</span>
                        </div>
                      </div>
                      
                      <p className="mt-2 text-sm">{place.description}</p>
                      
                      {place.entranceFee && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <strong>Entrance Fee:</strong> {place.entranceFee}
                        </div>
                      )}
                      
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleVisitPlace(place.name)}
                          className="bg-filipino-terracotta hover:bg-filipino-terracotta/90"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedPlace(place);
                            setShowMap(true);
                          }}
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          Map
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Additional Information */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold text-filipino-deepTeal mb-4">Additional Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="font-bold mb-2">Transportation</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Jeepneys are the cheapest option for short distances within the city (₱10-15).</li>
                <li>Taxis and Grab cars are convenient for longer distances or when time is a constraint (~₱100-300 depending on the distance).</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-bold mb-2">Budget</h3>
              <p className="text-sm">Total estimated cost for the day: ₱700-1200 (excluding accommodation and souvenirs).</p>
              <p className="text-sm text-muted-foreground mt-1">This is a rough estimate and can vary based on your choices.</p>
            </Card>
            
            <Card className="p-4 md:col-span-2">
              <h3 className="font-bold mb-2">Tips & Notes</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
                <li>Adjust the itinerary based on your interests and pace.</li>
                <li>Be mindful of your belongings, especially in crowded areas.</li>
                <li>Stay hydrated, especially during the hot daytime hours.</li>
                <li>Learn a few basic Cebuano phrases - locals appreciate the effort.</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Map Dialog */}
      <Dialog open={showMap} onOpenChange={setShowMap}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedPlace?.name}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video relative bg-muted overflow-hidden rounded-md">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBaAZ_LmSOcA6egQ8WyFnFOed0D3GciOvo&q=${encodeURIComponent(
                (selectedPlace?.name || "") + " cebu philippines"
              )}`}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
