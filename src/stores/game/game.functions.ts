import { StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { IGame } from '../../interfaces';
import { SetStatGains, UpdateFirebaseUID } from './game.actions';

export const defaultGame: () => IGame = () => ({
  version: 0,
  statGains: {},
  firebaseUID: ''
});

export function resetGame(ctx: StateContext<IGame>) {
}

export function setStatGains(ctx: StateContext<IGame>, { statGains }: SetStatGains) {
  ctx.setState(patch<IGame>({
    statGains
  }));
}

export function setFirebaseUID(ctx: StateContext<IGame>, { uid }: UpdateFirebaseUID) {
  ctx.setState(patch<IGame>({
    firebaseUID: uid
  }));
}
