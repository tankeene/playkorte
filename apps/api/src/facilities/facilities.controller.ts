import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';

@Controller('facilities')
export class FacilitiesController {
  constructor(private svc: FacilitiesService) {}

  @Post()
  async createFacility(@Body() body: any) {
    // { ownerId, name, address, lat, lng }
    return this.svc.createFacility(body);
  }

  @Post('courts')
  async createCourt(@Body() body: any) {
    // { facilityId, sport, surface, hourlyPrice }
    return this.svc.createCourt(body);
  }

  @Get('nearby')
  async nearby(@Query('lat') lat: string, @Query('lng') lng: string, @Query('radius') radius?: string) {
    return this.svc.nearby(parseFloat(lat), parseFloat(lng), radius ? parseInt(radius) : 5000);
  }
}
