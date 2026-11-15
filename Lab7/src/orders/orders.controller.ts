import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './orders.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../common/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  // POST /api/orders   (Checkout form -> "Place Demo Order")
  @Post()
  checkout(@CurrentUser() u: AuthUser, @Body() dto: CheckoutDto) {
    return this.orders.checkout(u.sub, dto);
  }

  // GET /api/orders        -> my order history
  @Get()
  mine(@CurrentUser() u: AuthUser) { return this.orders.findMine(u.sub); }

  // GET /api/orders/SN-12345678
  @Get(':id')
  one(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    return this.orders.findOne(u.sub, id);
  }
}
