

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { merge, random, sample } from 'lodash';
import { canCraftRecipe, getRecipeResourceCosts, getResourceRewardsForLocation } from '../../app/helpers';
import { IGameItem, IGameRecipe, IGameWorkers, Rarity } from '../../interfaces';
import { GainResources, RemoveItemFromInventory, WorkerCreateItem } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { SellItem, SpendCoins } from '../mercantile/mercantile.actions';
import { attachments } from './workers.attachments';
import {
  canAssignWorker, defaultWorkers, mercantileWorkerTime, totalAllocatedWorkers,
  upkeepCost, upkeepTicks, workerTimerMultiplier
} from './workers.functions';

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

  @Selector()
  static upkeep(state: IGameWorkers) {
    return { paid: state.upkeepPaid, ticks: state.upkeepTicks };
  }

  @Action(TickTimer)
  decreaseDuration(ctx: StateContext<IGameWorkers>, { ticks }: TickTimer) {
    const store = this.store.snapshot();
    const state = ctx.getState();

    const currentCharacter = store.charselect.characters[store.charselect.currentCharacter];
    if(!currentCharacter) {
      return;
    }

    const totalWorkers = totalAllocatedWorkers(state);
    if(totalWorkers === 0) {
      return;
    }

    const allResources = currentCharacter.resources;
    const itemList = currentCharacter.inventory;

    const allItems: Record<string, number> = {};
    itemList.forEach((item: IGameItem) => {
      allItems[item.name] = allItems[item.name] ?? 0;
      allItems[item.name]++;
    });

    const allResourcesAndItems = merge({}, allResources, allItems);

    // handle upkeep
    const workerUpkeepCost = upkeepCost(totalWorkers);
    const hasCoins = allResources.Coin >= workerUpkeepCost;

    // if it doesn't cost anything, it's always paid, but time will still tick down to prevent abuse
    if(workerUpkeepCost <= 0) {
      ctx.patchState({ upkeepPaid: true });
    }

    // when we get to the end
    if(workerUpkeepCost > 0 && (state.upkeepTicks <= 0 || !state.upkeepPaid)) {

      // if we have coins, pay it
      if(hasCoins) {

        ctx.dispatch(new SpendCoins(workerUpkeepCost));
        ctx.patchState({ upkeepPaid: true, upkeepTicks: upkeepTicks() });
        return;

      // if we can't pay, we mark it unpaid
      } else {
        ctx.patchState({ upkeepPaid: false, upkeepTicks: upkeepTicks() });
        return;
      }
    }

    // workers will not work unless the upkeep is currently paid
    if(!state.upkeepPaid) {
      return;
    }

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
        if(key === 'nothing') {
          return;
        }

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
        if(!canCraftRecipe(allResourcesAndItems, alloc.recipe, 1)) {
          return alloc;
        }

        // if we do have the resources, we take them
        const resourcesRequired = getRecipeResourceCosts(alloc.recipe, 1);
        ctx.dispatch(new GainResources(resourcesRequired));

        const takeItemQuantities: Record<string, number> = {};

        Object.keys(alloc.recipe.ingredients)
          .filter(key => allItems[key])
          .forEach(itemKey => {
            takeItemQuantities[itemKey] = alloc.recipe.ingredients[itemKey];
          });

        const allItemRefsTaken = Object.keys(takeItemQuantities).map(itemKey => {
          const validItems = itemList.filter((item: IGameItem) => item.name === itemKey);
          return validItems.slice(0, takeItemQuantities[itemKey]);
        }).flat();

        const allActions = allItemRefsTaken.map(itemRef => [new RemoveItemFromInventory(itemRef)]).flat();

        ctx.dispatch(allActions);
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

          alloc.lastSoldItemRarity = chosenItem.rarity;
          alloc.lastSoldItemValue = chosenItem.value;
          alloc.backToWorkTicks = mercantileWorkerTime(alloc.lastSoldItemRarity ?? Rarity.Common, alloc.lastSoldItemValue ?? 1);
        }
      }

      alloc.currentTick += ticks;
      if(alloc.currentTick > alloc.backToWorkTicks ?? 1) {
        alloc.currentTick = 0;
        alloc.backToWorkTicks = 0;
      }

      return alloc;
    });

    ctx.setState(patch<IGameWorkers>({
      gatheringWorkerAllocations: gatheringWorkerUpdates,
      refiningWorkerAllocations: refiningWorkerUpdates,
      mercantileWorkerAllocations: mercantileWorkerUpdates,
      upkeepTicks: (state.upkeepTicks ?? upkeepTicks()) - ticks
    }));
  }

}
