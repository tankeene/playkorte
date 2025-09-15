// apps/web/app/api/facilities/route.ts
export async function POST(req: Request) {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const body = await req.json();
  const r = await fetch(`${api}/facilities`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  return new Response(text, { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' }});
}
