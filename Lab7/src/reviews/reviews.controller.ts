import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateReviewDto } from './reviews.dto';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../common/current-user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  // GET /api/reviews  (public)
  @Get()
  findAll() { return this.reviews.findAll(); }

  // POST /api/reviews  (login required; author = logged-in user's name)
  @Post() @UseGuards(JwtAuthGuard)
  create(@CurrentUser() u: AuthUser, @Body() dto: CreateReviewDto) {
    return this.reviews.create(u.name, dto);
  }
}
