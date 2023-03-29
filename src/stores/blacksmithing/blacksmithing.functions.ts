import { StateContext } from '@ngxs/store';

import { patch } from '@ngxs/store/operators';
import { cancelRefineJob, decreaseRefineTimer, startRefineJob } from '../../app/helpers';
import { AchievementStat, IGameRefining } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import {
  CancelBlacksmithingJob, ChangeBlacksmithingFilterOption,
  GainBlacksmithingLevels, StarBlacksmithingRecipe, StartBlacksmithingJob
} from './blacksmithing.actions';

export const defaultBlacksmithing: () => IGameRefining = () => ({
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

export function unlockBlacksmithing(ctx: StateContext<IGameRefining>) {
  ctx.patchState({ unlocked: true });
}

export function gainBlacksmithingLevels(ctx: StateContext<IGameRefining>, { levels }: GainBlacksmithingLevels) {
  ctx.patchState({ level: Math.max(0, ctx.getState().level + levels) });
}

export function resetBlacksmithing(ctx: StateContext<IGameRefining>) {
  ctx.setState(defaultBlacksmithing());
}

export function decreaseDuration(ctx: StateContext<IGameRefining>, { ticks }: TickTimer) {
  decreaseRefineTimer(ctx, 'blacksmithing', ticks, CancelBlacksmithingJob, AchievementStat.RefineBlacksmithing);
}

export function cancelBlacksmithingJob(ctx: StateContext<IGameRefining>, { jobIndex, shouldRefundResources }: CancelBlacksmithingJob) {
  cancelRefineJob(ctx, jobIndex, shouldRefundResources);
}

export function startBlacksmithingJob(ctx: StateContext<IGameRefining>, { job, quantity, items }: StartBlacksmithingJob) {
  startRefineJob(ctx, job, quantity, 'blacksmithing', items);
};

export function changeBlacksmithingOption(ctx: StateContext<IGameRefining>, { option, value }: ChangeBlacksmithingFilterOption) {
  ctx.setState(patch<IGameRefining>({ [option]: value }));
}

export function starBlacksmithingRecipe(ctx: StateContext<IGameRefining>, { recipe }: StarBlacksmithingRecipe) {
  const starred = ctx.getState().starred || {};
  starred[recipe.result] = !starred[recipe.result];
  ctx.patchState({ starred });
}

export function upgradeBlacksmithingQueue(ctx: StateContext<IGameRefining>) {
  ctx.patchState({ queueSize: ctx.getState().queueSize + 1 });
}
