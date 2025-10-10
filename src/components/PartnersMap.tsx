import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Partner {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

interface PartnersMapProps {
  partners: Partner[];
}

const PartnersMap = ({ partners }: PartnersMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = React.useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    
    if (!mapboxToken) {
      setMapError(true);
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    const validPartners = partners.filter(p => p.latitude && p.longitude);
    
    const center: [number, number] = validPartners.length > 0
      ? [validPartners[0].longitude!, validPartners[0].latitude!]
      : [-74.5, 40]; // Default to New York area

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each partner
    validPartners.forEach((partner) => {
      if (partner.latitude && partner.longitude) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${partner.name}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${partner.type}</p>
            <p style="font-size: 12px;">${partner.address}</p>
          </div>`
        );

        new mapboxgl.Marker({ color: '#8B5CF6' })
          .setLngLat([partner.longitude, partner.latitude])
          .setPopup(popup)
          .addTo(map.current!);
      }
    });

    // Fit bounds to show all markers
    if (validPartners.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      validPartners.forEach((partner) => {
        if (partner.latitude && partner.longitude) {
          bounds.extend([partner.longitude, partner.latitude]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }

    return () => {
      map.current?.remove();
    };
  }, [partners]);

  if (mapError) {
    return (
      <div className="w-full h-full rounded-2xl bg-muted flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-muted-foreground">Map view temporarily unavailable</p>
          <p className="text-sm text-muted-foreground mt-2">Partners are listed below</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="w-full h-full rounded-2xl" />
  );
};

export default PartnersMap;
