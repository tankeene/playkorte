// apps/web/components/SearchBar.tsx
'use client';
import React from 'react';
import LocationAutocomplete from './LocationAutocomplete';

export default function SearchBar({
  lat, lng, radius,
  onLat, onLng, onRadius,
  onSubmit,
}: {
  lat: string; lng: string; radius: string;
  onLat: (v: string)=>void;
  onLng: (v: string)=>void;
  onRadius: (v: string)=>void;
  onSubmit: (e: React.FormEvent)=>void;
}) {
  return (
    <form onSubmit={onSubmit} className="grid gap-2 md:flex items-center bg-slate-900/60 border border-white/10 rounded-2xl p-2 backdrop-blur">
      <div className="flex-1 grid md:grid-cols-4 gap-2">
        {/* Address / place search (Google Places) */}
        <div className="md:col-span-2 bg-slate-950/60 rounded-xl px-3 py-2 border border-slate-700/40">
          <label className="text-xs text-slate-400 block">Find location</label>
          <LocationAutocomplete
            className="w-full bg-transparent outline-none"
            placeholder="Type a city, building or address"
            onSelect={(v) => { onLat(String(v.lat)); onLng(String(v.lng)); }}
          />
        </div>

        {/* Lat/Lng (auto-filled from selection, still editable) */}
        <div className="bg-slate-950/60 rounded-xl px-3 py-2 border border-slate-700/40">
          <label className="text-xs text-slate-400 block">Latitude</label>
          <input value={lat} onChange={(e)=>onLat(e.target.value)} className="w-full bg-transparent outline-none" />
        </div>
        <div className="bg-slate-950/60 rounded-xl px-3 py-2 border border-slate-700/40">
          <label className="text-xs text-slate-400 block">Longitude</label>
          <input value={lng} onChange={(e)=>onLng(e.target.value)} className="w-full bg-transparent outline-none" />
        </div>

        <div className="bg-slate-950/60 rounded-xl px-3 py-2 border border-slate-700/40">
          <label className="text-xs text-slate-400 block">Radius (m)</label>
          <input value={radius} onChange={(e)=>onRadius(e.target.value)} className="w-full bg-transparent outline-none" />
        </div>
      </div>

      <button type="submit" className="px-5 py-3 rounded-xl bg-cyan-300 text-black font-semibold hover:opacity-90">
        Search
      </button>
    </form>
  );
}
