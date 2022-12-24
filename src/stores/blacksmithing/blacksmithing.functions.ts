import { StateContext } from '@ngxs/store';

import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { cloneDeep, merge, random, zipObject } from 'lodash';
import { IGameRefining, IGameRefiningRecipe } from '../../interfaces';
import { GainInventoryItem, GainResources, SyncTotalLevel } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelBlacksmithingJob, StartBlacksmithingJob } from './blacksmithing.actions';

export const defaultBlacksmithing: () => IGameRefining = () => ({
  version: 0,
  level: 0,
  recipeQueue: [],
  cooldowns: {}
});

export function resetBlacksmithing(ctx: StateContext<IGameRefining>) {
  ctx.setState(defaultBlacksmithing());
}

export function decreaseDuration(ctx: StateContext<IGameRefining>, { ticks }: TickTimer) {
  const state = ctx.getState();

  const job = state.recipeQueue[0];
  if(!job) {
    return;
  }

  // lower ticks on the current recipe
  const newTicks = job.currentDuration - ticks;
  ctx.setState(patch<IGameRefining>({
    recipeQueue: updateItem<IGameRefiningRecipe>(0, { ...job, currentDuration: newTicks })
  }));

  if(newTicks <= 0) {

    // get a new item
    ctx.dispatch(new GainInventoryItem(job.recipe.result, random(job.recipe.perCraft.min, job.recipe.perCraft.max)));

    // attempt a level up
    if(job.recipe.level.max > state.level) {
      ctx.setState(patch<IGameRefining>({
        level: state.level + 1
      }));

      ctx.dispatch(new SyncTotalLevel());
    }

    // if we're on the last one, delete the job
    if(job.totalLeft <= 1) {
      ctx.dispatch(new CancelBlacksmithingJob(0, false));
      return;
    }

    // otherwise, just lower the total left and start it again
    const newJob = cloneDeep(job);
    newJob.currentDuration = newJob.durationPer;
    newJob.totalLeft -= 1;

    ctx.setState(patch<IGameRefining>({
      recipeQueue: updateItem<IGameRefiningRecipe>(0, newJob)
    }));
  }
}

export function cancelBlacksmithingJob(ctx: StateContext<IGameRefining>, { jobIndex, shouldRefundResources }: CancelBlacksmithingJob) {

  if(shouldRefundResources) {
    const job = ctx.getState().recipeQueue[jobIndex];
    const resourceRefunds = Object.keys(job.recipe.ingredients)
      .map(ingredient => ({ [ingredient]: job.recipe.ingredients[ingredient] * job.totalLeft }))
      .reduce((acc, cur) => merge(acc, cur), {});

    ctx.dispatch(new GainResources(resourceRefunds));
  }

  ctx.setState(patch<IGameRefining>({
    recipeQueue: removeItem<IGameRefiningRecipe>(jobIndex)
  }));

}

export function startBlacksmithingJob(ctx: StateContext<IGameRefining>, { job, quantity }: StartBlacksmithingJob) {

  const recipeIngredients = Object.keys(job.ingredients);
  const recipeCosts = recipeIngredients.map(ingredient => -job.ingredients[ingredient] * quantity);

  ctx.dispatch(new GainResources(zipObject(recipeIngredients, recipeCosts)));

  ctx.setState(patch<IGameRefining>({
    recipeQueue: append<IGameRefiningRecipe>([{
      recipe: job,
      totalDurationInitial: job.craftTime * quantity,
      totalLeft: quantity,
      durationPer: job.craftTime,
      currentDuration: job.craftTime
    }])
  }));
};
