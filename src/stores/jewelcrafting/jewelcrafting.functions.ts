import { StateContext } from '@ngxs/store';

import { patch } from '@ngxs/store/operators';
import { cancelRefineJob, decreaseRefineTimer, startRefineJob } from '../../app/helpers';
import { AchievementStat, IGameRefining } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import {
  CancelJewelcraftingJob, ChangeJewelcraftingFilterOption,
  GainJewelcraftingLevels, StartJewelcraftingJob
} from './jewelcrafting.actions';

export const defaultJewelcrafting: () => IGameRefining = () => ({
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

export function unlockJewelcrafting(ctx: StateContext<IGameRefining>) {
  ctx.patchState({ unlocked: true });
}

export function gainJewelcraftingLevels(ctx: StateContext<IGameRefining>, { levels }: GainJewelcraftingLevels) {
  ctx.patchState({ level: Math.max(0, ctx.getState().level + levels) });
}

export function resetJewelcrafting(ctx: StateContext<IGameRefining>) {
  ctx.setState(defaultJewelcrafting());
}

export function decreaseDuration(ctx: StateContext<IGameRefining>, { ticks }: TickTimer) {
  decreaseRefineTimer(ctx, 'jewelcrafting', ticks, CancelJewelcraftingJob, AchievementStat.RefineJewelcrafting);
}

export function cancelJewelcraftingJob(ctx: StateContext<IGameRefining>, { jobIndex, shouldRefundResources }: CancelJewelcraftingJob) {
  cancelRefineJob(ctx, jobIndex, shouldRefundResources);
}

export function startJewelcraftingJob(ctx: StateContext<IGameRefining>, { job, quantity, items }: StartJewelcraftingJob) {
  startRefineJob(ctx, job, quantity, 'jewelcrafting', items);
};

export function changeJewelcraftingOption(ctx: StateContext<IGameRefining>, { option, value }: ChangeJewelcraftingFilterOption) {
  ctx.setState(patch<IGameRefining>({ [option]: value }));
}
