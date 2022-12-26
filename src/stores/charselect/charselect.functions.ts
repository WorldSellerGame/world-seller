import { StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';

import { ICharacter, ICharSelect, IGameItem, ItemType } from '../../interfaces';
import { AddItemToInventory, CreateCharacter, DeleteCharacter, EquipItem, GainResources, RemoveItemFromInventory, SetActiveCharacter, SyncTotalLevel, UnequipItem } from './charselect.actions';

export const defaultCharSelect: () => ICharSelect = () => ({
  version: 0,
  currentCharacter: -1,
  characters: []
});

export const defaultCharacter: (name: string) => ICharacter = (name: string) => ({
  name,
  lastSavedAt: Date.now(),
  lastTotalLevel: 0,
  tradeskillLevels: {},
  tradeskillInformation: {},
  resources: {},
  inventory: [],
  equipment: {}
});

export function saveCurrentCharacter(ctx: StateContext<ICharSelect>) {
  const state = ctx.getState();
  const currentCharacter = state.characters[state.currentCharacter];
  if(!currentCharacter) {
    return;
  }

  ctx.setState(patch<ICharSelect>({
    characters: updateItem<ICharacter>(state.currentCharacter, patch<ICharacter>({
      lastSavedAt: Date.now()
    }))
  }));
}

export function createCharacter(ctx: StateContext<ICharSelect>, { name }: CreateCharacter) {
  if(ctx.getState().characters.length >= 1) {
    return;
  }

  ctx.setState(patch<ICharSelect>({
    characters: append<ICharacter>([defaultCharacter(name)])
  }));
}

export function deleteCharacter(ctx: StateContext<ICharSelect>, { slot }: DeleteCharacter) {
  ctx.setState(patch<ICharSelect>({
    characters: removeItem<ICharacter>(slot)
  }));
}

export function setActiveCharacter(ctx: StateContext<ICharSelect>, { charSlot }: SetActiveCharacter) {
  ctx.setState(patch<ICharSelect>({
    currentCharacter: charSlot
  }));
}

export function gainResources(ctx: StateContext<ICharSelect>, { resources }: GainResources) {
  const state = ctx.getState();
  const currentCharacter = state.characters[state.currentCharacter];
  if(!currentCharacter) {
    return;
  }

  Object.keys(resources).forEach(resource => {
    if(!currentCharacter.resources[resource]) {
      currentCharacter.resources[resource] = 0;
    }

    currentCharacter.resources[resource] = Math.max(0, currentCharacter.resources[resource] + resources[resource]);
  });

  ctx.setState(patch<ICharSelect>({
    characters: updateItem<ICharacter>(state.currentCharacter, patch<ICharacter>({
      resources: currentCharacter.resources
    }))
  }));

  saveCurrentCharacter(ctx);
}

export function syncTotalLevel(ctx: StateContext<ICharSelect>, { newLevel }: SyncTotalLevel) {
  const state = ctx.getState();
  const currentCharacter = state.characters[state.currentCharacter];
  if(!currentCharacter) {
    return;
  }

  ctx.setState(patch<ICharSelect>({
    characters: updateItem<ICharacter>(state.currentCharacter, patch<ICharacter>({
      lastTotalLevel: newLevel
    }))
  }));

  saveCurrentCharacter(ctx);
}

export function addItemToInventory(ctx: StateContext<ICharSelect>, { item }: AddItemToInventory) {
  const state = ctx.getState();
  const currentCharacter = state.characters[state.currentCharacter];
  if(!currentCharacter) {
    return;
  }

  ctx.setState(patch<ICharSelect>({
    characters: updateItem<ICharacter>(state.currentCharacter, patch<ICharacter>({
      inventory: append<IGameItem>([item])
    }))
  }));

  saveCurrentCharacter(ctx);
}

export function removeItemFromInventory(ctx: StateContext<ICharSelect>, { item }: RemoveItemFromInventory) {
  const state = ctx.getState();
  const currentCharacter = state.characters[state.currentCharacter];
  if(!currentCharacter) {
    return;
  }

  ctx.setState(patch<ICharSelect>({
    characters: updateItem<ICharacter>(state.currentCharacter, patch<ICharacter>({
      inventory: removeItem<IGameItem>(currentCharacter.inventory.indexOf(item))
    }))
  }));

  saveCurrentCharacter(ctx);
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
    characters: updateItem<ICharacter>(state.currentCharacter, patch<ICharacter>({
      equipment: patch<Partial<Record<ItemType, IGameItem>>>({
        [slot]: undefined
      })
    }))
  }));

  saveCurrentCharacter(ctx);
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
    characters: updateItem<ICharacter>(state.currentCharacter, patch<ICharacter>({
      equipment: patch<Partial<Record<ItemType, IGameItem>>>({
        [item.type]: item
      })
    }))
  }));

  ctx.dispatch(new RemoveItemFromInventory(item));

  saveCurrentCharacter(ctx);
}
