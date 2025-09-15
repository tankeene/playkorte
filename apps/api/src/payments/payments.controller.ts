import { Controller, Post, Body, Req, Headers } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { BookingsService } from '../bookings/bookings.service';

@Controller('payments')
export class PaymentsController {
  constructor(private svc: PaymentsService, private bookings: BookingsService) {}

  @Post('checkout')
  async checkout(@Body() body: { bookingId: string }) {
    return this.svc.createCheckout(body.bookingId);
  }

  // Webhook endpoint (simplified - add signature verification in prod)
  @Post('webhook')
  async webhook(@Body() payload: any, @Headers('paymongo-signature') signature: string) {
    const type = payload?.data?.attributes?.type;
    const bookingId = payload?.data?.attributes?.data?.attributes?.metadata?.bookingId;
    if (type === 'payment.paid' && bookingId) {
      await this.bookings.markPaid(bookingId);
      return { ok: true };
    }
    return { ok: true };
  }
}
