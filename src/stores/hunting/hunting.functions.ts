import { StateContext } from '@ngxs/store';

import { cancelGathering } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';

export const defaultHunting: () => IGameGathering = () => ({
  version: 0,
  level: 0,
  currentLocationDurationInitial: -1,
  currentLocationDuration: -1,
  cooldowns: {}
});

export function resetHunting(ctx: StateContext<IGameGathering>) {
  ctx.setState(defaultHunting());
}

export function cancelHunting(ctx: StateContext<IGameGathering>) {
  cancelGathering(ctx);
}
