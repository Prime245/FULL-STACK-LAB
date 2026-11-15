import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService], // OrdersModule reads + clears the cart at checkout
})
export class CartModule {}
