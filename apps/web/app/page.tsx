// apps/web/app/page.tsx
'use client';
import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import CourtCard from '../components/CourtCard';

type Facility = {
  id: string;
  name: string;
  address: string;
  meters: number;
  lat: number;
  lng: number;
};

export default function Home() {
  const [lat, setLat] = useState('1.3521');      // Singapore default
  const [lng, setLng] = useState('103.8198');
  const [radius, setRadius] = useState('8000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Facility[]>([]);

  async function onSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    onSearch().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl p-8 md:p-14 bg-gradient-to-b from-sky-900/40 to-slate-900 border border-white/10">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Book courts, play more.</h1>
          <p className="mt-3 text-slate-300">Find basketball, badminton, tennis and more—near you, at the times you want.</p>
        </div>
        <div className="mt-6">
          <SearchBar
            lat={lat} lng={lng} radius={radius}
            onLat={setLat} onLng={setLng} onRadius={setRadius}
            onSubmit={onSearch}
          />
        </div>
      </section>

      {/* Results */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-xl font-semibold">Available near you</h2>
          <div className="text-sm text-slate-400">{results.length} result{results.length===1?'':'s'}</div>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-red-900/30 border border-red-500/30 text-sm">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl h-64 bg-slate-800/60 border border-slate-700/60" />
              ))
            : results.map((f) => <CourtCard key={f.id} facility={f} />)
          }
        </div>
      </section>
    </div>
  );
}
