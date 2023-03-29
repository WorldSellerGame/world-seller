import { StateContext } from '@ngxs/store';

import { patch } from '@ngxs/store/operators';
import { cancelRefineJob, decreaseRefineTimer, startRefineJob } from '../../app/helpers';
import { AchievementStat, IGameRefining } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelAlchemyJob, ChangeAlchemyFilterOption, GainAlchemyLevels, StarAlchemyRecipe, StartAlchemyJob } from './alchemy.actions';

export const defaultAlchemy: () => IGameRefining = () => ({
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

export function unlockAlchemy(ctx: StateContext<IGameRefining>) {
  ctx.patchState({ unlocked: true });
}

export function gainAlchemyLevels(ctx: StateContext<IGameRefining>, { levels }: GainAlchemyLevels) {
  ctx.patchState({ level: Math.max(0, ctx.getState().level + levels) });
}

export function resetAlchemy(ctx: StateContext<IGameRefining>) {
  ctx.setState(defaultAlchemy());
}

export function decreaseDuration(ctx: StateContext<IGameRefining>, { ticks }: TickTimer) {
  decreaseRefineTimer(ctx, ticks, CancelAlchemyJob, AchievementStat.RefineAlchemy);
}

export function cancelAlchemyJob(ctx: StateContext<IGameRefining>, { jobIndex, shouldRefundResources }: CancelAlchemyJob) {
  cancelRefineJob(ctx, jobIndex, shouldRefundResources);
}

export function startAlchemyJob(ctx: StateContext<IGameRefining>, { job, quantity, items }: StartAlchemyJob) {
  startRefineJob(ctx, job, quantity, items);
};

export function changeAlchemyOption(ctx: StateContext<IGameRefining>, { option, value }: ChangeAlchemyFilterOption) {
  ctx.setState(patch<IGameRefining>({ [option]: value }));
}

export function starAlchemyRecipe(ctx: StateContext<IGameRefining>, { recipe }: StarAlchemyRecipe) {
  const starred = ctx.getState().starred || {};
  starred[recipe.result] = !starred[recipe.result];
  ctx.patchState({ starred });
}
