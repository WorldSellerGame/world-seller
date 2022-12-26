import { StateContext } from '@ngxs/store';

import { cancelGathering, decreaseGatherTimer, setGatheringLocation } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelFishing, SetFishingLocation } from './fishing.actions';

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

export function decreaseDuration(ctx: StateContext<IGameGathering>, { ticks }: TickTimer) {
  decreaseGatherTimer(ctx, ticks, CancelFishing);
}

export function setFishingLocation(ctx: StateContext<IGameGathering>, { location }: SetFishingLocation) {
  setGatheringLocation(ctx, location);
};
