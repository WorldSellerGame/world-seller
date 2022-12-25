import { StateContext } from '@ngxs/store';

import { cancelRefineJob, decreaseRefineTimer, startRefineJob } from '../../app/helpers';
import { IGameRefining } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelJewelcraftingJob, StartJewelcraftingJob } from './jewelcrafting.actions';

export const defaultJewelcrafting: () => IGameRefining = () => ({
  version: 0,
  level: 0,
  recipeQueue: []
});

export function resetJewelcrafting(ctx: StateContext<IGameRefining>) {
  ctx.setState(defaultJewelcrafting());
}

export function decreaseDuration(ctx: StateContext<IGameRefining>, { ticks }: TickTimer) {
  decreaseRefineTimer(ctx, ticks, CancelJewelcraftingJob);
}

export function cancelJewelcraftingJob(ctx: StateContext<IGameRefining>, { jobIndex, shouldRefundResources }: CancelJewelcraftingJob) {
  cancelRefineJob(ctx, jobIndex, shouldRefundResources);
}

export function startJewelcraftingJob(ctx: StateContext<IGameRefining>, { job, quantity }: StartJewelcraftingJob) {
  startRefineJob(ctx, job, quantity);
};
