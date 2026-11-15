import { Injectable, NotFoundException } from '@nestjs/common';

export interface Product {
  id: number; name: string; price: number; icon: string; description: string;
}

@Injectable()
export class ProductsService {
  // Same catalog as the frontend. Prices are in Rs.
  // The SERVER is the source of truth for prices (never trust the browser).
  private readonly products: Product[] = [
    { id: 1, name: 'Wireless Headphones', price: 4500, icon: '🎧', description: 'Comfortable headphones for music and calls.' },
    { id: 2, name: 'Smart Watch',         price: 6500, icon: '⌚', description: 'Track your daily activity in style.' },
    { id: 3, name: 'Everyday Backpack',   price: 2800, icon: '🎒', description: 'A spacious backpack for work and university.' },
    { id: 4, name: 'Running Shoes',       price: 5200, icon: '👟', description: 'Lightweight shoes for everyday comfort.' },
    { id: 5, name: 'Travel Mug',          price: 1500, icon: '☕', description: 'Keep your favorite drink close on busy days.' },
    { id: 6, name: 'Wireless Mouse',      price: 2200, icon: '🖱️', description: 'Smooth navigation for study and work.' },
  ];

  // Same logic as the frontend search box: case-insensitive "contains"
  findAll(search?: string): Product[] {
    const q = (search ?? '').trim().toLowerCase();
    return q ? this.products.filter(p => p.name.toLowerCase().includes(q)) : this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find(p => p.id === id);
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }
}
