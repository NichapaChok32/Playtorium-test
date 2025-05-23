import { Injectable } from '@nestjs/common';
import { CartItemDto } from './dto/cart.dto';
import { CampaignDto } from './dto/campaign.dto';
import { PrismaService } from '../prisma.service';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class DiscountService {
  constructor(private prisma: PrismaService) {}

  async calculate(cart: CartItemDto[], campaigns: CampaignDto[]) {
    const totalBefore = cart.reduce((sum, item) => sum + item.price, 0);
    let total = totalBefore;

    const couponCampaign = campaigns.find(
      (c) => c.type === 'FixedAmount' || c.type === 'PercentageCoupon',
    );
    const onTopCampaigns = campaigns.filter(
      (c) => c.type === 'CategoryPercentage' || c.type === 'Points',
    );
    const seasonalCampaign = campaigns.find((c) => c.type === 'Seasonal');

    // Coupon
    if (couponCampaign?.type === 'FixedAmount') {
      total -= couponCampaign.amount ?? 0;
    } else if (couponCampaign?.type === 'PercentageCoupon') {
      total *= 1 - (couponCampaign.percentage ?? 0) / 100;
    }

    // On Top
    for (const camp of onTopCampaigns) {
      if (camp.type === 'CategoryPercentage') {
        const discountable = cart.filter(
          (item) => item.category === camp.category,
        );
        const discount = discountable.reduce(
          (sum, item) => sum + item.price * ((camp.percentage ?? 0) / 100),
          0,
        );
        total -= discount;
      } else if (camp.type === 'Points') {
        const maxDiscount = total * 0.2;
        const discount = Math.min(camp.points ?? 0, maxDiscount);
        total -= discount;
      }
    }

    // Seasonal
    if (seasonalCampaign?.type === 'Seasonal') {
      const multiples = Math.floor(total / (seasonalCampaign.every ?? 1));
      total -= multiples * (seasonalCampaign.discount ?? 0);
    }

    const result = Math.max(0, Math.round(total * 100) / 100);

    const plainCart = instanceToPlain(cart);
    const plainCampaigns = instanceToPlain(campaigns);

    await this.prisma.discountHistory.create({
      data: {
        cartJson: plainCart,
        campaignJson: plainCampaigns,
        totalBefore,
        totalAfter: result,
      },
    });

    return {
      totalBeforeDiscount: totalBefore,
      totalAfterDiscount: result,
      appliedCampaigns: campaigns.map((c) => c.type),
    };
  }
}
