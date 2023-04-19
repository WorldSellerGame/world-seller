import { StateContext } from '@ngxs/store';

import { cancelGathering } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';
import { GainHuntingLevels, StarHuntingLocation } from './hunting.actions';

export const defaultHunting: () => IGameGathering = () => ({
  version: 0,
  unlocked: false,
  level: 0,
  currentLocation: null,
  currentLocationDurationInitial: -1,
  currentLocationDuration: -1,
  cooldowns: {},
  starred: {},
});

export function unlockHunting(ctx: StateContext<IGameGathering>) {
  ctx.patchState({ unlocked: true });
}

export function gainHuntingLevels(ctx: StateContext<IGameGathering>, { levels }: GainHuntingLevels) {
  ctx.patchState({ level: Math.max(0, ctx.getState().level + levels) });
}

export function resetHunting(ctx: StateContext<IGameGathering>) {
  ctx.setState(defaultHunting());
}

export function cancelHunting(ctx: StateContext<IGameGathering>) {
  cancelGathering(ctx);
}

export function starHuntingLocation(ctx: StateContext<IGameGathering>, { location }: StarHuntingLocation) {
  const starred = ctx.getState().starred || {};
  starred[location.name] = !starred[location.name];
  ctx.patchState({ starred });
}
