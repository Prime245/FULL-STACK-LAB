import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateReviewDto } from './reviews.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../common/current-user.decorator';

interface Review { id: string; author: string; rating: number; comment: string }

@Controller('reviews')
export class ReviewsController {
  // Seeded with the 3 reviews from your HTML page
  private reviews: Review[] = [
    { id: randomUUID(), author: 'Ali Khan',    rating: 5, comment: 'The headphones are comfortable and sound excellent.' },
    { id: randomUUID(), author: 'Sara Ahmed',  rating: 5, comment: 'A simple shopping experience. Loved the backpack!' },
    { id: randomUUID(), author: 'Hamza Malik', rating: 4, comment: 'The watch looks great and is easy to use.' },
  ];

  // GET /api/reviews  (public)
  @Get()
  findAll() { return this.reviews; }

  // POST /api/reviews  (login required; author = logged-in user's name)
  @Post() @UseGuards(JwtAuthGuard)
  create(@CurrentUser() u: AuthUser, @Body() dto: CreateReviewDto) {
    const review = { id: randomUUID(), author: u.name, ...dto };
    this.reviews.push(review);
    return review;
  }
}
