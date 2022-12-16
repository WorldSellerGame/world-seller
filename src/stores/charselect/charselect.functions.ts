import { StateContext } from '@ngxs/store';
import { append, patch, removeItem } from '@ngxs/store/operators';

import { ICharacter, ICharSelect } from '../../interfaces';
import { CreateCharacter, DeleteCharacter } from './charselect.actions';

export const defaultCharSelect: () => ICharSelect = () => ({
  version: 0,
  characters: []
});

export const defaultCharacter: (name: string) => ICharacter = (name: string) => ({
  name,
  lastSavedAt: Date.now()
});

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
