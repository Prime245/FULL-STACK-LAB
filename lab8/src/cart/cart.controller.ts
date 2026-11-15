import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto, UpdateQuantityDto } from './cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../common/current-user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard) // every cart route needs a logged-in user
export class CartController {
  constructor(private readonly cart: CartService) {}

  // GET /api/cart
  @Get()
  get(@CurrentUser() u: AuthUser) { return this.cart.getCart(u.sub); }

  // POST /api/cart/items   body: { "productId": 1, "quantity": 2 }
  @Post('items')
  add(@CurrentUser() u: AuthUser, @Body() dto: AddItemDto) {
    return this.cart.addItem(u.sub, dto.productId, dto.quantity);
  }

  // PATCH /api/cart/items/1   body: { "quantity": 3 }
  @Patch('items/:productId')
  update(
    @CurrentUser() u: AuthUser,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateQuantityDto,
  ) { return this.cart.updateQuantity(u.sub, productId, dto.quantity); }

  // DELETE /api/cart/items/1   (the "Remove" button)
  @Delete('items/:productId')
  remove(@CurrentUser() u: AuthUser, @Param('productId', ParseIntPipe) productId: number) {
    return this.cart.removeItem(u.sub, productId);
  }

  // DELETE /api/cart           (empty the whole cart)
  @Delete()
  clear(@CurrentUser() u: AuthUser) {
    this.cart.clear(u.sub);
    return this.cart.getCart(u.sub);
  }
}
