import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';

@Module({
  providers: [FacilitiesService],
  controllers: [FacilitiesController]
})
export class FacilitiesModule {}
