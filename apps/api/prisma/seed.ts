// apps/api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createSlots(courtId: string) {
  const now = new Date();
  const days = 2;                 // next 2 days
  const startHour = 8;            // 08:00 - 22:00
  const endHour = 22;

  for (let d = 0; d < days; d++) {
    for (let h = startHour; h < endHour; h++) {
      const start = new Date(now);
      start.setDate(now.getDate() + d);
      start.setHours(h, 0, 0, 0);
      const end = new Date(start); end.setHours(h + 1);

      await prisma.timeSlot.create({
        data: { courtId, startAt: start, endAt: end, status: 'open' }
      });
    }
  }
}

async function main() {
  // owners
  const owner1 = await prisma.user.upsert({
    where: { email: 'owner1@example.com' },
    update: {},
    create: { email: 'owner1@example.com', name: 'Owner One', role: 'owner' }
  });
  const owner2 = await prisma.user.upsert({
    where: { email: 'owner2@example.com' },
    update: {},
    create: { email: 'owner2@example.com', name: 'Owner Two', role: 'owner' }
  });

  // facilities
  const f1 = await prisma.facility.create({
    data: {
      ownerId: owner1.id,
      name: 'Kallang Tennis Centre',
      address: '8 Stadium Blvd, Singapore',
      lat: 1.30245,
      lng: 103.8750
    }
  });
  const f2 = await prisma.facility.create({
    data: {
      ownerId: owner2.id,
      name: 'Tampines Badminton Hall',
      address: 'Tampines, Singapore',
      lat: 1.3530,
      lng: 103.9450
    }
  });

  const c1 = await prisma.court.create({ data: { facilityId: f1.id, sport: 'tennis', hourlyPrice: 9000 }});
  const c2 = await prisma.court.create({ data: { facilityId: f1.id, sport: 'tennis', hourlyPrice: 8000 }});
  const c3 = await prisma.court.create({ data: { facilityId: f2.id, sport: 'badminton', hourlyPrice: 5000 }});

  await createSlots(c1.id);
  await createSlots(c2.id);
  await createSlots(c3.id);

  console.log('Seed complete.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
