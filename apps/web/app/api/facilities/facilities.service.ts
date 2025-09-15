import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type FacilityRow = {
  id: string; name: string; address: string; lat: number; lng: number; meters: number;
};

@Injectable()
export class FacilitiesService {
  constructor(private prisma: PrismaService) {}

  async createFacility(input: { ownerId: string, name: string, address: string, lat: number, lng: number }) {
    return this.prisma.facility.create({ data: input });
  }

  async createCourt(input: { facilityId: string, sport: string, surface?: string, hourlyPrice: number }) {
    return this.prisma.court.create({ data: input });
  }

  // Haversine (no PostGIS required)
  async nearby(lat: number, lng: number, radiusMeters = 5000) {
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      throw new BadRequestException('Invalid coords');
    }

    const rows = await this.prisma.$queryRaw<FacilityRow[]>`
      SELECT f.id, f.name, f.address, f.lat, f.lng,
        (6371000 * acos(
          cos(radians(${lat})) * cos(radians(f.lat)) * cos(radians(f.lng) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(f.lat))
        )) AS meters
      FROM "Facility" f
      WHERE
        (6371000 * acos(
          cos(radians(${lat})) * cos(radians(f.lat)) * cos(radians(f.lng) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(f.lat))
        )) <= ${radiusMeters}
      ORDER BY meters ASC
      LIMIT 50;
    `;
    return rows;

    // PostGIS version for later:
    // const rows = await this.prisma.$queryRaw<FacilityRow[]>`
    //   SELECT f.id, f.name, f.address, f.lat, f.lng,
    //          ST_Distance(
    //            ST_SetSRID(ST_MakePoint(f.lng, f.lat), 4326),
    //            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
    //          ) AS meters
    //   FROM "Facility" f
    //   WHERE ST_DWithin(
    //            ST_SetSRID(ST_MakePoint(f.lng, f.lat), 4326),
    //            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
    //            ${radiusMeters}
    //         )
    //   ORDER BY meters ASC
    //   LIMIT 50;
    // `;
    // return rows;
  }
}
