import { Rarity, Tradeskill } from './game';
import { IGameGatherLocation } from './gathering';
import { IGameRecipe } from './refining';

export interface IGameWorkersGathering {
  nameId: number;
  currentTick: number;
  tradeskill: Tradeskill;
  location: IGameGatherLocation;
}

export interface IGameWorkersRefining {
  nameId: number;
  currentTick: number;
  tradeskill: Tradeskill;
  recipe: IGameRecipe;
  missingIngredients?: string[];
}

export interface IGameWorkersMercantle {
  nameId: number;
  currentTick: number;
  backToWorkTicks: number;
  lastSoldItemRarity?: Rarity;
  lastSoldItemValue?: number;
}

export interface IGameWorkerFarming {
  nameId: number;
  currentTick: number;
}

export interface IGameWorkers {
  version: number;
  maxWorkers: number;
  nextWorkerNameIds: number[];
  gatheringWorkerAllocations: IGameWorkersGathering[];
  refiningWorkerAllocations: IGameWorkersRefining[];
  mercantileWorkerAllocations: IGameWorkersMercantle[];
  farmingWorkerAllocations: IGameWorkerFarming[];
  upkeepTicks: number;
  upkeepPaid: boolean;
}
