import { IGameRecipe } from './game';


export interface IGameRefiningRecipe {
  recipe: IGameRecipe;
  totalDurationInitial: number;
  totalLeft: number;
  durationPer: number;
  currentDuration: number;
}

export interface IGameRefining {
  version: number;
  level: number;
  recipeQueue: IGameRefiningRecipe[];
}
