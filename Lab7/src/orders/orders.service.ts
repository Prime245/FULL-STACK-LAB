import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { CartItem, Order, OrderItem } from '../entities';
import { CheckoutDto } from './orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    private readonly ds: DataSource,
  ) {}

  // Checkout = cart rows -> order rows, then empty the cart.
  // Runs in ONE transaction: either everything is saved or nothing is
  // (no half-created orders, no cart emptied without an order).
  checkout(userId: string, dto: CheckoutDto) {
    return this.ds.transaction(async em => {
      const rows = await em.find(CartItem, { where: { userId }, relations: { product: true } });
      if (!rows.length) throw new BadRequestException('Your cart is empty');

      // Snapshot name/price at purchase time
      const items = rows.map(r => em.create(OrderItem, {
        productId: r.productId, name: r.product.name, icon: r.product.icon,
        price: r.product.price, quantity: r.quantity,
        subtotal: r.product.price * r.quantity,
      }));

      const order = em.create(Order, {
        id: 'SN-' + String(randomInt(0, 100_000_000)).padStart(8, '0'),
        userId,
        total: items.reduce((s, i) => s + i.subtotal, 0),
        name: dto.name.trim(), email: dto.email,
        phone: dto.phone.trim(), address: dto.address.trim(),
        paymentMethod: dto.paymentMethod ?? 'Cash on Delivery (Demo)',
        status: 'confirmed',
        items, // saved automatically (cascade)
      });
      await em.save(order);
      await em.delete(CartItem, { userId });
      return order;
    });
  }

  findMine(userId: string) {
    return this.orders.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findOne(userId: string, id: string) {
    // Filter by userId too -> users can't read each other's orders
    const order = await this.orders.findOneBy({ id, userId });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
