import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [PrismaModule, FacilitiesModule, BookingsModule, PaymentsModule],
})
export class AppModule {}
