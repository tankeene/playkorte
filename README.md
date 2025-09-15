# PlayKorte (TypeScript • Next.js • NestJS • Prisma • Postgres • Redis)
PlayKorte is an Airbnb for Sports Courts, connecting court owners to players through a seamless digital marketplace.

## Overview
PlayKorte enables:
- Court owners to list and manage their sports courts (pickle, paddle, tennis, badminton, football, etc.)
- Players to discover, book, and pay for courts easily
- Secure, transparent transactions and reviews
- Real-time availability and booking management

It includes:
- **Web** app (Next.js App Router + Tailwind)
- **API** (NestJS + Prisma)
- **Postgres** (with optional PostGIS) and **Redis**
- Minimal booking + geo search primitives
- PayMongo checkout **stubs** (wire your keys before using in prod)

## Quick start

### 1) Prereqs
- Node.js 20+
- Docker (for Postgres & Redis)

### 2) Spin up DBs
```bash
docker compose up -d
```

### 3) Configure env
Copy examples and fill in values:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### 4) Install deps & generate Prisma client
```bash
# In api
cd apps/api
npm i
npx prisma generate
# (Optional, after you created the DB): npx prisma migrate dev --name init
```

### 5) Seed schema (enable PostGIS + base tables)
> You can use Prisma Migrate later. For PostGIS functions in search, enable the extension once:
```bash
docker exec -it playkorte-postgres psql -U postgres -d playkorte -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

### 6) Run API
```bash
npm run start:dev
# API on http://localhost:3001
```

### 7) Run Web
```bash
cd ../../apps/web
npm i
npm run dev
# Web on http://localhost:3000
```

### Test it
- Create a facility via `POST http://localhost:3001/facilities` (see **apps/api/requests.http** for examples)
- Open http://localhost:3000 and try a nearby search with coordinates

## Notes
- The PayMongo integration is stubbed. Add your keys + success/cancel URLs in `apps/api/src/payments/payments.service.ts`.
- `geo` is handled using lat/lng columns. PostGIS is used via raw SQL (ST_DWithin/ST_Distance).
- Slot materialization is simplified for v0; you can move it to a worker later.

## License
[MIT](LICENSE)