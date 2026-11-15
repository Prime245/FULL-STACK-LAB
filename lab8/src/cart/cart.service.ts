import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

interface CartItem { productId: number; quantity: number }
const MAX_QTY = 99;

@Injectable()
export class CartService {
  // userId -> that user's cart items (in memory for the demo)
  private carts = new Map<string, CartItem[]>();

  constructor(private readonly products: ProductsService) {}

  private items(userId: string): CartItem[] {
    if (!this.carts.has(userId)) this.carts.set(userId, []);
    return this.carts.get(userId)!;
  }

  // Builds the response the cart modal needs: rows + totals.
  // Prices are looked up here, so the client can't fake them.
  getCart(userId: string) {
    const lines = this.items(userId).map(item => {
      const p = this.products.findOne(item.productId);
      return {
        productId: p.id, name: p.name, icon: p.icon, price: p.price,
        quantity: item.quantity, subtotal: p.price * item.quantity,
      };
    });
    return {
      items: lines,
      totalItems: lines.reduce((s, l) => s + l.quantity, 0), // navbar badge
      total: lines.reduce((s, l) => s + l.subtotal, 0),      // "Total: Rs. ..."
    };
  }

  addItem(userId: string, productId: number, quantity = 1) {
    this.products.findOne(productId); // throws 404 if product doesn't exist
    const items = this.items(userId);
    const existing = items.find(i => i.productId === productId);
    const newQty = (existing?.quantity ?? 0) + quantity;
    if (newQty > MAX_QTY) {
      throw new BadRequestException(`Maximum quantity is ${MAX_QTY} per product`);
    }
    if (existing) existing.quantity = newQty;
    else items.push({ productId, quantity });
    return this.getCart(userId);
  }

  updateQuantity(userId: string, productId: number, quantity: number) {
    const item = this.items(userId).find(i => i.productId === productId);
    if (!item) throw new NotFoundException('Item is not in your cart');
    item.quantity = quantity;
    return this.getCart(userId);
  }

  removeItem(userId: string, productId: number) {
    this.carts.set(userId, this.items(userId).filter(i => i.productId !== productId));
    return this.getCart(userId);
  }

  clear(userId: string) { this.carts.set(userId, []); }
}
