import { StateContext } from '@ngxs/store';

import { append, insertItem, patch, removeItem } from '@ngxs/store/operators';
import {
  AchievementStat, IGameWorkerFarming, IGameWorkers, IGameWorkersGathering,
  IGameWorkersMercantle, IGameWorkersRefining, Rarity
} from '../../interfaces';
import { IncrementStat } from '../achievements/achievements.actions';
import { spendCoins } from '../mercantile/mercantile.functions';
import { AssignGatheringWorker, AssignRefiningWorker, UnassignGatheringWorker, UnassignRefiningWorker } from './workers.actions';

export const defaultWorkers: () => IGameWorkers = () => ({
  version: 0,
  maxWorkers: 0,
  nextWorkerNameIds: [],
  gatheringWorkerAllocations: [],
  refiningWorkerAllocations: [],
  mercantileWorkerAllocations: [],
  farmingWorkerAllocations: [],
  upkeepPaid: true,
  upkeepTicks: 3600
});

export function resetWorkers(ctx: StateContext<IGameWorkers>) {
  ctx.setState(defaultWorkers());
}

export function workerTimerMultiplier(workerMultiplierLevel = 1) {
  return 0.95 * workerMultiplierLevel;
}

export function upkeepCost(numWorkers: number) {
  if(numWorkers <= 3) {
    return 0;
  }

  return Math.floor(100 * Math.pow(numWorkers - 3, 1.3));
}

export function upkeepTicks() {
  return 3600;
}

export function totalAllocatedWorkers(state: IGameWorkers): number {
  return state.gatheringWorkerAllocations.length
       + state.refiningWorkerAllocations.length
       + state.mercantileWorkerAllocations.length
       + state.farmingWorkerAllocations.length;
}

export function canAssignWorker(state: IGameWorkers) {
  return totalAllocatedWorkers(state) < state.maxWorkers;
}

export function nextWorkerCost(currentWorkers: number): number {
  return Math.floor(100 * Math.pow(currentWorkers + 1, 1.9));
}

export function nextWorkerNameId(state: IGameWorkers): number {
  if(state.nextWorkerNameIds.length > 0) {
    return state.nextWorkerNameIds[0];
  }

  return totalAllocatedWorkers(state);
}

export function maxMercantileWorkers() {
  return 5;
}

export function mercantileWorkerTime(rarity: Rarity, value: number, timeMultiplier = 0) {

  const rarityMultiplier: Record<Rarity, number> = {
    [Rarity.Broken]: 1,
    [Rarity.Junk]: 1,
    [Rarity.Common]: 1,
    [Rarity.Uncommon]: 1.1,
    [Rarity.Rare]: 1.3,
    [Rarity.Epic]: 1.5,
    [Rarity.Legendary]: 2
  };

  const multiplier = rarityMultiplier[rarity];
  const reducedValue = Math.max(5, Math.floor(value * 0.15 * multiplier * (1 - timeMultiplier)));

  return reducedValue;
}

export function buyWorker(ctx: StateContext<IGameWorkers>) {
  const curWorkers = ctx.getState().maxWorkers;

  spendCoins(ctx, { amount: nextWorkerCost(curWorkers), reason: 'Upgrade:BuyWorker' });

  ctx.dispatch(new IncrementStat(AchievementStat.MercantileBuyWorkers));

  ctx.setState(patch<IGameWorkers>({
    maxWorkers: curWorkers + 1,
    nextWorkerNameIds: append<number>([curWorkers + 1])
  }));
}

export function assignGatheringWorker(ctx: StateContext<IGameWorkers>, { tradeskill, location }: AssignGatheringWorker) {

  const state = ctx.getState();

  if(!canAssignWorker(state)) {
    return;
  }

  const newWorker: IGameWorkersGathering = {
    nameId: nextWorkerNameId(state),
    tradeskill,
    location,
    currentTick: 0
  };

  ctx.setState(patch<IGameWorkers>({
    nextWorkerNameIds: removeItem<number>(0),
    gatheringWorkerAllocations: append<IGameWorkersGathering>([newWorker])
  }));
}

