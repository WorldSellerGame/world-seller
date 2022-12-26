
export interface IGameFarmingSeedTransform {
  seed: string;
  becomes: string;
  perGather: { min: number; max: number };
  level: { max: number };
  gatherTime: number;
}

export interface IGameFarmingPlot {
  result: IGameFarmingSeedTransform;
  currentDuration: number;
  currentDurationInitial: number;
}

export interface IGameFarming {
  version: number;
  level: number;
  plots: IGameFarmingPlot[];
  maxPlots: number;
}
