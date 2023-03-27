import { StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { cloneDeep, merge, random, zipObject } from 'lodash';
import { AchievementStat, IGameItem, IGameRecipe, IGameRefining, IGameRefiningRecipe } from '../../interfaces';
import { IncrementStat } from '../../stores/achievements/achievements.actions';
import { AddItemToInventory, GainItemOrResource, GainResources, RemoveItemFromInventory } from '../../stores/charselect/charselect.actions';
import { PlaySFX } from '../../stores/game/game.actions';

export function decreaseRefineTimer(ctx: StateContext<IGameRefining>, ticks: number, cancelProto: any, incrementStat: AchievementStat) {

  const state = ctx.getState();

  const job = state.recipeQueue[0];
  if(!job) {
    return;
  }

  // lower ticks on the current recipe
  const newTicks = Math.floor(job.currentDuration - ticks);
  ctx.setState(patch<IGameRefining>({
    recipeQueue: updateItem<IGameRefiningRecipe>(0, { ...job, currentDuration: newTicks })
  }));

  if(newTicks <= 0) {

    // get a new item
    ctx.dispatch([
      new GainItemOrResource(job.recipe.result, random(job.recipe.perCraft.min, job.recipe.perCraft.max)),
      new IncrementStat(incrementStat),
      new PlaySFX('tradeskill-finish')
    ]);

    // attempt a level up
    if(job.recipe.level.max > state.level) {
      ctx.setState(patch<IGameRefining>({
        level: state.level + 1
      }));
    }

    // if we're on the last one, delete the job
    if(job.totalLeft <= 1) {
      ctx.dispatch(new cancelProto(0, false));
      return;
    }

    // otherwise, just lower the total left and start it again
    const newJob = cloneDeep(job);
    newJob.currentDuration = Math.floor(newJob.durationPer);
    newJob.totalLeft -= 1;

    if(newJob.refundItems.length > 0) {
      const allItemNames = [...new Set(newJob.refundItems.map(x => x.name))];
      const itemQuantitiesPerRecipe = allItemNames.map(x => ({ name: x, quantity: newJob.recipe.ingredients[x] }));

      itemQuantitiesPerRecipe.forEach(({ name, quantity }) => {
        for(let i = 0; i < quantity; i++) {
          const lostItem = newJob.refundItems.find(x => x.name === name);
          newJob.refundItems = newJob.refundItems.filter(x => x !== lostItem);
        }
      });
    }

    ctx.setState(patch<IGameRefining>({
      recipeQueue: updateItem<IGameRefiningRecipe>(0, newJob)
    }));
  }
}

export function canCraftRecipe(resources: Record<string, number>, recipe: IGameRecipe, amount = 1): boolean {
  return Object.keys(recipe.ingredients)
    .every(ingredient => recipe.preserve?.includes(ingredient)
      ? resources[ingredient] >= recipe.ingredients[ingredient]
      : resources[ingredient] >= (recipe.ingredients[ingredient] * amount)
    );
}

export function getRecipeIngredientCosts(recipe: IGameRecipe, amount = 1): Record<string, number> {
  const recipeIngredients = Object.keys(recipe.ingredients).filter(ingredient => !(recipe.preserve || []).includes(ingredient));
  const recipeCosts = recipeIngredients.map(ingredient => -recipe.ingredients[ingredient] * amount);

  return zipObject(recipeIngredients, recipeCosts);
}

export function startRefineJob(ctx: StateContext<IGameRefining>, job: IGameRecipe, quantity: number, refundItems: IGameItem[] = []) {

  const recipeCosts = getRecipeIngredientCosts(job, quantity);
  const doesRecipeCostAnything = Object.keys(recipeCosts).length > 0;

  if(doesRecipeCostAnything) {
    ctx.dispatch(new GainResources(recipeCosts));
  }

  ctx.dispatch([
    ...refundItems.map(item => new RemoveItemFromInventory(item)),
    new PlaySFX('tradeskill-start')
  ]);

  ctx.setState(patch<IGameRefining>({
    recipeQueue: append<IGameRefiningRecipe>([{
      recipe: job,
      totalDurationInitial: job.craftTime * quantity,
      totalLeft: quantity,
      durationPer: job.craftTime,
      currentDuration: job.craftTime,
      refundItems
    }])
  }));
}

export function cancelRefineJob(ctx: StateContext<IGameRefining>, jobIndex: number, shouldRefundResources: boolean) {
  if(shouldRefundResources) {
    const job = ctx.getState().recipeQueue[jobIndex];

    const resourceRefunds = Object.keys(job.recipe.ingredients)
      .filter(ingredient => !job.refundItems.map(x => x.name).includes(ingredient))
      .map(ingredient => (job.recipe.preserve || []).includes(ingredient)
        ? {}
        : ({ [ingredient]: job.recipe.ingredients[ingredient] * job.totalLeft })
      )
      .filter(Boolean)
      .reduce((acc, cur) => merge(acc, cur), {});

    ctx.dispatch(new GainResources(resourceRefunds, false, false));

    const itemRefunds = job.refundItems.map(item => new AddItemToInventory(item));
    ctx.dispatch(itemRefunds);
  }

  ctx.setState(patch<IGameRefining>({
    recipeQueue: removeItem<IGameRefiningRecipe>(jobIndex)
  }));
}
