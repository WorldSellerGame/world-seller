import { StateContext } from '@ngxs/store';

import { patch, removeItem, updateItem } from '@ngxs/store/operators';
import { random } from 'lodash';
import { pickNameWithWeights } from '../../app/helpers';
import { AchievementStat, IGameFarming, IGameFarmingPlot } from '../../interfaces';
import { IncrementStat } from '../achievements/achievements.actions';
import { GainItemOrResource, GainResources } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { GainFarmingLevels, HarvestPlantFromFarm, PlantSeedInFarm } from './farming.actions';

export const defaultFarming: () => IGameFarming = () => ({
  version: 0,
  unlocked: false,
  level: 0,
  maxPlots: 2,
  plots: []
});

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

  const plots = state.plots.map(plot => ({ ...plot, currentDuration: Math.max(0, Math.floor(plot.currentDuration - ticks)) }));

  ctx.setState(patch<IGameFarming>({
    plots
  }));
}

export function plantSeedInFarm(ctx: StateContext<IGameFarming>, { plotIndex, job }: PlantSeedInFarm) {
  ctx.setState(patch<IGameFarming>({
    plots: updateItem<IGameFarmingPlot>(plotIndex, {
      result: job,
      currentDuration: job.gatherTime,
      currentDurationInitial: job.gatherTime
    })
  }));

  ctx.dispatch(new GainResources({ [job.startingItem]: -1 }));
};

export function harvestPlot(ctx: StateContext<IGameFarming>, { plotIndex }: HarvestPlantFromFarm) {
  const state = ctx.getState();

  const plot = state.plots[plotIndex];
  if(!plot) {
    return;
  }

  const { result } = plot;

  ctx.setState(patch<IGameFarming>({
    plots: removeItem<IGameFarmingPlot>(plotIndex)
  }));

  const choice = pickNameWithWeights(result.becomes);
  ctx.dispatch([
    new GainItemOrResource(choice, random(result.perGather.min, result.perGather.max)),
    new IncrementStat(AchievementStat.FarmingHarvest)
  ]);

  if(result.level.max > state.level) {
    ctx.setState(patch<IGameFarming>({
      level: state.level + 1
    }));
  }
}
