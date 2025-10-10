import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Calendar, Navigation as NavigationIcon, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Navigation } from "@/components/Navigation";

interface Partner {
  id: string;
  name: string;
  type: string;
  rating: number;
  address: string;
  phone: string | null;
  email: string | null;
  verified: boolean;
  latitude: number | null;
  longitude: number | null;
}

const Partners = () => {
  const { user } = useAuth();
  const location = useLocation();
  const classification = location.state?.classification;
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_partners_safe');
      
      if (error) throw error;
      
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error("Failed to load partners");
    } finally {
      setLoading(false);
    }
  };

  const handleSchedulePickup = async (partner: Partner) => {
    if (!user) return;
    
    try {
      // Here you would create a pickup_request in the database
      toast.success(`Pickup request sent to ${partner.name}!`);
      toast.info("Contact details will be shared once confirmed");
      setSelectedPartner(partner);
    } catch (error) {
      toast.error("Failed to schedule pickup");
    }
  };

  const handleGetDirections = (partner: Partner) => {
    if (partner.latitude && partner.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${partner.latitude},${partner.longitude}`;
      window.open(url, '_blank');
    } else {
      toast.info("Location coordinates not available");
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-glow-pulse text-primary text-xl">Loading partners...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              Nearby Partners ({partners.length})
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Contact info protected</span>
            </div>
          </div>

          {partners.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No partners found. Check back soon!</p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {partners.map((partner, index) => (
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
                          <span className="px-3 py-1 bg-secondary rounded-full capitalize">{partner.type}</span>
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
                      {partner.phone ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {partner.phone}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground/60">
                          <Shield className="w-4 h-4" />
                          <span className="italic">Contact shared after pickup request</span>
                        </div>
                      )}
                      {partner.email ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {partner.email}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground/60">
                          <Shield className="w-4 h-4" />
                          <span className="italic">Contact shared after pickup request</span>
                        </div>
                      )}
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
                      <NavigationIcon className="w-4 h-4" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Partners;
