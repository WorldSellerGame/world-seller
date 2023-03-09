import { StateContext } from '@ngxs/store';

import { cancelGathering } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';
import { GainLoggingLevels } from './logging.actions';

export const defaultLogging: () => IGameGathering = () => ({
  version: 0,
  unlocked: true,
  level: 0,
  currentLocationDurationInitial: -1,
  currentLocationDuration: -1,
  cooldowns: {}
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
