import { StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { random } from 'lodash';
import { IGameGathering, IGameGatherLocation } from '../../interfaces';
import { GainResources, SyncTotalLevel } from '../../stores/charselect/charselect.actions';
import { isLocationOnCooldown, lowerGatheringCooldowns, putLocationOnCooldown } from './cooldowns';
import { pickWithWeights } from './pick-weight';

export function decreaseGatherTimer(ctx: StateContext<IGameGathering>, ticks: number, cancelProto: any) {
  const state = ctx.getState();

  lowerGatheringCooldowns(ctx, ticks);

  if(state.currentLocationDuration < 0 || !state.currentLocation) {
    return;
  }

  const newTicks = state.currentLocationDuration - ticks;

  ctx.setState(patch<IGameGathering>({
    currentLocationDuration: newTicks
  }));

  if(newTicks <= 0) {
    const location = state.currentLocation;

    const numResources = random(location.perGather.min, location.perGather.max);
    const gainedResources = pickWithWeights(location.resources, numResources);

    ctx.dispatch(new GainResources(gainedResources));

    putLocationOnCooldown(ctx, location);

    if(location.level.max > state.level) {
      ctx.setState(patch<IGameGathering>({
        level: state.level + 1
      }));

      ctx.dispatch(new SyncTotalLevel());
    }

    ctx.dispatch(new cancelProto());
  }
}

export function cancelGathering(ctx: StateContext<IGameGathering>) {
  ctx.setState(patch<IGameGathering>({
    currentLocationDurationInitial: -1,
    currentLocationDuration: -1,
    currentLocation: undefined
  }));
}

export function setGatheringLocation(ctx: StateContext<IGameGathering>, location: IGameGatherLocation) {

  if(isLocationOnCooldown(ctx, location)) {
    return;
  }

  ctx.setState(patch<IGameGathering>({
    currentLocation: location,
    currentLocationDurationInitial: location.gatherTime,
    currentLocationDuration: location.gatherTime
  }));
}
