import { StateContext } from '@ngxs/store';

import { patch } from '@ngxs/store/operators';
import { cancelRefineJob, decreaseRefineTimer, startRefineJob } from '../../app/helpers';
import { AchievementStat, IGameRefining, RefiningTradeskill } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import {
  CancelJewelcraftingJob, ChangeJewelcraftingFilterOption,
  GainJewelcraftingLevels, StarJewelcraftingRecipe, StartJewelcraftingJob
} from './jewelcrafting.actions';

export const defaultJewelcrafting: () => IGameRefining = () => ({
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
  decreaseRefineTimer(ctx, RefiningTradeskill.Jewelcrafting, ticks, CancelJewelcraftingJob, AchievementStat.RefineJewelcrafting);
}

export function cancelJewelcraftingJob(ctx: StateContext<IGameRefining>, { jobIndex, shouldRefundResources }: CancelJewelcraftingJob) {
  cancelRefineJob(ctx, jobIndex, shouldRefundResources);
}

export function startJewelcraftingJob(ctx: StateContext<IGameRefining>, { job, quantity, items }: StartJewelcraftingJob) {
  startRefineJob(ctx, job, quantity, RefiningTradeskill.Jewelcrafting, items);
};

export function changeJewelcraftingOption(ctx: StateContext<IGameRefining>, { option, value }: ChangeJewelcraftingFilterOption) {
  ctx.setState(patch<IGameRefining>({ [option]: value }));
}

export function starJewelcraftingRecipe(ctx: StateContext<IGameRefining>, { recipe }: StarJewelcraftingRecipe) {
  const starred = ctx.getState().starred || {};
  starred[recipe.result] = !starred[recipe.result];
  ctx.patchState({ starred });
}

export function upgradeJewelcraftingQueue(ctx: StateContext<IGameRefining>) {
  ctx.patchState({ queueSize: ctx.getState().queueSize + 1 });

}
