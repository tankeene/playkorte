import { Controller, Post, Body, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private svc: BookingsService) {}

  @Post('hold')
  async hold(@Body() body: { slotId: string, userId: string }) {
    return this.svc.holdSlot(body.slotId, body.userId);
  }

  @Post('release')
  async release(@Body() body: { slotId: string }) {
    return this.svc.releaseHold(body.slotId);
  }

  @Post()
  async create(@Body() body: { slotId: string, userId: string, amount: number }) {
    return this.svc.createBooking(body.slotId, body.userId, body.amount);
  }
}
