import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { BookingsService } from '../bookings/bookings.service';

@Module({
  providers: [PaymentsService, BookingsService],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
