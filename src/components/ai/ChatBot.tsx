
import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

const DEFAULT_GREETING = "Hi there! I'm your AI travel assistant for the Philippines. How can I help with your trip planning today?";

const COMMON_RESPONSES: Record<string, string> = {
  "hello": "Hello! How can I help with your Philippine adventure today?",
  "hi": "Hi there! Looking to explore the Philippines? I'm here to help!",
  "help": "I can help with itinerary planning, recommend destinations based on your interests, answer questions about local customs, and more. What would you like to know?",
  "weather": "The Philippines has a tropical climate with a wet season (June to November) and a dry season (December to May). The best time to visit is during the dry season.",
  "safety": "The Philippines is generally safe for tourists, especially in popular destinations. Like anywhere, be aware of your surroundings, avoid displaying valuables, and follow local guidance.",
  "language": "Filipino (Tagalog) and English are the official languages. English is widely spoken, especially in tourist areas and cities.",
  "currency": "The Philippine Peso (₱) is the official currency. Credit cards are accepted in major establishments, but it's good to have cash for small vendors and rural areas.",
  "food": "Filipino cuisine is diverse and flavorful! Must-tries include adobo (meat stewed in vinegar and soy sauce), lechon (roast pig), sinigang (sour soup), and halo-halo (dessert).",
  "transport": "Options include jeepneys, tricycles, buses, and domestic flights between islands. For convenient island hopping, consider boat tours or ferry services.",
  "visa": "Many tourists can enter visa-free for 30 days. Check the specific requirements for your country before traveling.",
  "budget": "The Philippines can be budget-friendly. Hostels cost around ₱500-1500/night, meals from ₱100-500, and activities from ₱500-3000 depending on the experience.",
  "islands": "The Philippines has over 7,000 islands! Popular destinations include Palawan, Boracay, Cebu, Bohol, and Siargao - each offering unique experiences.",
  "diving": "The Philippines is a world-class diving destination. Tubbataha Reef, Apo Reef, Moalboal, Coron, and Anilao are top spots for diverse marine life and coral reefs."
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      content: DEFAULT_GREETING,
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const processMessage = (userMessage: string): string => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Check for common phrases
    for (const [key, response] of Object.entries(COMMON_RESPONSES)) {
      if (lowercaseMessage.includes(key)) {
        return response;
      }
    }
    
    // Location-specific responses
    if (lowercaseMessage.includes("boracay")) {
      return "Boracay is famous for its white sand beaches. The best time to visit is during the dry season (December to May). Popular activities include island hopping, water sports, and enjoying the nightlife.";
    } else if (lowercaseMessage.includes("palawan") || lowercaseMessage.includes("el nido") || lowercaseMessage.includes("coron")) {
      return "Palawan is known for its limestone cliffs, lagoons, and incredible island scenery. El Nido and Coron offer stunning island hopping tours, diving spots, and pristine beaches.";
    } else if (lowercaseMessage.includes("cebu")) {
      return "Cebu offers a mix of historical sites, beautiful beaches, and vibrant city life. Don't miss the Kawasan Falls, Oslob whale sharks, and the historic Magellan's Cross.";
    } else if (lowercaseMessage.includes("banaue") || lowercaseMessage.includes("rice terraces")) {
      return "The Banaue Rice Terraces are over 2,000 years old and are often called the 'Eighth Wonder of the World'. The best time to visit is April to May or October to November when the terraces are either green or golden.";
    } else if (lowercaseMessage.includes("siargao")) {
      return "Siargao is the surfing capital of the Philippines. Cloud 9 is the most famous surf break, but the island also offers lagoons, caves, and a laid-back atmosphere perfect for relaxation.";
    }
    
    // Activity recommendations
    if (lowercaseMessage.includes("beach") || lowercaseMessage.includes("swimming")) {
      return "For beach lovers, I recommend Boracay for pristine white sand, El Nido for dramatic scenery, Siargao for a surf vibe, or Bantayan Island for a quieter experience.";
    } else if (lowercaseMessage.includes("hike") || lowercaseMessage.includes("mountain")) {
      return "Great hiking destinations include Mt. Pulag for the 'sea of clouds', Mt. Pinatubo for the crater lake, Banaue and Batad for rice terrace treks, and Osmeña Peak in Cebu for beginners.";
    } else if (lowercaseMessage.includes("dive") || lowercaseMessage.includes("snorkel")) {
      return "Top diving spots include Tubbataha Reef in Palawan, Moalboal in Cebu for sardine runs, Anilao in Batangas for macro diving, and Coron for WWII shipwrecks.";
    } else if (lowercaseMessage.includes("food") || lowercaseMessage.includes("eat")) {
      return "To experience Filipino cuisine, try adobo (vinegar-soy stew), sinigang (sour soup), lechon (roast pig), kinilaw (Filipino ceviche), and halo-halo (mixed dessert). Each region has unique specialties worth exploring!";
    }
    
    // Itinerary help
    if (lowercaseMessage.includes("itinerary") || lowercaseMessage.includes("plan") || lowercaseMessage.includes("travel")) {
      return "For a 10-day trip, I recommend spending 3 days in Manila/Tagaytay, 3 days in Palawan (El Nido), and 4 days in Cebu/Bohol. This gives you a mix of city, nature, history, and beaches.";
    }
    
    // Default responses
    const defaultResponses = [
      "That's a great question! I'd recommend exploring our app's destination guides for more detailed information.",
      "I'd be happy to help with that. Could you provide more details about what specifically you're looking for?",
      "That's an interesting question. The Philippines has so much diversity across its 7,000+ islands. Is there a particular region you're interested in?",
      "Great question! I can provide some general information, but you might find more detailed answers in our destination guides or by using the search feature."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Process message and respond after a short delay to simulate thinking
    setTimeout(() => {
      const response = processMessage(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 600);
  };
  
  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 bg-filipino-teal text-white rounded-full p-3 shadow-lg z-10"
        aria-label="Open AI Travel Assistant"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col animate-in fade-in-50 slide-in-from-bottom-10">
            <div className="p-3 border-b flex justify-between items-center bg-filipino-teal text-white rounded-t-lg">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                <span className="font-medium">AI Travel Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-3 space-y-3 min-h-[300px] max-h-[60vh]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg max-w-[85%] ${
                    message.role === "assistant"
                      ? "bg-muted/30 rounded-tl-none"
                      : "bg-filipino-teal/10 rounded-tr-none ml-auto"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-3 border-t">
              <form 
                className="flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <input
                  type="text"
                  placeholder="Ask anything about the Philippines..."
                  className="flex-1 p-2 rounded-l-md border border-r-0 focus:outline-none focus:ring-1 focus:ring-filipino-teal"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoFocus
                />
                <Button 
                  type="submit" 
                  className="bg-filipino-teal hover:bg-filipino-teal/90 rounded-l-none flex items-center"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                Ask about destinations, activities, local culture, or travel tips!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
