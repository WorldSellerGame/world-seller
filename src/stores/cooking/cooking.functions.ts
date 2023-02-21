import { StateContext } from '@ngxs/store';

import { cancelRefineJob, decreaseRefineTimer, startRefineJob } from '../../app/helpers';
import { AchievementStat, IGameRefining } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelCookingJob, StartCookingJob } from './cooking.actions';

export const defaultCooking: () => IGameRefining = () => ({
  version: 0,
  unlocked: false,
  level: 0,
  queueSize: 1,
  recipeQueue: []
});

export function unlockCooking(ctx: StateContext<IGameRefining>) {
  ctx.patchState({ unlocked: true });
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
