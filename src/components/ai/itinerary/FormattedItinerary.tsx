
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Calendar, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { parseItineraryContent } from "@/utils/content-parser";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({0: true});
  const isMobile = useIsMobile();

  const handleVisitPlace = (place: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(place + " " + destination)}`, "_blank");
  };

  const toggleSection = (index: number) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
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
      <div className="bg-filipino-teal text-white p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold">{finalTitle}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 mt-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm sm:text-base">{finalDate}</span>
          </div>
          {subtitle && (
            <div className="flex items-center">
              <span className="hidden sm:inline mx-2">•</span>
              <span className="text-sm sm:text-base">{finalSubtitle}</span>
            </div>
          )}
        </div>
        {description && <p className="mt-3 text-white/90 text-xs sm:text-sm">{description}</p>}
      </div>

      {/* Itinerary Content */}
      <div className="p-3 sm:p-6">
        {finalSections.map((section, sectionIndex) => (
          <Collapsible 
            key={sectionIndex} 
            open={openSections[sectionIndex]} 
            onOpenChange={() => toggleSection(sectionIndex)}
            className="mb-4 border rounded-lg overflow-hidden"
          >
            <div className="bg-filipino-teal/10 p-3 border-b">
              <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-filipino-deepTeal">{section.title}</h2>
                  {section.date && (
                    <span className="text-xs sm:text-sm text-muted-foreground">{section.date}</span>
                  )}
                </div>
                {openSections[sectionIndex] ? (
                  <ChevronUp className="h-5 w-5 text-filipino-teal" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-filipino-teal" />
                )}
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent>
              <div className="p-3 sm:p-4">
                <p className="text-sm text-muted-foreground mb-4 sm:mb-6">{section.description}</p>
                
                <div className="space-y-4 sm:space-y-6">
                  {section.places.map((place, placeIndex) => (
                    <Card key={placeIndex} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:grid md:grid-cols-3 gap-3 sm:gap-4">
                        <div className="relative h-48 sm:h-60 md:h-full">
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
                        <div className="p-3 sm:p-4 md:col-span-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="font-bold text-base sm:text-lg line-clamp-2">{place.name}</h3>
                            <div className="flex items-center text-muted-foreground text-xs sm:text-sm">
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                              {place.duration ? (
                                <span>Duration: {place.duration}</span>
                              ) : (
                                <span>Flexible time</span>
                              )}
                            </div>
                          </div>
                          
                          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 line-clamp-3 sm:line-clamp-none">
                            {place.description}
                          </p>
                          
                          {place.entranceFee && (
                            <div className="mt-2 sm:mt-3">
                              <span className="inline-block text-xs sm:text-sm bg-filipino-warmOchre/10 text-filipino-warmOchre px-2 py-1 rounded">
                                <strong>Entrance:</strong> {place.entranceFee}
                              </span>
                            </div>
                          )}
                          
                          <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                            <Button 
                              size={isMobile ? "sm" : "default"} 
                              onClick={() => handleVisitPlace(place.name)}
                              className="bg-filipino-terracotta hover:bg-filipino-terracotta/90"
                            >
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              <span className="text-xs sm:text-sm">Visit</span>
                            </Button>
                            <Button 
                              size={isMobile ? "sm" : "default"}
                              variant="outline"
                              onClick={() => {
                                setSelectedPlace(place);
                                setShowMap(true);
                              }}
                            >
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              <span className="text-xs sm:text-sm">Map</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        {/* Additional Information */}
        <div className="mt-6 sm:mt-8 border-t pt-4 sm:pt-6">
          <h2 className="text-lg sm:text-xl font-semibold text-filipino-deepTeal mb-3 sm:mb-4">Additional Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="p-3 sm:p-4">
              <h3 className="font-bold text-sm sm:text-base mb-2">Transportation</h3>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Local transportation options vary by destination.</li>
                <li>Consider ride-sharing apps or taxis for convenience.</li>
                <li>Public transportation may offer a more authentic experience.</li>
              </ul>
            </Card>
            
            <Card className="p-3 sm:p-4">
              <h3 className="font-bold text-sm sm:text-base mb-2">Practical Tips</h3>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
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
        <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] p-0 overflow-hidden">
          <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <DialogTitle className="text-base sm:text-lg">
              {selectedPlace?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video relative bg-muted overflow-hidden">
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
