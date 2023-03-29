import { StateContext } from '@ngxs/store';

import { patch } from '@ngxs/store/operators';
import { cancelRefineJob, decreaseRefineTimer, startRefineJob } from '../../app/helpers';
import { AchievementStat, IGameRefining } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelCookingJob, ChangeCookingFilterOption, GainCookingLevels, StarCookingRecipe, StartCookingJob } from './cooking.actions';

export const defaultCooking: () => IGameRefining = () => ({
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

export function unlockCooking(ctx: StateContext<IGameRefining>) {
  ctx.patchState({ unlocked: true });
}

export function gainCookingLevels(ctx: StateContext<IGameRefining>, { levels }: GainCookingLevels) {
  ctx.patchState({ level: Math.max(0, ctx.getState().level + levels) });
}

export function resetCooking(ctx: StateContext<IGameRefining>) {
  ctx.setState(defaultCooking());
}

export function decreaseDuration(ctx: StateContext<IGameRefining>, { ticks }: TickTimer) {
  decreaseRefineTimer(ctx, ticks, CancelCookingJob, AchievementStat.RefineCooking);
}

export function cancelCookingJob(ctx: StateContext<IGameRefining>, { jobIndex, shouldRefundResources }: CancelCookingJob) {
  cancelRefineJob(ctx, jobIndex, shouldRefundResources);
}

export function startCookingJob(ctx: StateContext<IGameRefining>, { job, quantity, items }: StartCookingJob) {
  startRefineJob(ctx, job, quantity, items);
};

export function changeCookingOption(ctx: StateContext<IGameRefining>, { option, value }: ChangeCookingFilterOption) {
  ctx.setState(patch<IGameRefining>({ [option]: value }));
}

export function starCookingRecipe(ctx: StateContext<IGameRefining>, { recipe }: StarCookingRecipe) {
  const starred = ctx.getState().starred || {};
  starred[recipe.result] = !starred[recipe.result];
  ctx.patchState({ starred });
}
