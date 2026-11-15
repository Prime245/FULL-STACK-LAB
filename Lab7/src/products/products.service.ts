import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Product } from '../entities';

// Same catalog as the frontend. Inserted ONCE when the table is empty.
const SEED: Product[] = [
  { id: 1, name: 'Wireless Headphones', price: 4500, icon: '🎧', description: 'Comfortable headphones for music and calls.' },
  { id: 2, name: 'Smart Watch',         price: 6500, icon: '⌚', description: 'Track your daily activity in style.' },
  { id: 3, name: 'Everyday Backpack',   price: 2800, icon: '🎒', description: 'A spacious backpack for work and university.' },
  { id: 4, name: 'Running Shoes',       price: 5200, icon: '👟', description: 'Lightweight shoes for everyday comfort.' },
  { id: 5, name: 'Travel Mug',          price: 1500, icon: '☕', description: 'Keep your favorite drink close on busy days.' },
  { id: 6, name: 'Wireless Mouse',      price: 2200, icon: '🖱️', description: 'Smooth navigation for study and work.' },
];

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(@InjectRepository(Product) private readonly repo: Repository<Product>) {}

  // Runs at startup: fill the table the first time only.
  async onModuleInit() {
    if ((await this.repo.count()) === 0) await this.repo.save(SEED);
  }

  // Case-insensitive "contains", same as the frontend search box
  findAll(search?: string) {
    const q = (search ?? '').trim();
    return this.repo.find({
      where: q ? { name: ILike(`%${q}%`) } : {},
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const product = await this.repo.findOneBy({ id });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }
}
