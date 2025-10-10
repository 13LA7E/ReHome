import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Calendar, Navigation as NavigationIcon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Navigation } from "@/components/Navigation";
import PartnersMap from "@/components/PartnersMap";

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
      
      if (error) {
        console.error('RPC error:', error);
        throw error;
      }
      
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error("Database unavailable - showing sample partners");
      
      // Fallback to mock data when database is unavailable
      setPartners([
        {
          id: '1',
          name: 'Doha Charity Center',
          type: 'charity',
          rating: 4.8,
          address: 'Al Sadd Street, Doha, Qatar',
          phone: '+974 4444 1234',
          email: 'info@dohacharity.org',
          verified: true,
          latitude: 25.2854,
          longitude: 51.5310
        },
        {
          id: '2',
          name: 'Qatar Red Crescent',
          type: 'humanitarian',
          rating: 4.9,
          address: 'Corniche Road, West Bay, Doha',
          phone: '+974 4444 5678',
          email: 'contact@qrcs.org.qa',
          verified: true,
          latitude: 25.3548,
          longitude: 51.5326
        },
        {
          id: '3',
          name: 'Al Noor Recycling Center',
          type: 'recycling',
          rating: 4.5,
          address: 'Industrial Area, Doha, Qatar',
          phone: '+974 4444 9012',
          email: 'info@alnoorrecycling.qa',
          verified: true,
          latitude: 25.1866,
          longitude: 51.4547
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedulePickup = async (partner: Partner) => {
    if (!user) return;
    
    try {
      // Create a pickup request in the database
      const { data: items } = await supabase
        .from('items')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .limit(1)
        .maybeSingle();
      
      if (items) {
        await supabase.from('pickup_requests').insert({
          user_id: user.id,
          partner_id: partner.id,
          item_id: items.id,
          status: 'pending'
        });
      }
      
      toast.success(`Pickup request sent to ${partner.name}!`);
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

        {/* Interactive Map */}
        {partners.length > 0 && (
          <Card className="p-4 mb-8 shadow-hover animate-slide-up">
            <div className="h-96 rounded-2xl overflow-hidden">
              <PartnersMap partners={partners} />
            </div>
          </Card>
        )}

          <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              Nearby Partners ({partners.length})
            </h2>
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
                      {partner.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${partner.phone}`} className="hover:text-primary transition-colors">
                            {partner.phone}
                          </a>
                        </div>
                      )}
                      {partner.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${partner.email}`} className="hover:text-primary transition-colors">
                            {partner.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 md:min-w-[200px]">
                    <Button 
                      onClick={() => handleSchedulePickup(partner)}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Pickup
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleGetDirections(partner)}
                      className="w-full font-semibold"
                    >
                      <NavigationIcon className="w-4 h-4 mr-2" />
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
