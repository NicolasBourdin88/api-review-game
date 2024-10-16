import { Body, Controller, Get, Route, Tags, Path, Post,Patch, Delete } from 'tsoa'
import { GameDTO } from '../dto/game.dto'
import { gameService } from '../services/game.service'
import { consoleService } from "../services/console.service";
import { notFound } from '../error/NotFoundError';
import { Game } from '../models/game.model';
import { Review } from '../models/review.model';
import { Op } from 'sequelize';
import { ReviewDTO } from '../dto/review.dto';
import { reviewService } from '../services/review.service';

@Route('games')
@Tags('Games')
export class GameController extends Controller {
  @Get('/')
  public async getAllGames (): Promise<GameDTO[]> {
    return gameService.getAllGames()
  }

  @Get('{id}')
  public async getGameById (@Path() id: number): Promise<GameDTO | null> {
    return gameService.getGameById(id)
  }

  @Post('/')
  public async createGame (@Body() requestBody: GameDTO): Promise<GameDTO> {
    const { title, console } = requestBody
    
    if (console?.id === undefined) {
      throw new Error("Console not send");
    }
    const getConsole = await consoleService.getConsoleById(console!.id!);

    if (!getConsole){
      throw notFound("Console with id " + console?.id);
    }else {
      return gameService.createGame(title, console.id)
    }
  }

  @Delete("{id}")
  public async deleteGame(id: number): Promise<void> {
    const game = await Game.findByPk(id);
  
    if(!game) notFound("Game with id :" + id);
    
    const reviews = await Review.findAll({
      where: {
        game_id: id
      }
    });

    if(reviews.length > 0) {
      const error = new Error("Can't delete, review corresponding to this game found");
      (error as any).status = 404;
      throw error;
    }
    game.destroy();
  }

  @Get("{id}/reviews")
  public async getConsoleGames(@Path() id: number): Promise<ReviewDTO[] | null> {
    const game = await gameService.getGameById(id);
    if (!game) {
      notFound("Game with id : " + id);
    }

    const allReviews: ReviewDTO[] = await reviewService.getAllReviews();
    const filteredReviews = allReviews.filter(review => review.game?.id === id);
    return filteredReviews;
  }

    @Patch("{id}")
    public async updateGame(
      @Path() id: number,
      @Body() requestBody: GameDTO
    ): Promise<GameDTO | null> {
      const game = await gameService.getGameById(id);
      if(!game) notFound(id.toString());
      
      const { title, console } = requestBody;
      const console2 = await consoleService.getConsoleById(console?.id!);

      return gameService.updateGame(id, title, console2);
    }
}
