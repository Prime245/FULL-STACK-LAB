import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  // GET /api/products            -> all products
  // GET /api/products?search=mo  -> filtered by name
  @Get()
  findAll(@Query('search') search?: string) { return this.products.findAll(search); }

  // GET /api/products/3
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.products.findOne(id); }
}
