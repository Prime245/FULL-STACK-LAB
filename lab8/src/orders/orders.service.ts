import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { CheckoutDto } from './orders.dto';

interface Order {
  id: string; userId: string; items: any[]; total: number;
  shipping: { name: string; email: string; phone: string; address: string };
  paymentMethod: string; status: 'confirmed'; createdAt: string;
}

@Injectable()
export class OrdersService {
  private orders: Order[] = []; // in memory (demo)

  constructor(private readonly cart: CartService) {}

  // Checkout = turn the user's server-side cart into an order, then empty the cart.
  checkout(userId: string, dto: CheckoutDto): Order {
    const { items, total } = this.cart.getCart(userId);
    if (!items.length) throw new BadRequestException('Your cart is empty');

    const order: Order = {
      id: 'SN-' + Date.now().toString().slice(-8), // same format as the frontend
      userId,
      items,   // snapshot: later price changes won't alter old orders
      total,
      shipping: { name: dto.name.trim(), email: dto.email, phone: dto.phone.trim(), address: dto.address.trim() },
      paymentMethod: dto.paymentMethod ?? 'Cash on Delivery (Demo)',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    this.orders.push(order);
    this.cart.clear(userId);
    return order;
  }

  findMine(userId: string) { return this.orders.filter(o => o.userId === userId); }

  findOne(userId: string, id: string) {
    // Filter by userId too -> users can't read each other's orders
    const order = this.orders.find(o => o.id === id && o.userId === userId);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
