import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Mirrors the Checkout modal fields
export class CheckoutDto {
  @IsString() @IsNotEmpty() name: string;
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() phone: string;
  @IsString() @IsNotEmpty() address: string;

  // Only demo COD exists in the frontend; no real payment is taken.
  @IsOptional() @IsIn(['Cash on Delivery (Demo)'])
  paymentMethod?: string;
}
