import { StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { cloneDeep, merge, random, zipObject } from 'lodash';
import { IGameRecipe, IGameRefining, IGameRefiningRecipe } from '../../interfaces';
import { GainJobResult, GainResources, SyncTotalLevel } from '../../stores/charselect/charselect.actions';

export function decreaseRefineTimer(ctx: StateContext<IGameRefining>, ticks: number, cancelProto: any) {

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
    ctx.dispatch(new GainJobResult(job.recipe.result, random(job.recipe.perCraft.min, job.recipe.perCraft.max)));

    // attempt a level up
    if(job.recipe.level.max > state.level) {
      ctx.setState(patch<IGameRefining>({
        level: state.level + 1
      }));

      ctx.dispatch(new SyncTotalLevel());
    }

    // if we're on the last one, delete the job
    if(job.totalLeft <= 1) {
      ctx.dispatch(new cancelProto(0, false));
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

export function startRefineJob(ctx: StateContext<IGameRefining>, job: IGameRecipe, quantity: number) {
  const recipeIngredients = Object.keys(job.ingredients).filter(ingredient => !(job.preserve || []).includes(ingredient));
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
}

export function cancelRefineJob(ctx: StateContext<IGameRefining>, jobIndex: number, shouldRefundResources: boolean) {
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
