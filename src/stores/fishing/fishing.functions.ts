import { StateContext } from '@ngxs/store';

import { cancelGathering } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';
import { GainFishingLevels } from './fishing.actions';

export const defaultFishing: () => IGameGathering = () => ({
  version: 0,
  unlocked: false,
  level: 0,
  currentLocationDurationInitial: -1,
  currentLocationDuration: -1,
  cooldowns: {}
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
