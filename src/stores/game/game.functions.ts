import { StateContext } from '@ngxs/store';
import { IGame } from '../../interfaces';
import { SetActiveCharacter } from './game.actions';

export const defaultGame = () => ({
  version: 0,
  activeCharacter: -1
});

export function setActiveCharacter(ctx: StateContext<IGame>, { charSlot }: SetActiveCharacter) {
}
