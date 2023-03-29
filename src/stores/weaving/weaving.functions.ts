import { StateContext } from '@ngxs/store';

import { patch } from '@ngxs/store/operators';
import { cancelRefineJob, decreaseRefineTimer, startRefineJob } from '../../app/helpers';
import { AchievementStat, IGameRefining } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelWeavingJob, ChangeWeavingFilterOption, GainWeavingLevels, StarWeavingRecipe, StartWeavingJob } from './weaving.actions';

export const defaultWeaving: () => IGameRefining = () => ({
  version: 0,
  unlocked: false,
  level: 0,
  queueSize: 1,
  recipeQueue: [],
  starred: {},
  hideDiscovered: false,
  hideDiscoveredTables: false,
  hideHasIngredients: false,
  hideHasNoIngredients: false
});

export function unlockWeaving(ctx: StateContext<IGameRefining>) {
  ctx.patchState({ unlocked: true });
}

export function gainWeavingLevels(ctx: StateContext<IGameRefining>, { levels }: GainWeavingLevels) {
  ctx.patchState({ level: Math.max(0, ctx.getState().level + levels) });
}

export function resetWeaving(ctx: StateContext<IGameRefining>) {
  ctx.setState(defaultWeaving());
}

export function decreaseDuration(ctx: StateContext<IGameRefining>, { ticks }: TickTimer) {
  decreaseRefineTimer(ctx, ticks, CancelWeavingJob, AchievementStat.RefineWeaving);
}

export function cancelWeavingJob(ctx: StateContext<IGameRefining>, { jobIndex, shouldRefundResources }: CancelWeavingJob) {
  cancelRefineJob(ctx, jobIndex, shouldRefundResources);
}

export function startWeavingJob(ctx: StateContext<IGameRefining>, { job, quantity, items }: StartWeavingJob) {
  startRefineJob(ctx, job, quantity, items);
};

export function changeWeavingOption(ctx: StateContext<IGameRefining>, { option, value }: ChangeWeavingFilterOption) {
  ctx.setState(patch<IGameRefining>({ [option]: value }));
}

export function starWeavingRecipe(ctx: StateContext<IGameRefining>, { recipe }: StarWeavingRecipe) {
  const starred = ctx.getState().starred || {};
  starred[recipe.result] = !starred[recipe.result];
  ctx.patchState({ starred });
}

export function upgradeWeavingQueue(ctx: StateContext<IGameRefining>) {
  ctx.patchState({ queueSize: ctx.getState().queueSize + 1 });
}
