import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Connect once on module init
    await this.$connect();
  }

  async onModuleDestroy() {
    // Cleanly disconnect when Nest shuts down
    await this.$disconnect();
  }
}
