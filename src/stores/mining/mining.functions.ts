import { StateContext } from '@ngxs/store';

import { cancelGathering, decreaseGatherTimer, setGatheringLocation } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import { CancelMining, SetMiningLocation } from './mining.actions';

export const defaultMining: () => IGameGathering = () => ({
  version: 0,
  level: 0,
  currentLocationDurationInitial: -1,
  currentLocationDuration: -1,
  cooldowns: {}
});

export function resetMining(ctx: StateContext<IGameGathering>) {
  ctx.setState(defaultMining());
}

export function cancelMining(ctx: StateContext<IGameGathering>) {
  cancelGathering(ctx);
}

export function decreaseDuration(ctx: StateContext<IGameGathering>, { ticks }: TickTimer) {
  decreaseGatherTimer(ctx, ticks, CancelMining);
}

export function setMiningLocation(ctx: StateContext<IGameGathering>, { location }: SetMiningLocation) {
  setGatheringLocation(ctx, location);
};
