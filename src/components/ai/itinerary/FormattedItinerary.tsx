
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

  // Improved section extraction from raw content
  const generateSectionsFromRawContent = () => {
    if (sections.length > 0 || !rawContent) return sections;
    
    try {
      const lines = rawContent.split('\n');
      const extractedSections: ItinerarySection[] = [];
      let currentSection: ItinerarySection | null = null;
      let currentPlace: Place | null = null;
      
      // Common patterns in itinerary content
      const sectionPatterns = [
        /^## (.+)/,                    // ## Day 1
        /\*\*Day \d+[:\-–]?\s*(.+?)\*\*/i,  // **Day 1: Arrival...**
        /^Day \d+[:\-–]?\s*(.+)/i,     // Day 1: Exploring
        /^Morning|^Afternoon|^Evening|^Night/i,  // Morning section
        /^\*\*(.+?)\*\*/,               // **Section Title**
        /^\d+[:.]\s+Day \d+/            // 1. Day 1
      ];
      
      const timePatterns = [
        /(\d{1,2}:\d{2}\s*(AM|PM))/i,   // 8:00 AM
        /(\d{1,2}\s*(AM|PM))/i,         // 8 AM
        /\*\*(Morning|Afternoon|Evening):\*\*/i  // **Morning:**
      ];
      
      lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        // Try to identify section headers
        const isSectionHeader = sectionPatterns.some(pattern => pattern.test(line));
        
        if (isSectionHeader) {
          if (currentSection && currentSection.places.length > 0) {
            extractedSections.push(currentSection);
          }
          
          let sectionTitle = line
            .replace(/^##\s+/, '')
            .replace(/^\*\*|\*\*$/g, '')
            .replace(/^\d+[:.]\s+/, '')
            .trim();
          
          currentSection = {
            title: sectionTitle,
            description: "Explore and enjoy the local attractions",
            places: []
          };
        
        // Try to identify places with times
        } else if (line.startsWith('*')) {
          let timeMatch = null;
          for (const pattern of timePatterns) {
            timeMatch = line.match(pattern);
            if (timeMatch) break;
          }
          
          const bulletMatch = line.match(/\*\s+(.*)/); // Match the bullet point content
          
          if (bulletMatch && currentSection) {
            let placeLine = bulletMatch[1];
            let time = "Flexible";
            let placeName = placeLine;
            
            // Try to extract time
            if (timeMatch) {
              time = timeMatch[1];
              // Remove the time from the place name
              placeName = placeLine.replace(timeMatch[0], '').trim();
            } else {
              // Check if there's a time with a colon
              const colonTimeMatch = placeLine.match(/(\d{1,2}:\d{2})/);
              if (colonTimeMatch) {
                time = colonTimeMatch[1];
                placeName = placeLine.replace(colonTimeMatch[0], '').trim();
              }
            }
            
            // Extract place name - usually follows the time or bullets
            placeName = placeName
              .replace(/^\*\s+|\*\s+|\*\*|\*\*$|^-\s+/g, '')  // Remove bullets and stars
              .replace(/:/g, '')                              // Remove colons
              .trim();
              
            // If the place name starts with a verb like "Visit", take the next part
            const visitMatch = placeName.match(/^(Visit|Explore|Go to|Check out|Head to|Stop by|Arrive at)\s+(.+?)[\.,]/i);
            if (visitMatch) {
              placeName = visitMatch[2].trim();
            }
            
            // Extract the first sentence if the place name is too long
            if (placeName.length > 60) {
              const parts = placeName.split('.');
              if (parts.length > 1) {
                placeName = parts[0].trim();
              } else {
                placeName = placeName.substring(0, 60) + '...';
              }
            }
            
            if (placeName && placeName.length > 1) {
              // Extract entrance fee if mentioned
              let entranceFee = "";
              if (placeLine.match(/(Entrance Fee|Cost|Price|Fee)[:\s]+([\₱\$\€]?\s*\d+[\-\–]?\d*)/i)) {
                const feeMatch = placeLine.match(/([\₱\$\€]?\s*\d+[\-\–]?\d*)/i);
                if (feeMatch) {
                  entranceFee = feeMatch[0];
                }
              }
              
              currentPlace = {
                name: placeName,
                time: time,
                description: placeLine.replace(placeName, '').trim(),
                entranceFee: entranceFee,
                imageUrl: getDefaultImage(placeName, destination)
              };
              currentSection.places.push(currentPlace);
            }
          }
        
        // Add description to the current place
        } else if (currentPlace && line && !line.startsWith('#') && !line.startsWith('*')) {
          currentPlace.description += (currentPlace.description ? " " : "") + line;
          
          // Try to extract entrance fee if mentioned
          if (line.match(/entrance fee|cost|price|fee/i)) {
            const feeMatch = line.match(/[\₱\$\€]?\s*\d+[\-\–]?\d*/i);
            if (feeMatch) {
              currentPlace.entranceFee = feeMatch[0];
            }
          }
        }
      });
      
      // Add the last section if it exists
      if (currentSection && currentSection.places.length > 0) {
        extractedSections.push(currentSection);
      }
      
      // If no sections were created but we have content, create a default section
      if (extractedSections.length === 0 && rawContent.length > 0) {
        return [{
          title: `${destination} Highlights`,
          description: "Key attractions and experiences",
          places: [{
            name: destination,
            time: "Flexible",
            description: rawContent.substring(0, 200) + "...",
            imageUrl: getDefaultImage(destination, "travel")
          }]
        }];
      }
      
      return extractedSections;
    } catch (error) {
      console.error("Error parsing raw content:", error);
      return [];
    }
  };

  const finalSections = generateSectionsFromRawContent();
  const finalTitle = title || `${destination} Itinerary`;
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
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).src = getDefaultImage(place.name, destination);
                        }}
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
