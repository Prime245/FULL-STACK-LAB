import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../entities';
import { ProductsService } from '../products/products.service';

const MAX_QTY = 99;

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem) private readonly repo: Repository<CartItem>,
    private readonly products: ProductsService,
  ) {}

  // Builds what the cart modal needs: rows + totals. Prices come from the DB,
  // so the browser can't fake them.
  async getCart(userId: string) {
    const rows = await this.repo.find({
      where: { userId },
      relations: { product: true },
      order: { id: 'ASC' },
    });
    const items = rows.map(r => ({
      productId: r.productId, name: r.product.name, icon: r.product.icon,
      price: r.product.price, quantity: r.quantity,
      subtotal: r.product.price * r.quantity,
    }));
    return {
      items,
      totalItems: items.reduce((s, i) => s + i.quantity, 0), // navbar badge
      total: items.reduce((s, i) => s + i.subtotal, 0),      // "Total: Rs. ..."
    };
  }

  async addItem(userId: string, productId: number, quantity = 1) {
    await this.products.findOne(productId); // 404 if product doesn't exist
    const existing = await this.repo.findOneBy({ userId, productId });
    const newQty = (existing?.quantity ?? 0) + quantity;
    if (newQty > MAX_QTY) {
      throw new BadRequestException(`Maximum quantity is ${MAX_QTY} per product`);
    }
    if (existing) await this.repo.update(existing.id, { quantity: newQty });
    else await this.repo.insert({ userId, productId, quantity });
    return this.getCart(userId);
  }

  async updateQuantity(userId: string, productId: number, quantity: number) {
    const res = await this.repo.update({ userId, productId }, { quantity });
    if (!res.affected) throw new NotFoundException('Item is not in your cart');
    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: number) {
    await this.repo.delete({ userId, productId });
    return this.getCart(userId);
  }

  async clear(userId: string) { await this.repo.delete({ userId }); }
}
