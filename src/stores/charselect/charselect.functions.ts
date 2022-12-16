import { StateContext } from '@ngxs/store';

import { ICharSelect } from '../../interfaces';
import { CreateCharacter } from './charselect.actions';

export const defaultCharSelect = () => ({
  version: 0
});

export function createCharacter(ctx: StateContext<ICharSelect>, { name }: CreateCharacter) {
}
