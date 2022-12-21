import { StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { random } from 'lodash';

import { pickWithWeights } from '../../app/helpers';
import { IGameMining } from '../../interfaces';
import { GainResources, SyncTotalLevel } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelMining, SetMiningLocation } from './mining.actions';

export const defaultMining: () => IGameMining = () => ({
  version: 0,
  level: 1,
  currentLocationDurationInitial: -1,
  currentLocationDuration: -1
});

export function cancelMining(ctx: StateContext<IGameMining>) {
  ctx.setState(patch<IGameMining>({
    currentLocationDurationInitial: -1,
    currentLocationDuration: -1,
    currentLocation: undefined
  }));
}

export function decreaseDuration(ctx: StateContext<IGameMining>, { ticks }: TickTimer) {
  const state = ctx.getState();
  if(state.currentLocationDuration < 0 || !state.currentLocation) {
    return;
  }

  const newTicks = state.currentLocationDuration - ticks;

  ctx.setState(patch<IGameMining>({
    currentLocationDuration: newTicks
  }));

  if(newTicks <= 0) {
    const location = state.currentLocation;

    const numResources = random(location.perGather.min, location.perGather.max);
    const gainedResources = pickWithWeights(location.resources, numResources);

    ctx.dispatch(new GainResources(gainedResources));

    if(location.level.max > state.level) {
      ctx.setState(patch<IGameMining>({
        level: state.level + 1
      }));

      ctx.dispatch(new SyncTotalLevel());
    }

    ctx.dispatch(new CancelMining());
  }
}

export function setMiningLocation(ctx: StateContext<IGameMining>, { location }: SetMiningLocation) {
  ctx.setState(patch<IGameMining>({
    currentLocation: location,
    currentLocationDurationInitial: location.gatherTime,
    currentLocationDuration: location.gatherTime
  }));
};
