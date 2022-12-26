import { StateContext } from '@ngxs/store';

import { cancelGathering } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';

export const defaultForaging: () => IGameGathering = () => ({
  version: 0,
  level: 0,
  currentLocationDurationInitial: -1,
  currentLocationDuration: -1,
  cooldowns: {}
});

export function resetForaging(ctx: StateContext<IGameGathering>) {
  ctx.setState(defaultForaging());
}

export function cancelForaging(ctx: StateContext<IGameGathering>) {
  cancelGathering(ctx);
}
