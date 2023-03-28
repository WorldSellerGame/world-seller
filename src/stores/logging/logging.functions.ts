import { StateContext } from '@ngxs/store';

import { cancelGathering } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';
import { GainLoggingLevels, StarLoggingLocation } from './logging.actions';

export const defaultLogging: () => IGameGathering = () => ({
  version: 0,
  unlocked: true,
  level: 0,
  currentLocationDurationInitial: -1,
  currentLocationDuration: -1,
  cooldowns: {},
  starred: {},
});

export function unlockLogging(ctx: StateContext<IGameGathering>) {
  ctx.patchState({ unlocked: true });
}

export function gainLoggingLevels(ctx: StateContext<IGameGathering>, { levels }: GainLoggingLevels) {
  ctx.patchState({ level: Math.max(0, ctx.getState().level + levels) });
}

export function resetLogging(ctx: StateContext<IGameGathering>) {
  ctx.setState(defaultLogging());
}

export function cancelLogging(ctx: StateContext<IGameGathering>) {
  cancelGathering(ctx);
}

export function starLoggingLocation(ctx: StateContext<IGameGathering>, { location }: StarLoggingLocation) {
  const starred = ctx.getState().starred || {};
  starred[location.name] = !starred[location.name];
  ctx.patchState({ starred });
}
