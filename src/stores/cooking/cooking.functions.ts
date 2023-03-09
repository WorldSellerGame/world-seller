import { StateContext } from '@ngxs/store';

import { patch } from '@ngxs/store/operators';
import { cancelRefineJob, decreaseRefineTimer, startRefineJob } from '../../app/helpers';
import { AchievementStat, IGameRefining } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelCookingJob, ChangeCookingFilterOption, GainCookingLevels, StartCookingJob } from './cooking.actions';

export const defaultCooking: () => IGameRefining = () => ({
  version: 0,
  unlocked: false,
  level: 0,
  queueSize: 1,
  recipeQueue: [],
  hideDiscovered: false,
  hideNew: false,
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

export function startCookingJob(ctx: StateContext<IGameRefining>, { job, quantity }: StartCookingJob) {
  startRefineJob(ctx, job, quantity);
};

export function changeCookingOption(ctx: StateContext<IGameRefining>, { option, value }: ChangeCookingFilterOption) {
  ctx.setState(patch<IGameRefining>({ [option]: value }));
}
