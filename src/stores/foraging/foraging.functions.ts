import { StateContext } from '@ngxs/store';

import { cancelGathering, decreaseGatherTimer, setGatheringLocation } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelForaging, SetForagingLocation } from './foraging.actions';

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

export function decreaseDuration(ctx: StateContext<IGameGathering>, { ticks }: TickTimer) {
  decreaseGatherTimer(ctx, ticks, CancelForaging);
}

export function setForagingLocation(ctx: StateContext<IGameGathering>, { location }: SetForagingLocation) {
  setGatheringLocation(ctx, location);
};
