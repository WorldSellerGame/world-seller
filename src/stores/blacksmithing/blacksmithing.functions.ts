import { StateContext } from '@ngxs/store';

import { cancelRefineJob, decreaseRefineTimer, startRefineJob } from '../../app/helpers';
import { IGameRefining } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelBlacksmithingJob, StartBlacksmithingJob } from './blacksmithing.actions';

export const defaultBlacksmithing: () => IGameRefining = () => ({
  version: 0,
  level: 0,
  queueSize: 1,
  recipeQueue: []
});

export function resetBlacksmithing(ctx: StateContext<IGameRefining>) {
  ctx.setState(defaultBlacksmithing());
}

export function decreaseDuration(ctx: StateContext<IGameRefining>, { ticks }: TickTimer) {
  decreaseRefineTimer(ctx, ticks, CancelBlacksmithingJob);
}

export function cancelBlacksmithingJob(ctx: StateContext<IGameRefining>, { jobIndex, shouldRefundResources }: CancelBlacksmithingJob) {
  cancelRefineJob(ctx, jobIndex, shouldRefundResources);
}

export function startBlacksmithingJob(ctx: StateContext<IGameRefining>, { job, quantity }: StartBlacksmithingJob) {
  startRefineJob(ctx, job, quantity);
};
