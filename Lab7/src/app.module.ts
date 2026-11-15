import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';

// The database is a single file. Override with DB_PATH=/some/where.sqlite
const DB_PATH = process.env.DB_PATH ?? join(process.cwd(), 'data', 'shopnest.sqlite');
mkdirSync(dirname(DB_PATH), { recursive: true }); // SQLite won't create the folder

@Module({
  imports: [
    // Serves public/index.html (your original page) at http://localhost:3000/
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)'],
    }),

    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: DB_PATH,
      autoLoadEntities: true, // picks up every TypeOrmModule.forFeature([...])
      synchronize: true,      // auto-creates/updates tables. Fine for a lab; use migrations in production.
    }),

    AuthModule, ProductsModule, CartModule, OrdersModule, ReviewsModule,
  ],
})
export class AppModule {}
