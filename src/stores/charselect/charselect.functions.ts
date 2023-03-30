import { StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';

import { sum } from 'lodash';
import { calculateBrokenItemStats } from '../../app/helpers';
import { AchievementStat, ICharSelect, IGameItem, IPlayerCharacter, ItemType } from '../../interfaces';
import { IncrementStat } from '../achievements/achievements.actions';
import {
  AddItemToInventory, BreakItem, CreateCharacter, DeleteCharacter, EquipItem,
  GainResources, RemoveItemFromInventory, SaveActiveCharacter, SetActiveCharacter, SyncTotalLevel, UnequipItem, UpdateStatsFromEquipment
} from './charselect.actions';

export const defaultCharSelect: () => ICharSelect = () => ({
  version: 0,
  currentCharacter: -1,
  characters: []
});

export const defaultCharacter: (name: string) => IPlayerCharacter = (name: string) => ({
  name,
  lastSavedAt: Date.now(),
  lastTotalLevel: 0,
  tradeskillLevels: {},
  tradeskillInformation: {},
  resources: {},
  inventory: [],
  equipment: {},
  discoveries: {},
  inventoryUnlocked: false
});

export function saveCurrentCharacter(ctx: StateContext<ICharSelect>) {
  const state = ctx.getState();
  const currentCharacter = state.characters[state.currentCharacter];
  if(!currentCharacter) {
    return;
  }

  ctx.setState(patch<ICharSelect>({
    characters: updateItem<IPlayerCharacter>(state.currentCharacter, patch<IPlayerCharacter>({
      lastSavedAt: Date.now()
    }))
  }));
}

export function createCharacter(ctx: StateContext<ICharSelect>, { name }: CreateCharacter) {
  if(ctx.getState().characters.length >= 1) {
    return;
  }

  ctx.setState(patch<ICharSelect>({
    characters: append<IPlayerCharacter>([defaultCharacter(name)])
  }));
}

export function deleteCharacter(ctx: StateContext<ICharSelect>, { slot }: DeleteCharacter) {
  ctx.setState(patch<ICharSelect>({
    characters: removeItem<IPlayerCharacter>(slot)
  }));
}

export function setActiveCharacter(ctx: StateContext<ICharSelect>, { charSlot }: SetActiveCharacter) {
  ctx.setState(patch<ICharSelect>({
    currentCharacter: charSlot
  }));
}

export function gainResources(ctx: StateContext<ICharSelect>, { resources, countsForAchievements }: GainResources) {
  const state = ctx.getState();
  const currentCharacter = state.characters[state.currentCharacter];
  if(!currentCharacter) {
    return;
  }

  // ya just can't
  delete resources['nothing'];

  const gainedResources = sum(Object.values(resources).filter(x => x > 0));
  if(countsForAchievements && gainedResources > 0) {
    ctx.dispatch(new IncrementStat(AchievementStat.ResourcesGained, gainedResources));
  }

  Object.keys(resources).forEach(resource => {
    if(!currentCharacter.resources[resource]) {
      currentCharacter.resources[resource] = 0;
    }

    currentCharacter.resources[resource] = Math.floor(Math.max(0, currentCharacter.resources[resource] + resources[resource]));
  });

  ctx.setState(patch<ICharSelect>({
    characters: updateItem<IPlayerCharacter>(state.currentCharacter, patch<IPlayerCharacter>({
      resources: currentCharacter.resources
    }))
  }));

  ctx.dispatch(new SaveActiveCharacter());
}

export function syncTotalLevel(ctx: StateContext<ICharSelect>, { newLevel }: SyncTotalLevel) {
  const state = ctx.getState();
  const currentCharacter = state.characters[state.currentCharacter];
  if(!currentCharacter) {
    return;
  }

  ctx.setState(patch<ICharSelect>({
    characters: updateItem<IPlayerCharacter>(state.currentCharacter, patch<IPlayerCharacter>({
      lastTotalLevel: newLevel
    }))
  }));

  ctx.dispatch(new SaveActiveCharacter());
}

export function addItemToInventory(ctx: StateContext<ICharSelect>, { item }: AddItemToInventory) {
  const state = ctx.getState();
  const currentCharacter = state.characters[state.currentCharacter];
  if(!currentCharacter) {
    return;
  }

  ctx.setState(patch<ICharSelect>({
    characters: updateItem<IPlayerCharacter>(state.currentCharacter, patch<IPlayerCharacter>({
      inventory: append<IGameItem>([item])
    }))
  }));

  ctx.dispatch(new SaveActiveCharacter());
}

export function removeItemFromInventory(ctx: StateContext<ICharSelect>, { item }: RemoveItemFromInventory) {
  const state = ctx.getState();
  const currentCharacter = state.characters[state.currentCharacter];
  if(!currentCharacter) {
    return;
  }

  ctx.setState(patch<ICharSelect>({
    characters: updateItem<IPlayerCharacter>(state.currentCharacter, patch<IPlayerCharacter>({
      inventory: removeItem<IGameItem>(currentCharacter.inventory.indexOf(item))
    }))
  }));

  ctx.dispatch(new SaveActiveCharacter());
}

export function unequipItem(ctx: StateContext<ICharSelect>, { slot }: UnequipItem) {
  const state = ctx.getState();
  const currentCharacter = state.characters[state.currentCharacter];
  if(!currentCharacter) {
    return;
  }

  const currentItem = currentCharacter.equipment[slot];
  if(!currentItem) {
    return;
  }

  ctx.setState(patch<ICharSelect>({
    characters: updateItem<IPlayerCharacter>(state.currentCharacter, patch<IPlayerCharacter>({
      equipment: patch<Partial<Record<ItemType, IGameItem>>>({
        [slot]: undefined
      })
    }))
  }));

  ctx.dispatch([
    new AddItemToInventory(currentItem),
    new UpdateStatsFromEquipment(),
    new SaveActiveCharacter()
  ]);
}

export function equipItem(ctx: StateContext<ICharSelect>, { item }: EquipItem) {
  const state = ctx.getState();
  const currentCharacter = state.characters[state.currentCharacter];
  if(!currentCharacter) {
    return;
  }

  const currentItem = currentCharacter.equipment[item.type];
  if(currentItem) {
    ctx.dispatch(new AddItemToInventory(currentItem));
  }

  ctx.setState(patch<ICharSelect>({
    characters: updateItem<IPlayerCharacter>(state.currentCharacter, patch<IPlayerCharacter>({
      equipment: patch<Partial<Record<ItemType, IGameItem>>>({
        [item.type]: item
      })
    }))
  }));

  ctx.dispatch([
    new RemoveItemFromInventory(item),
    new UpdateStatsFromEquipment(),
    new SaveActiveCharacter()
  ]);
}

export function breakItem(ctx: StateContext<ICharSelect>, { slot }: BreakItem) {
  const state = ctx.getState();
  const currentCharacter = state.characters[state.currentCharacter];
  if(!currentCharacter) {
    return;
  }

  const brokenItem = currentCharacter.equipment[slot];
  if(!brokenItem) {
    return;
  }

  brokenItem.stats = calculateBrokenItemStats(brokenItem);

  ctx.setState(patch<ICharSelect>({
    characters: updateItem<IPlayerCharacter>(state.currentCharacter, patch<IPlayerCharacter>({
      equipment: patch<Partial<Record<ItemType, IGameItem>>>({
        [slot]: brokenItem
      })
    }))
  }));

  ctx.dispatch(new SaveActiveCharacter());
}
