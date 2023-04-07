import { IGameResourceTransform } from './game';

export interface IGameFarmingPlot {
  result: IGameResourceTransform;
  currentDuration: number;
  currentDurationInitial: number;
}

export interface IGameFarming {
  version: number;
  unlocked: boolean;
  level: number;
  plots: IGameFarmingPlot[];
  maxPlots: number;
  workerUpgradeLevel: number;
}
