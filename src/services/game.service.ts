import { NullableType } from "joi";
import { GameDTO } from "../dto/game.dto";
import { Console } from "../models/console.model";
import { Game } from "../models/game.model";

export class GameService {
  public async getAllGames(): Promise<GameDTO[]> {
    return Game.findAll({
      include: [
        {
          model: Console,
          as: "console",
        },
      ],
    });
  }

    public async getGameById(id: number): Promise<GameDTO | null> {
      return Game.findByPk(id,{
        include: [
          {
            model: Console,
            as: "console",
          },
        ],
      });
    }

    public async createConsole(
      title: string,
      console_id: number,
    ): Promise<Game> {
      return Game.create({ title, console_id });
    }

    public async updateGame(
      id: number,
      title?: string,
      console?: Console | null
    ): Promise<Game | null> {
      const game = await Game.findByPk(id);
      if (game) {
        if (title) game.title = title;
        if (console) game.console = console;
        await game.save();
        return game;
      }
      return null;
    }
}

export const gameService = new GameService();
