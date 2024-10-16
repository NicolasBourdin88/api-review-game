import { Controller, Route, Tags, Get, Path, Post, Body, Patch, Delete } from 'tsoa'
import { ReviewDTO } from '../dto/review.dto'
import { reviewService } from '../services/review.service'
import { notFound } from '../error/NotFoundError'
import { gameService } from '../services/game.service'
import { Review } from '../models/review.model'

@Route('reviews')
@Tags('Reviews')
export class ReviewController extends Controller {
  @Get('/')
  public async getAllReview (): Promise<ReviewDTO[]> {
    return reviewService.getAllReviews()
  }

  @Get('{id}')
  public async getReviewById (@Path() id: number): Promise<ReviewDTO | null> {
    const review = await reviewService.getReviewById(id)
    if (!review) {
      notFound(id.toString())
    } else {
      return review
    }
  }

  @Post('/')
  public async createReview (
    @Body() requestBody: ReviewDTO
  ): Promise<ReviewDTO> {
    const { game, rating, review_text } = requestBody
    const game_id = game?.id
    if (!game_id) throw notFound("Game with id : " + game_id)
    return reviewService.createReview(game_id, rating, review_text)
  }

  @Patch('{id}')
  public async updateGame (
    @Path() id: number,
    @Body() requestBody: ReviewDTO
  ): Promise<ReviewDTO | null> {
    const review = await reviewService.getReviewById(id)
    if (!review) notFound(id.toString())

    const { game, rating, review_text } = requestBody

    return reviewService.updateReview(id, game?.id, rating, review_text)
  }

  @Delete("{id}")
  public async deleteReview(id: number): Promise<void> {
    const review = await Review.findByPk(id);
    if(!review) notFound("Review with id " + id);
    review.destroy;
  }
}
