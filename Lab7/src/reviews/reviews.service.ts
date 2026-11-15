import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities';
import { CreateReviewDto } from './reviews.dto';

@Injectable()
export class ReviewsService implements OnModuleInit {
  constructor(@InjectRepository(Review) private readonly repo: Repository<Review>) {}

  // Seed the 3 reviews from your HTML page, once
  async onModuleInit() {
    if ((await this.repo.count()) === 0) {
      await this.repo.save([
        { author: 'Ali Khan',    rating: 5, comment: 'The headphones are comfortable and sound excellent.' },
        { author: 'Sara Ahmed',  rating: 5, comment: 'A simple shopping experience. Loved the backpack!' },
        { author: 'Hamza Malik', rating: 4, comment: 'The watch looks great and is easy to use.' },
      ]);
    }
  }

  findAll() { return this.repo.find({ order: { createdAt: 'ASC' } }); }

  create(author: string, dto: CreateReviewDto) {
    return this.repo.save(this.repo.create({ author, ...dto }));
  }
}
