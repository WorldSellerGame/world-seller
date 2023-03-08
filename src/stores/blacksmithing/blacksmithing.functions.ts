import { StateContext } from '@ngxs/store';

import { cancelRefineJob, decreaseRefineTimer, startRefineJob } from '../../app/helpers';
import { AchievementStat, IGameRefining } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelBlacksmithingJob, StartBlacksmithingJob } from './blacksmithing.actions';

export const defaultBlacksmithing: () => IGameRefining = () => ({
  version: 0,
  unlocked: false,
  level: 0,
  queueSize: 1,
  recipeQueue: []
});

export function unlockBlacksmithing(ctx: StateContext<IGameRefining>) {
  ctx.patchState({ unlocked: true });
}

export function resetBlacksmithing(ctx: StateContext<IGameRefining>) {
  ctx.setState(defaultBlacksmithing());
}

export function decreaseDuration(ctx: StateContext<IGameRefining>, { ticks }: TickTimer) {
  decreaseRefineTimer(ctx, ticks, CancelBlacksmithingJob, AchievementStat.RefineBlacksmithing);
}

export function cancelBlacksmithingJob(ctx: StateContext<IGameRefining>, { jobIndex, shouldRefundResources }: CancelBlacksmithingJob) {
  cancelRefineJob(ctx, jobIndex, shouldRefundResources);
}

export function startBlacksmithingJob(ctx: StateContext<IGameRefining>, { job, quantity }: StartBlacksmithingJob) {
  startRefineJob(ctx, job, quantity);
};
