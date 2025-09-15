// apps/web/components/CourtCard.tsx
import React from 'react';

type Props = {
  facility: {
    id: string;
    name: string;
    address: string;
    meters: number;
    lat: number;
    lng: number;
  }
};

export default function CourtCard({ facility }: Props) {
  const km = (facility.meters ?? 0) / 1000;
  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900/50 hover:border-slate-500/60 transition">
      <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-800" />
      <div className="p-3">
        <div className="font-semibold">{facility.name}</div>
        <div className="text-sm text-slate-300 line-clamp-2">{facility.address}</div>
        <div className="text-xs text-slate-400 mt-1">{km.toFixed(2)} km away</div>
      </div>
    </div>
  );
}
