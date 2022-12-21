import { StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';

import { ICharacter, ICharSelect } from '../../interfaces';
import { CreateCharacter, DeleteCharacter, GainResources, SetActiveCharacter, SyncTotalLevel } from './charselect.actions';

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
  resources: {}
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
  if(ctx.getState().characters.length >= 4) {
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

    currentCharacter.resources[resource] += resources[resource];
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
}
