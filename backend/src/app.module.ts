import { Module } from '@nestjs/common';
import { DiscountController } from './discount/discount.controller';
import { DiscountService } from './discount/discount.service';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService, DiscountService],
  exports: [PrismaService],
  controllers: [DiscountController],
})
export class AppModule {}
