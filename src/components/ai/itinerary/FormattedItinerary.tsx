
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Calendar, ExternalLink, Map } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { parseItineraryContent } from "@/utils/content-parser";

interface Place {
  name: string;
  time: string;
  description: string;
  entranceFee?: string;
  imageUrl: string;
  duration?: string;
}

interface ItinerarySection {
  title: string;
  description: string;
  places: Place[];
  date?: string;
}

export interface FormattedItineraryProps {
  title?: string;
  date?: string;
  subtitle?: string;
  description?: string;
  sections?: ItinerarySection[];
  destination?: string;
  rawContent?: string;
}

const getDefaultImage = (placeName: string, destination: string) => {
  // Try to get a relevant image or use a default
  return `https://source.unsplash.com/featured/?${encodeURIComponent(placeName + "," + destination)}`;
};

export default function FormattedItinerary({ 
  title, 
  date, 
  subtitle, 
  description,
  sections = [],
  destination = "Philippines",
  rawContent = ""
}: FormattedItineraryProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showMap, setShowMap] = useState(false);

  const handleVisitPlace = (place: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(place + " " + destination)}`, "_blank");
  };

  // Process the content if we don't have sections already
  const processedContent = rawContent && !sections.length 
    ? parseItineraryContent(rawContent, destination)
    : { title: title || `${destination} Itinerary`, sections };

  const finalSections = processedContent.sections;
  const finalTitle = title || processedContent.title || `${destination} Itinerary`;
  const finalDate = date || "Your travel dates";
  const finalSubtitle = subtitle || "Explore and experience the local culture";

  if (finalSections.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">
          This itinerary is in plain text format. Switch to Standard View to see the content.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-filipino-teal text-white p-6">
        <h1 className="text-2xl font-bold">{finalTitle}</h1>
        <div className="flex items-center mt-2">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{finalDate}</span>
          {subtitle && (
            <>
              <span className="mx-2">•</span>
              <span>{finalSubtitle}</span>
            </>
          )}
        </div>
        {description && <p className="mt-4 text-white/90 text-sm">{description}</p>}
      </div>

      {/* Itinerary Content */}
      <div className="p-6">
        {finalSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-10 pb-6 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center mb-3">
              <h2 className="text-xl font-semibold text-filipino-deepTeal">{section.title}</h2>
              {section.date && (
                <span className="ml-3 text-sm bg-filipino-teal/10 text-filipino-teal px-2 py-1 rounded-full">
                  {section.date}
                </span>
              )}
            </div>
            <p className="text-muted-foreground mb-6">{section.description}</p>
            
            <div className="space-y-6">
              {section.places.map((place, placeIndex) => (
                <Card key={placeIndex} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative h-60 md:h-full">
                      <img 
                        src={place.imageUrl} 
                        alt={place.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).src = getDefaultImage(place.name, destination);
                        }}
                      />
                      <div className="absolute top-0 right-0 m-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {place.time}
                      </div>
                    </div>
                    <div className="p-4 md:col-span-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-bold text-lg">{place.name}</h3>
                        <div className="flex items-center mt-1 sm:mt-0 text-muted-foreground text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {place.duration ? (
                            <span>Duration: {place.duration}</span>
                          ) : (
                            <span>Flexible time</span>
                          )}
                        </div>
                      </div>
                      
                      <p className="mt-3 text-sm text-gray-600">{place.description}</p>
                      
                      <div className="mt-3 space-y-2">
                        {place.entranceFee && (
                          <div className="inline-block mr-4 text-sm bg-filipino-warmOchre/10 text-filipino-warmOchre px-2 py-1 rounded">
                            <strong>Entrance:</strong> {place.entranceFee}
                          </div>
                        )}
                      </div>
                      
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
                <li>Local transportation options vary by destination.</li>
                <li>Consider ride-sharing apps or taxis for convenience.</li>
                <li>Public transportation may offer a more authentic experience.</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-bold mb-2">Practical Tips</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Research local customs and etiquette before your trip.</li>
                <li>Check weather conditions and pack accordingly.</li>
                <li>Keep emergency contact information handy.</li>
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
                (selectedPlace?.name || "") + " " + destination
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
