import { Rarity } from './game';
import { IGameGatherLocation } from './gathering';
import { IGameRecipe } from './refining';

export interface IGameWorkersGathering {
  nameId: number;
  currentTick: number;
  tradeskill: string;
  location: IGameGatherLocation;
}

export interface IGameWorkersRefining {
  nameId: number;
  currentTick: number;
  tradeskill: string;
  recipe: IGameRecipe;
}

export interface IGameWorkersMercantle {
  nameId: number;
  currentTick: number;
  backToWorkTicks: number;
  lastSoldItemRarity?: Rarity;
  lastSoldItemValue?: number;
}

export interface IGameWorkers {
  version: number;
  maxWorkers: number;
  nextWorkerNameIds: number[];
  gatheringWorkerAllocations: IGameWorkersGathering[];
  refiningWorkerAllocations: IGameWorkersRefining[];
  mercantileWorkerAllocations: IGameWorkersMercantle[];
  upkeepTicks: number;
  upkeepPaid: boolean;
}
