import { StateContext } from '@ngxs/store';

import { IGameWorkers } from '../../interfaces';
import { TickTimer } from '../game/game.actions';

export const defaultWorkers: () => IGameWorkers = () => ({
  version: 0
});

export function resetWorkers(ctx: StateContext<IGameWorkers>) {
  ctx.setState(defaultWorkers());
}

export function decreaseDuration(ctx: StateContext<IGameWorkers>, { ticks }: TickTimer) {
}
