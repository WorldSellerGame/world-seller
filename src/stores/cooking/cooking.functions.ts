import { StateContext } from '@ngxs/store';

import { cancelRefineJob, decreaseRefineTimer, startRefineJob } from '../../app/helpers';
import { IGameRefining } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelCookingJob, StartCookingJob } from './cooking.actions';

export const defaultCooking: () => IGameRefining = () => ({
  version: 0,
  level: 0,
  queueSize: 1,
  recipeQueue: []
});

export function resetCooking(ctx: StateContext<IGameRefining>) {
  ctx.setState(defaultCooking());
}

export function decreaseDuration(ctx: StateContext<IGameRefining>, { ticks }: TickTimer) {
  decreaseRefineTimer(ctx, ticks, CancelCookingJob);
}

export function cancelCookingJob(ctx: StateContext<IGameRefining>, { jobIndex, shouldRefundResources }: CancelCookingJob) {
  cancelRefineJob(ctx, jobIndex, shouldRefundResources);
}

export function startCookingJob(ctx: StateContext<IGameRefining>, { job, quantity }: StartCookingJob) {
  startRefineJob(ctx, job, quantity);
};
