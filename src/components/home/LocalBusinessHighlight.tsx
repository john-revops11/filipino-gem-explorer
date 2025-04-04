
import { Button } from "@/components/ui/button";

export function LocalBusinessHighlight() {
  return (
    <section className="py-6">
      <div className="rounded-lg overflow-hidden bg-white border border-filipino-terracotta/20 shadow-sm">
        <div className="aspect-video relative">
          <img
            src="https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?auto=format&fit=crop&w=800&q=80"
            alt="Local Business"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-filipino-terracotta text-white px-2 py-1 rounded-md text-xs font-medium">
            Local Business
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">Casa Leonora Homestay</h3>
          <p className="text-sm text-muted-foreground mb-3">Batanes</p>
          
          <p className="text-sm mb-4">
            Experience authentic Ivatan hospitality and culture in this family-owned homestay with traditional stone house architecture.
          </p>
          
          <Button className="w-full bg-filipino-terracotta hover:bg-filipino-terracotta/90 text-white">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
