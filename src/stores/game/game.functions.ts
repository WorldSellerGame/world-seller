import { StateContext } from '@ngxs/store';
import { IGame } from '../../interfaces';

export const defaultGame: () => IGame = () => ({
  version: 0
});

export function resetGame(ctx: StateContext<IGame>) {
  ctx.setState(defaultGame());
}
