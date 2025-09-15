// apps/web/components/LocationAutocomplete.tsx
'use client';
import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

type Props = {
  placeholder?: string;
  onSelect: (v: { lat: number; lng: number; address: string }) => void;
  className?: string;
};

export default function LocationAutocomplete({ placeholder, onSelect, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
    const loader = new Loader({ apiKey: key, version: 'weekly', libraries: ['places'] });

    let ac: google.maps.places.Autocomplete | null = null;
    loader.load().then((google) => {
      if (!inputRef.current) return;
      ac = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ['geometry', 'formatted_address', 'name'],
        types: ['geocode'],
      });
      ac.addListener('place_changed', () => {
        const p = ac!.getPlace();
        const loc = p.geometry?.location;
        if (loc) {
          onSelect({
            lat: loc.lat(),
            lng: loc.lng(),
            address: p.formatted_address || p.name || '',
          });
        }
      });
    });

    return () => { /* nothing to clean for now */ };
  }, [onSelect]);

  return (
    <input
      ref={inputRef}
      className={className ?? 'w-full bg-transparent outline-none'}
      placeholder={placeholder ?? 'Search a place or address'}
    />
  );
}
