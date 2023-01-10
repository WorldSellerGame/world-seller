

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { random, sample } from 'lodash';
import { canCraftRecipe, getRecipeIngredientCosts, getResourceRewardsForLocation } from '../../app/helpers';
import { IGameRecipe, IGameWorkers } from '../../interfaces';
import { GainResources, WorkerCreateItem } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { SellItem } from '../mercantile/mercantile.actions';
import { attachments } from './workers.attachments';
import { canAssignWorker, defaultWorkers, mercantileWorkerTime, totalAllocatedWorkers, workerTimerMultiplier } from './workers.functions';

@State<IGameWorkers>({
  name: 'workers',
  defaults: defaultWorkers()
})
@Injectable()
export class WorkersState {

  constructor(private store: Store) {
    attachments.forEach(({ action, handler }) => {
      attachAction(WorkersState, action, handler);
    });
  }

  @Selector()
  static gatheringWorkers(state: IGameWorkers) {
    return {
      workerAllocations: state.gatheringWorkerAllocations,
      hasWorkers: state.maxWorkers > 0,
      canAssignWorker: canAssignWorker(state)
    };
  }

  @Selector()
  static refiningWorkers(state: IGameWorkers) {
    return {
      workerAllocations: state.refiningWorkerAllocations,
      hasWorkers: state.maxWorkers > 0,
      canAssignWorker: canAssignWorker(state)
    };
  }

  @Selector()
  static mercantileWorkers(state: IGameWorkers) {
    return {
      workerAllocations: state.mercantileWorkerAllocations,
      hasWorkers: state.maxWorkers > 0,
      canAssignWorker: canAssignWorker(state)
    };
  }

  @Selector()
  static workerAllocations(state: IGameWorkers) {
    return {
      gathering: state.gatheringWorkerAllocations,
      refining: state.refiningWorkerAllocations,
      mercantile: state.mercantileWorkerAllocations
    };
  }

  @Selector()
  static maxWorkers(state: IGameWorkers) {
    return state.maxWorkers;
  }

  @Selector()
  static canAssignWorker(state: IGameWorkers) {
    return canAssignWorker(state);
  }

  @Selector()
  static workersAndAllocated(state: IGameWorkers) {
    return { current: totalAllocatedWorkers(state), max: state.maxWorkers };
  }

  @Selector()
  static totalAllocatedWorkers(state: IGameWorkers) {
    return totalAllocatedWorkers(state);
  }

  @Action(TickTimer)
  decreaseDuration(ctx: StateContext<IGameWorkers>, { ticks }: TickTimer) {
    const store = this.store.snapshot();

    const currentCharacter = store.charselect.characters[store.charselect.currentCharacter];
    if(!currentCharacter) {
      return;
    }

    const allResources = currentCharacter.resources;

    const state = ctx.getState();

    // handle gathering / rewards
    const gatheringRewards: Array<Record<string, number>> = [];

    const gatheringWorkerUpdates = state.gatheringWorkerAllocations.map(alloc => {
      alloc.currentTick += ticks * workerTimerMultiplier(1);

      if(alloc.currentTick > alloc.location.gatherTime) {
        const cooldown = alloc.location.cooldownTime ?? 0;
        alloc.currentTick = -cooldown;

        gatheringRewards.push(getResourceRewardsForLocation(alloc.location));
      }

      return alloc;
    });

    const gainedResources: Record<string, number> = {};
    gatheringRewards.forEach(rewards => {
      Object.keys(rewards).forEach(key => {
        gainedResources[key] = gainedResources[key] ?? 0;
        gainedResources[key] += rewards[key];
      });
    });

    if(Object.keys(gainedResources).length > 0) {
      ctx.dispatch(new GainResources(gainedResources));
    }

    // handle refining / rewards
    const refiningRewards: IGameRecipe[] = [];

    const refiningWorkerUpdates = state.refiningWorkerAllocations.map(alloc => {

      // if we don't have the resources, we do not craft
      if(alloc.currentTick === 0) {
        if(!canCraftRecipe(allResources, alloc.recipe, 1)) {
          return alloc;
        }

        // if we do have the resources, we take them
        const resourcesRequired = getRecipeIngredientCosts(alloc.recipe, 1);
        ctx.dispatch(new GainResources(resourcesRequired));
      }

      alloc.currentTick += ticks * workerTimerMultiplier(1);

      if(alloc.currentTick > alloc.recipe.craftTime) {
        refiningRewards.push(alloc.recipe);

        alloc.currentTick = 0;
      }

      return alloc;
    });

    refiningRewards.forEach(reward => {
      ctx.dispatch(new WorkerCreateItem(reward.result, random(reward.perCraft.min, reward.perCraft.max)));
    });

    // handle mercantile changes
    const allShopItems = store.mercantile.stockpile.items;

    const mercantileWorkerUpdates = state.mercantileWorkerAllocations.map(alloc => {
      if(alloc.currentTick === 0) {
        const chosenItem = sample(allShopItems);
        if(chosenItem) {
          ctx.dispatch(new SellItem(chosenItem));
        }
      }

      alloc.currentTick += ticks;
      if(alloc.currentTick > mercantileWorkerTime()) {
        alloc.currentTick = 0;
      }

      return alloc;
    });

    ctx.setState(patch<IGameWorkers>({
      gatheringWorkerAllocations: gatheringWorkerUpdates,
      refiningWorkerAllocations: refiningWorkerUpdates,
      mercantileWorkerAllocations: mercantileWorkerUpdates
    }));
  }

}
