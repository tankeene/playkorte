// apps/web/app/host/new/page.tsx
'use client';
import { useState } from 'react';
import LocationAutocomplete from '@/components/LocationAutocomplete';

export default function NewHostPage() {
  const [name, setName] = useState('');
  const [addr, setAddr] = useState('');
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');
  const [sport, setSport] = useState('tennis');
  const [price, setPrice] = useState<string>('8000'); // cents (PHP/SGD – adjust)
  const [status, setStatus] = useState<string>('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Saving…');

    // 1) create facility
    const fRes = await fetch('/api/facilities', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ownerId: 'owner_seed_1',
        name,
        address: addr,
        lat: Number(lat),
        lng: Number(lng),
      }),
    });
    const facility = await fRes.json();
    if (!fRes.ok) { setStatus(`Failed: ${JSON.stringify(facility)}`); return; }

    // 2) create a court
    const cRes = await fetch('/api/courts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        facilityId: facility.id,
        sport,
        hourlyPrice: Number(price),
      }),
    });
    const court = await cRes.json();
    if (!cRes.ok) { setStatus(`Court failed: ${JSON.stringify(court)}`); return; }

    setStatus('Created! Go back to home and Search near that address.');
  }

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-4">Add a court</h1>
      <form onSubmit={submit} className="grid gap-3">
        <div>
          <label className="text-xs text-slate-400 block">Facility name</label>
          <input className="input" value={name} onChange={(e)=>setName(e.target.value)} required />
        </div>
        <div className="bg-slate-950/60 rounded-xl px-3 py-2 border border-slate-700/40">
          <label className="text-xs text-slate-400 block">Address / Place</label>
          <LocationAutocomplete
            onSelect={(v) => { setAddr(v.address); setLat(String(v.lat)); setLng(String(v.lng)); }}
          />
          <div className="text-xs text-slate-400 mt-1 line-clamp-2">{addr}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 block">Latitude</label>
            <input className="input" value={lat} onChange={(e)=>setLat(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs text-slate-400 block">Longitude</label>
            <input className="input" value={lng} onChange={(e)=>setLng(e.target.value)} required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 block">Sport</label>
            <select className="input" value={sport} onChange={(e)=>setSport(e.target.value)}>
              <option>tennis</option>
              <option>badminton</option>
              <option>basketball</option>
              <option>futsal</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 block">Hourly price (in cents)</label>
            <input className="input" value={price} onChange={(e)=>setPrice(e.target.value)} />
          </div>
        </div>
        <button className="button w-fit">Create</button>
      </form>
      {status && <div className="mt-3 text-sm text-slate-300">{status}</div>}
    </div>
  );
}
