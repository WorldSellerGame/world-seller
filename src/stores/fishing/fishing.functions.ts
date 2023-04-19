import { StateContext } from '@ngxs/store';

import { cancelGathering } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';
import { GainFishingLevels, StarFishingLocation } from './fishing.actions';

export const defaultFishing: () => IGameGathering = () => ({
  version: 0,
  unlocked: false,
  level: 0,
  currentLocation: null,
  currentLocationDurationInitial: -1,
  currentLocationDuration: -1,
  cooldowns: {},
  starred: {},
});

export function unlockFishing(ctx: StateContext<IGameGathering>) {
  ctx.patchState({ unlocked: true });
}

export function gainFishingLevels(ctx: StateContext<IGameGathering>, { levels }: GainFishingLevels) {
  ctx.patchState({ level: Math.max(0, ctx.getState().level + levels) });
}

export function resetFishing(ctx: StateContext<IGameGathering>) {
  ctx.setState(defaultFishing());
}

export function cancelFishing(ctx: StateContext<IGameGathering>) {
  cancelGathering(ctx);
}

export function starFishingLocation(ctx: StateContext<IGameGathering>, { location }: StarFishingLocation) {
  const starred = ctx.getState().starred || {};
  starred[location.name] = !starred[location.name];
  ctx.patchState({ starred });
}
