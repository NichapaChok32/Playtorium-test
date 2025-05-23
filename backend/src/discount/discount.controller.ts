import { Controller, Post, Body } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CartItemDto } from './dto/cart.dto';
import { CampaignDto } from './dto/campaign.dto';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post('calculate')
  async calculateDiscount(
    @Body('cart') cart: CartItemDto[],
    @Body('campaigns') campaigns: CampaignDto[],
  ) {
    return this.discountService.calculate(cart, campaigns);
  }
}
