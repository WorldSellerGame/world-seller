import { StateContext } from '@ngxs/store';

import { patch, updateItem } from '@ngxs/store/operators';
import { random } from 'lodash';
import { pickNameWithWeights } from '../../app/helpers';
import { AchievementStat, IGameFarming, IGameFarmingPlot, TransformTradeskill } from '../../interfaces';
import { IncrementStat } from '../achievements/achievements.actions';
import { GainItemOrResource, GainResources } from '../charselect/charselect.actions';
import { NotifyTradeskill, PlaySFX, TickTimer } from '../game/game.actions';
import { SpendCoins } from '../mercantile/mercantile.actions';
import { GainFarmingLevels, HarvestPlantFromFarm, PlantSeedInFarm } from './farming.actions';

export const defaultFarming: () => IGameFarming = () => ({
  version: 0,
  unlocked: false,
  level: 0,
  maxPlots: 2,
  plots: [],
  workerUpgradeLevel: 0
});

export function maxPlots() {
  return 8;
}

export function nextPlotCost(currentPlots: number) {
  return currentPlots * 1000;
}

export function maxFarmingWorkers() {
  return 5;
}

// worker speed functions
export function maxWorkerSpeedLevel() {
  return 5;
}

export function workerSpeedUpgradeCost(currentLevel = 0): number {
  return 1000 * (currentLevel + 1);
}

export function workerSpeed() {
  return 3600;
}

export function workerSpeedReduction(currentLevel = 0): number {
  return currentLevel * 0.1;
}

export function unlockFarming(ctx: StateContext<IGameFarming>) {
  ctx.patchState({ unlocked: true });
}

export function gainFarmingLevels(ctx: StateContext<IGameFarming>, { levels }: GainFarmingLevels) {
  ctx.patchState({ level: Math.max(0, ctx.getState().level + levels) });
}

export function resetFarming(ctx: StateContext<IGameFarming>) {
  ctx.setState(defaultFarming());
}

export function decreaseDuration(ctx: StateContext<IGameFarming>, { ticks }: TickTimer) {
  const state = ctx.getState();

  const plots = state.plots
    .map(plot => (plot ? { ...plot, currentDuration: Math.max(0, Math.floor(plot.currentDuration - ticks)) } : null)) as IGameFarmingPlot[];

  ctx.setState(patch<IGameFarming>({
    plots
  }));
}

export function plantSeedInFarm(ctx: StateContext<IGameFarming>, { plotIndex, job, playSfx }: PlantSeedInFarm) {
  ctx.setState(patch<IGameFarming>({
    plots: updateItem<IGameFarmingPlot>(plotIndex, {
      result: job,
      currentDuration: job.gatherTime,
      currentDurationInitial: job.gatherTime
    })
  }));

  ctx.dispatch([
    playSfx ? new PlaySFX('tradeskill-start-farming') : undefined,
    new GainResources({ [job.startingItem]: -1 })
  ].filter(Boolean));
};

export function harvestPlot(ctx: StateContext<IGameFarming>, { plotIndex, playSfx }: HarvestPlantFromFarm) {
  const state = ctx.getState();

  const plot = state.plots[plotIndex];
  if(!plot) {
    return;
  }

  const { result } = plot;

  ctx.setState(patch<IGameFarming>({
    plots: updateItem<IGameFarmingPlot>(plotIndex, null as unknown as IGameFarmingPlot)
  }));

  const choice = pickNameWithWeights(result.becomes);
  const gainedAmt = random(result.perGather.min, result.perGather.max);

  ctx.dispatch([
    playSfx ? new PlaySFX('tradeskill-finish-farming') : undefined,
    new NotifyTradeskill(TransformTradeskill.Farming, `+${gainedAmt}x ${choice}`),
    new GainItemOrResource(choice, gainedAmt, false),
    new IncrementStat(AchievementStat.FarmingHarvest)
  ].filter(Boolean));

  if(result.level.max > state.level) {
    ctx.setState(patch<IGameFarming>({
      level: state.level + 1
    }));
  }
}

export function addPlot(ctx: StateContext<IGameFarming>) {
  const state = ctx.getState();

  ctx.dispatch(new SpendCoins(nextPlotCost(state.maxPlots - 1), 'Upgrade:FarmPlot'));

  ctx.setState(patch<IGameFarming>({
    maxPlots: Math.min(maxPlots(), state.maxPlots + 1)
  }));
}

export function upgradeWorkerSpeed(ctx: StateContext<IGameFarming>) {
  const state = ctx.getState();

  const currentLevel = state.workerUpgradeLevel ?? 0;

  if(currentLevel >= maxWorkerSpeedLevel()) {
    return;
  }

  const cost = workerSpeedUpgradeCost(currentLevel);
  ctx.dispatch(new SpendCoins(cost, 'Upgrade:FarmWorkerSpeed'));

  ctx.setState(patch<IGameFarming>({
    workerUpgradeLevel: currentLevel + 1
  }));
}
