import { StateContext } from '@ngxs/store';

import { cancelGathering, decreaseGatherTimer, setGatheringLocation } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelHunting, SetHuntingLocation } from './hunting.actions';

export const defaultHunting: () => IGameGathering = () => ({
  version: 0,
  level: 0,
  currentLocationDurationInitial: -1,
  currentLocationDuration: -1,
  cooldowns: {}
});

export function resetHunting(ctx: StateContext<IGameGathering>) {
  ctx.setState(defaultHunting());
}

export function cancelHunting(ctx: StateContext<IGameGathering>) {
  cancelGathering(ctx);
}

export function decreaseDuration(ctx: StateContext<IGameGathering>, { ticks }: TickTimer) {
  decreaseGatherTimer(ctx, ticks, CancelHunting);
}

export function setHuntingLocation(ctx: StateContext<IGameGathering>, { location }: SetHuntingLocation) {
  setGatheringLocation(ctx, location);
};
