export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = url.searchParams.get('lat');
  const lng = url.searchParams.get('lng');
  const radius = url.searchParams.get('radius') ?? '5000';
  if (!lat || !lng) return new Response(JSON.stringify({ error: 'lat and lng are required' }), { status: 400 });

  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const r = await fetch(`${api}/facilities/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, { cache: 'no-store' });
  const txt = await r.text();
  return new Response(txt, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' }});
}
