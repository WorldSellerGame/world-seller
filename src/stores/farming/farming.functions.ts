import { StateContext } from '@ngxs/store';

import { patch, removeItem, updateItem } from '@ngxs/store/operators';
import { random } from 'lodash';
import { IGameFarming, IGameFarmingPlot } from '../../interfaces';
import { GainJobResult } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { HarvestPlantFromFarm, PlantSeedInFarm } from './farming.actions';

export const defaultFarming: () => IGameFarming = () => ({
  version: 0,
  level: 0,
  maxPlots: 2,
  plots: []
});

export function resetFarming(ctx: StateContext<IGameFarming>) {
  ctx.setState(defaultFarming());
}

export function decreaseDuration(ctx: StateContext<IGameFarming>, { ticks }: TickTimer) {
  const state = ctx.getState();

  const plots = state.plots.map(plot => ({ ...plot, currentDuration: Math.max(0, plot.currentDuration - ticks) }));

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

  ctx.dispatch(new GainJobResult(result.becomes, random(result.perGather.min, result.perGather.max)));
}
