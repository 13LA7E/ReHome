import { useState } from "react";
import { MapPin, Phone, Mail, Calendar, Navigation, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

interface Partner {
  id: string;
  name: string;
  type: string;
  distance: string;
  rating: number;
  address: string;
  phone: string;
  email: string;
  verified: boolean;
}

const mockPartners: Partner[] = [
  {
    id: "1",
    name: "Hope Foundation",
    type: "NGO",
    distance: "1.2 km",
    rating: 4.8,
    address: "123 Main St, Community Center",
    phone: "+1 234-567-8900",
    email: "contact@hopefoundation.org",
    verified: true
  },
  {
    id: "2",
    name: "Green Valley School",
    type: "School",
    distance: "2.5 km",
    rating: 4.6,
    address: "456 Education Ave, District 2",
    phone: "+1 234-567-8901",
    email: "donations@greenvalley.edu",
    verified: true
  },
  {
    id: "3",
    name: "EcoRecycle Center",
    type: "Recycler",
    distance: "3.8 km",
    rating: 4.9,
    address: "789 Industrial Rd, Zone B",
    phone: "+1 234-567-8902",
    email: "info@ecorecycle.com",
    verified: true
  }
];

const Partners = () => {
  const location = useLocation();
  const classification = location.state?.classification;
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const handleSchedulePickup = (partner: Partner) => {
    setSelectedPartner(partner);
    toast.success(`Pickup request sent to ${partner.name}!`);
  };

  const handleGetDirections = (partner: Partner) => {
    toast.info(`Opening directions to ${partner.name}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-12 space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Find Partner Organizations
          </h1>
          {classification && (
            <div className="flex items-center gap-2 text-lg text-muted-foreground">
              <span>Showing partners for:</span>
              <span className="px-4 py-1 bg-primary text-primary-foreground rounded-full font-semibold">
                {classification.category}
              </span>
            </div>
          )}
        </div>

        {/* Map Placeholder */}
        <Card className="p-8 mb-8 shadow-hover animate-slide-up">
          <div className="bg-gradient-to-br from-secondary to-muted rounded-2xl h-96 flex items-center justify-center border border-border">
            <div className="text-center space-y-4">
              <MapPin className="w-16 h-16 text-primary mx-auto animate-float" />
              <p className="text-lg font-semibold text-foreground">Interactive Map</p>
              <p className="text-muted-foreground">Partner locations will be displayed here</p>
            </div>
          </div>
        </Card>

        {/* Partners List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Nearby Partners ({mockPartners.length})
          </h2>

          <div className="grid gap-6">
            {mockPartners.map((partner, index) => (
              <Card 
                key={partner.id} 
                className="p-6 hover:shadow-hover transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Partner Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-2xl font-bold text-foreground">{partner.name}</h3>
                          {partner.verified && (
                            <div className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full font-semibold">
                              ✓ Verified
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="px-3 py-1 bg-secondary rounded-full">{partner.type}</span>
                          <span className="flex items-center gap-1">
                            <Navigation className="w-4 h-4" />
                            {partner.distance} away
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-accent">
                        <Star className="w-5 h-5 fill-accent" />
                        <span className="font-bold">{partner.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {partner.address}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {partner.phone}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {partner.email}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 md:min-w-[200px]">
                    <Button 
                      variant="hero" 
                      onClick={() => handleSchedulePickup(partner)}
                      className="w-full"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule Pickup
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleGetDirections(partner)}
                      className="w-full"
                    >
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
