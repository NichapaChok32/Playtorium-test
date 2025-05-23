import { IsNumber, IsString, IsEnum } from 'class-validator';

export enum Category {
  Clothing = 'Clothing',
  Accessories = 'Accessories',
  Electronics = 'Electronics',
}

export class CartItemDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsEnum(Category)
  category: Category;
}
