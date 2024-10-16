import { Controller, Get, Post, Delete, Route, Path, Body, Tags, Patch } from "tsoa";
import { consoleService } from "../services/console.service";
import { ConsoleDTO } from "../dto/console.dto";
import { notFound } from "../error/NotFoundError";
import { Console } from "../models/console.model";
import { Game } from "../models/game.model";
import { Review } from "../models/review.model";
import { Op } from "sequelize";
import { GameDTO } from "../dto/game.dto";
import { gameService } from "../services/game.service";

@Route("consoles")
@Tags("Consoles")
export class ConsoleController extends Controller {
  // Récupère toutes les consoles
  @Get("/")
  public async getAllConsole(): Promise<ConsoleDTO[]> {
    return consoleService.getAllConsoles();
  }

  // Récupère une console par ID
  @Get("{id}")
  public async getConsoleById(@Path() id: number): Promise<ConsoleDTO | null> {
    const console = await consoleService.getConsoleById(id);
    if(!console) { 
        notFound(id.toString());
    } else {
        return console;
    }
  }

  // Crée une nouvelle console
  @Post("/")
  public async createConsole(
    @Body() requestBody: ConsoleDTO
  ): Promise<ConsoleDTO> {
    const { name, manufacturer } = requestBody;
    return consoleService.createConsole(name, manufacturer);
  }

  // Supprime une console par ID
  @Delete("{id}")
  public async deleteConsole(id: number): Promise<void> {
    const console = await Console.findByPk(id);
    const games = await Game.findAll({
      where : {console_id : id}
    });
    const gameIds = games.map(game => game.id);

    const reviews = await Review.findAll({
      where: {
        game_id: {
          [Op.in]: gameIds
        }
      }
    });

    if(!console){
      notFound("Console with id : "+id);
    }

    if(reviews.length > 0){
      const error = new Error("Delete review corresponding to console");
      (error as any).status = 404;
      throw error;
    }

    games.forEach(game => {
        game.destroy();
    });
  
    console.destroy();
  }

  @Get("{id}/games")
  public async getConsoleGames(@Path() id: number): Promise<GameDTO[] | null> {
    const console = await consoleService.getConsoleById(id);
    if (!console) {
      notFound("Console with id : " + id);
    }

    const allGames: GameDTO[] = await gameService.getAllGames();
    const filteredGames = allGames.filter(game => game.console?.id === id);
    return filteredGames;
  }

  // Met à jour une console par ID
  @Patch("{id}")
  public async updateConsole(
    @Path() id: number,
    @Body() requestBody: ConsoleDTO
  ): Promise<ConsoleDTO | null> {
    const console = await consoleService.getConsoleById(id);
    if(!console) notFound(id.toString());
    
    const { name, manufacturer } = requestBody;
    return consoleService.updateConsole(id, name, manufacturer);
  }
}