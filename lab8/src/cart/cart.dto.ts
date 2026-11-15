import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class AddItemDto {
  @IsInt() @Min(1)
  productId: number;

  @IsOptional() @IsInt() @Min(1) @Max(99)
  quantity?: number; // defaults to 1, like the "Add to Cart" button
}

// Same 1..99 whole-number rule as the quantity input in the cart table
export class UpdateQuantityDto {
  @IsInt() @Min(1) @Max(99)
  quantity: number;
}
