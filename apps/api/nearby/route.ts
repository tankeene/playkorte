// apps/web/app/api/nearby/route.ts
export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = url.searchParams.get('lat');
  const lng = url.searchParams.get('lng');
  const radius = url.searchParams.get('radius') ?? '5000';

  if (!lat || !lng) {
    return new Response(JSON.stringify({ error: 'lat and lng are required' }), { status: 400 });
  }

  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    const upstream = await fetch(`${api}/facilities/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, {
      cache: 'no-store',
    });
    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(JSON.stringify({ error: 'Upstream error', details: text }), { status: upstream.status });
    }
    const data = await upstream.json();
    return Response.json(data);
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Failed to reach API', details: e?.message || String(e) }), { status: 502 });
  }
}
