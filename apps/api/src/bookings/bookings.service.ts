import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';

@Injectable()
export class BookingsService {
  private redis: Redis;
  constructor(private prisma: PrismaService) {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async holdSlot(slotId: string, userId: string, ttlSeconds = 600) {
    const slot = await this.prisma.timeSlot.findUnique({ where: { id: slotId } });
    if (!slot || slot.status !== 'open') throw new BadRequestException('Slot unavailable');

    // mark held in DB
    await this.prisma.timeSlot.update({ where: { id: slotId }, data: { status: 'held', heldBy: userId } });
    // store TTL in Redis
    const key = `hold:${slotId}`;
    const ok = await this.redis.set(key, userId, 'EX', ttlSeconds, 'NX');
    if (!ok) throw new BadRequestException('Already held');
    return { ok: true, slotId, expiresIn: ttlSeconds };
  }

  async releaseHold(slotId: string) {
    await this.prisma.timeSlot.update({ where: { id: slotId }, data: { status: 'open', heldBy: null } });
    await this.redis.del(`hold:${slotId}`);
    return { ok: true };
  }

  async createBooking(slotId: string, userId: string, amount: number) {
    const slot = await this.prisma.timeSlot.findUnique({ where: { id: slotId } });
    if (!slot || slot.status !== 'held' || slot.heldBy !== userId) throw new BadRequestException('Slot not held by user');
    const court = await this.prisma.court.findUnique({ where: { id: slot.courtId } });
    if (!court) throw new BadRequestException('Court not found');
    const booking = await this.prisma.booking.create({
      data: {
        userId,
        courtId: slot.courtId,
        slotId,
        amount,
        status: 'pending'
      }
    });
    return booking;
  }

  async markPaid(bookingId: string) {
    const booking = await this.prisma.booking.update({ where: { id: bookingId }, data: { status: 'paid' } });
    await this.prisma.timeSlot.update({ where: { id: booking.slotId }, data: { status: 'booked' } });
    await this.redis.del(`hold:${booking.slotId}`);
    return booking;
  }
}
