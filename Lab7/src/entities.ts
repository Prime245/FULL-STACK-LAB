import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany,
  PrimaryColumn, PrimaryGeneratedColumn, Unique,
} from 'typeorm';

// Each class = one table in the SQLite file (data/shopnest.sqlite).

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ unique: true }) email: string;
  @Column() passwordHash: string;
  @CreateDateColumn() createdAt: Date;
}

@Entity('products')
export class Product {
  @PrimaryColumn() id: number;          // fixed ids (1..6) like your frontend
  @Column() name: string;
  @Column('int') price: number;         // Rs.
  @Column() icon: string;
  @Column() description: string;
}

// One row per (user, product). Unique constraint prevents duplicate rows.
@Entity('cart_items')
@Unique(['userId', 'productId'])
export class CartItem {
  @PrimaryGeneratedColumn() id: number;
  @Column() userId: string;
  @Column() productId: number;
  @Column('int') quantity: number;
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;
}

@Entity('orders')
export class Order {
  @PrimaryColumn() id: string;          // e.g. SN-12345678
  @Column() userId: string;
  @Column('int') total: number;
  @Column() name: string;
  @Column() email: string;
  @Column() phone: string;
  @Column() address: string;
  @Column() paymentMethod: string;
  @Column({ default: 'confirmed' }) status: string;
  @CreateDateColumn() createdAt: Date;
  @OneToMany(() => OrderItem, i => i.order, { cascade: true, eager: true })
  items: OrderItem[];
}

// Snapshot of what was bought (name/price copied) so old orders never change.
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn() id: number;
  @Column() productId: number;
  @Column() name: string;
  @Column() icon: string;
  @Column('int') price: number;
  @Column('int') quantity: number;
  @Column('int') subtotal: number;
  @ManyToOne(() => Order, o => o.items, { onDelete: 'CASCADE' })
  order: Order;
}

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() author: string;
  @Column('int') rating: number;
  @Column() comment: string;
  @CreateDateColumn() createdAt: Date;
}
