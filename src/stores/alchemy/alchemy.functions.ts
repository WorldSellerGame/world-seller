import { StateContext } from '@ngxs/store';

import { cancelRefineJob, decreaseRefineTimer, startRefineJob } from '../../app/helpers';
import { IGameRefining } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelAlchemyJob, StartAlchemyJob } from './alchemy.actions';

export const defaultAlchemy: () => IGameRefining = () => ({
  version: 0,
  level: 0,
  recipeQueue: []
});

export function resetAlchemy(ctx: StateContext<IGameRefining>) {
  ctx.setState(defaultAlchemy());
}

export function decreaseDuration(ctx: StateContext<IGameRefining>, { ticks }: TickTimer) {
  decreaseRefineTimer(ctx, ticks, CancelAlchemyJob);
}

export function cancelAlchemyJob(ctx: StateContext<IGameRefining>, { jobIndex, shouldRefundResources }: CancelAlchemyJob) {
  cancelRefineJob(ctx, jobIndex, shouldRefundResources);
}

export function startAlchemyJob(ctx: StateContext<IGameRefining>, { job, quantity }: StartAlchemyJob) {
  startRefineJob(ctx, job, quantity);
};