export function unassignGatheringWorker(ctx: StateContext<IGameWorkers>, { tradeskill, location }: UnassignGatheringWorker) {
  const workers = ctx.getState().gatheringWorkerAllocations;
  const mostRecentWorker = workers.reverse().find((worker) => worker.tradeskill === tradeskill && worker.location.name === location.name);

  if(!mostRecentWorker) {
    return;
  }

  const mostRecentIndex = workers.indexOf(mostRecentWorker);

  ctx.setState(patch<IGameWorkers>({
    nextWorkerNameIds: insertItem<number>(mostRecentWorker.nameId, 0),
    gatheringWorkerAllocations: removeItem<IGameWorkersGathering>(mostRecentIndex)
  }));
}

export function assignRefiningWorker(ctx: StateContext<IGameWorkers>, { tradeskill, recipe }: AssignRefiningWorker) {

  const state = ctx.getState();

  if(!canAssignWorker(state)) {
    return;
  }

  const newWorker: IGameWorkersRefining = {
    nameId: nextWorkerNameId(state),
    tradeskill,
    recipe,
    currentTick: 0
  };

  ctx.setState(patch<IGameWorkers>({
    nextWorkerNameIds: removeItem<number>(0),
    refiningWorkerAllocations: append<IGameWorkersRefining>([newWorker])
  }));
}

export function unassignRefiningWorker(ctx: StateContext<IGameWorkers>, { tradeskill, recipe }: UnassignRefiningWorker) {
  const workers = ctx.getState().refiningWorkerAllocations;
  const mostRecentWorker = workers.reverse().find((worker) => worker.tradeskill === tradeskill && worker.recipe.result === recipe.result);

  if(!mostRecentWorker) {
    return;
  }

  const mostRecentIndex = workers.indexOf(mostRecentWorker);

  ctx.setState(patch<IGameWorkers>({
    nextWorkerNameIds: insertItem<number>(mostRecentWorker.nameId, 0),
    refiningWorkerAllocations: removeItem<IGameWorkersRefining>(mostRecentIndex)
  }));
}

export function assignMercantileWorker(ctx: StateContext<IGameWorkers>) {

  if(!canAssignWorker(ctx.getState())) {
    return;
  }

  const newWorker: IGameWorkersMercantle = {
    nameId: nextWorkerNameId(ctx.getState()),
    currentTick: 0,
    backToWorkTicks: 0
  };

  ctx.setState(patch<IGameWorkers>({
    nextWorkerNameIds: removeItem<number>(0),
    mercantileWorkerAllocations: append<IGameWorkersMercantle>([newWorker])
  }));
}

export function unassignMercantileWorker(ctx: StateContext<IGameWorkers>) {
  const workers = ctx.getState().mercantileWorkerAllocations;
  const mostRecentWorker = workers.reverse()[0];

  if(!mostRecentWorker) {
    return;
  }

  const mostRecentIndex = workers.indexOf(mostRecentWorker);

  ctx.setState(patch<IGameWorkers>({
    nextWorkerNameIds: insertItem<number>(mostRecentWorker.nameId, 0),
    mercantileWorkerAllocations: removeItem<IGameWorkersMercantle>(mostRecentIndex)
  }));
}

export function assignFarmingWorker(ctx: StateContext<IGameWorkers>) {

  if(!canAssignWorker(ctx.getState())) {
    return;
  }

  const newWorker: IGameWorkerFarming = {
    nameId: nextWorkerNameId(ctx.getState()),
    currentTick: -1
  };

  ctx.setState(patch<IGameWorkers>({
    nextWorkerNameIds: removeItem<number>(0),
    farmingWorkerAllocations: append<IGameWorkerFarming>([newWorker])
  }));
}

export function unassignFarmingWorker(ctx: StateContext<IGameWorkers>) {
  const workers = ctx.getState().farmingWorkerAllocations;
  const mostRecentWorker = workers.reverse()[0];

  if(!mostRecentWorker) {
    return;
  }

  const mostRecentIndex = workers.indexOf(mostRecentWorker);

  ctx.setState(patch<IGameWorkers>({
    nextWorkerNameIds: insertItem<number>(mostRecentWorker.nameId, 0),
    farmingWorkerAllocations: removeItem<IGameWorkerFarming>(mostRecentIndex)
  }));
}
