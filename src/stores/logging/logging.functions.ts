import { StateContext } from '@ngxs/store';

import { cancelGathering, decreaseGatherTimer, setGatheringLocation } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelLogging, SetLoggingLocation } from './logging.actions';

export const defaultLogging: () => IGameGathering = () => ({
  version: 0,
  level: 0,
  currentLocationDurationInitial: -1,
  currentLocationDuration: -1,
  cooldowns: {}
});

export function resetLogging(ctx: StateContext<IGameGathering>) {
  ctx.setState(defaultLogging());
}

export function cancelLogging(ctx: StateContext<IGameGathering>) {
  cancelGathering(ctx);
}

export function decreaseDuration(ctx: StateContext<IGameGathering>, { ticks }: TickTimer) {
  decreaseGatherTimer(ctx, ticks, CancelLogging);
}

export function setLoggingLocation(ctx: StateContext<IGameGathering>, { location }: SetLoggingLocation) {
  setGatheringLocation(ctx, location);
};
