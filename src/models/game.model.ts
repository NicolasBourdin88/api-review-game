import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database"; // Connection à la base de données
import { Console } from "./console.model";

export interface GameAttributes {
  id?: number;
  title: string;
  console_id: number;
  console?: Console;
}

export class Game extends Model<GameAttributes> implements GameAttributes {
  public id!: number;
  public title!: string;
  public console_id!: number;
  public console!: Console;
}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    console_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "games",
  }
);

Game.belongsTo(Console, {
  foreignKey: "console_id",
  as: "console",
  onDelete: "CASCADE", 
});