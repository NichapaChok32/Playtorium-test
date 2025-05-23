import { IsNumber, IsOptional, IsEnum, IsString } from 'class-validator';
import { Category } from './cart.dto';

export class CampaignDto {
  @IsString()
  type:
    | 'FixedAmount'
    | 'PercentageCoupon'
    | 'CategoryPercentage'
    | 'Points'
    | 'Seasonal';

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsNumber()
  percentage?: number;

  @IsOptional()
  @IsNumber()
  points?: number;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsNumber()
  every?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;
}
