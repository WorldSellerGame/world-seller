import { IGameResourceTransform } from './game';

export interface IGameFarmingPlot {
  result: IGameResourceTransform;
  currentDuration: number;
  currentDurationInitial: number;
}

export interface IGameFarming {
  version: number;
  level: number;
  plots: IGameFarmingPlot[];
  maxPlots: number;
}
