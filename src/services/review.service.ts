import { number } from 'joi'
import { ReviewDTO } from '../dto/review.dto'
import { Console } from '../models/console.model'
import { Game } from '../models/game.model'
import { Review } from '../models/review.model'

export class ReviewService {
  public async getAllReviews (): Promise<Review[]> {
    return await Review.findAll(
      {
        include: [
          {
            model: Game,
            as: 'game',
            include: [
              {
                model: Console,
                as: 'console'
              }
            ]
          }
        ]
      }
    )
  }
  public async getReviewById (id: number): Promise<ReviewDTO | null> {
    return Review.findByPk(id, {
      include: [
        {
          model: Game,
          as: 'game',
          include: [
            {
              model: Console,
              as: 'console'
            }
          ]
        }
      ]
    })
  }

  public async createReview (
    game_id: number,
    rating: number,
    review_text: string
  ): Promise<Review> {
    return Review.create({ game_id, rating: rating, review_text })
  }

  public async updateReview (
    id: number,
    game_id?: number | null,
    rating?: number,
    review_text?: string
  ): Promise<Review | null> {
    const review = await Review.findByPk(id)
    if (review) {
      if (review_text) review.review_text = review_text
      if (game_id) review.game_id = game_id
      if (rating) review.rating = rating
      await review.save()
      return review
    }
    return null
  }
}

export const reviewService = new ReviewService()
