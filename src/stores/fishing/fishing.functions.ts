import { StateContext } from '@ngxs/store';

import { cancelGathering } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';

export const defaultFishing: () => IGameGathering = () => ({
  version: 0,
  level: 0,
  currentLocationDurationInitial: -1,
  currentLocationDuration: -1,
  cooldowns: {}
});

export function resetFishing(ctx: StateContext<IGameGathering>) {
  ctx.setState(defaultFishing());
}

export function cancelFishing(ctx: StateContext<IGameGathering>) {
  cancelGathering(ctx);
}
