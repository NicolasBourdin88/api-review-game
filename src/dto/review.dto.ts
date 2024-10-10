import { GameDTO } from "./game.dto";

export interface ReviewDTO {
    id?: number;
    game?: GameDTO;
    rating: number;
    review_text: string;
}