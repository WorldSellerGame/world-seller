import { StateContext } from '@ngxs/store';

import { cancelRefineJob, decreaseRefineTimer, startRefineJob } from '../../app/helpers';
import { IGameRefining } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelWeavingJob, StartWeavingJob } from './weaving.actions';

export const defaultWeaving: () => IGameRefining = () => ({
  version: 0,
  level: 0,
  queueSize: 1,
  recipeQueue: []
});

export function resetWeaving(ctx: StateContext<IGameRefining>) {
  ctx.setState(defaultWeaving());
}

export function decreaseDuration(ctx: StateContext<IGameRefining>, { ticks }: TickTimer) {
  decreaseRefineTimer(ctx, ticks, CancelWeavingJob);
}

export function cancelWeavingJob(ctx: StateContext<IGameRefining>, { jobIndex, shouldRefundResources }: CancelWeavingJob) {
  cancelRefineJob(ctx, jobIndex, shouldRefundResources);
}

export function startWeavingJob(ctx: StateContext<IGameRefining>, { job, quantity }: StartWeavingJob) {
  startRefineJob(ctx, job, quantity);
};
