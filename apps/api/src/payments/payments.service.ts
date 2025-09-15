import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createCheckout(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId }, include: { slot: true, court: { include: { facility: true } } } });
    if (!booking) throw new Error('Booking not found');
    // amount in cents
    const amount = booking.amount;
    const apiKey = process.env.PAYMONGO_SECRET_KEY;
    const successUrl = `${process.env.APP_URL}/booking/${bookingId}?status=success`;
    const cancelUrl = `${process.env.APP_URL}/booking/${bookingId}?status=cancel`;

    const res = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': 'Basic ' + Buffer.from(apiKey + ':').toString('base64')
      },
      body: JSON.stringify({
        data: { attributes: {
          cancel_url: cancelUrl,
          success_url: successUrl,
          payment_method_types: ['gcash','paymaya','card','grab_pay'],
          line_items: [{ name: 'Court booking', amount, currency: 'PHP', quantity: 1 }],
          metadata: { bookingId }
        }}
      })
    });
    const json = await res.json();
    return json;
  }
}
