import { StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { IGameGatherLocation, IGameGathering } from '../../interfaces';

export function lowerGatheringCooldowns(ctx: StateContext<IGameGathering>, ticks = 1) {
  const state = ctx.getState();

  const cooldowns = state.cooldowns;
  Object.keys(cooldowns || {}).forEach(locationKey => {
    const location = cooldowns[locationKey];
    if(location > 0) {
      cooldowns[locationKey] = location - ticks;
    }

    if(cooldowns[locationKey] <= 0) {
      delete cooldowns[locationKey];
    }
  });

  ctx.setState(patch<IGameGathering>({
    cooldowns
  }));
}

export function isLocationOnCooldown(ctx: StateContext<IGameGathering>, location: IGameGatherLocation) {
  const state = ctx.getState();

  return !!state.cooldowns[location.name];
}

export function putLocationOnCooldown(
  ctx: StateContext<IGameGathering>,
  location: IGameGatherLocation,
  cdrValue: number,
  cdrPercent: number
) {

  if(!location.cooldownTime) {
    return;
  }

  const state = ctx.getState();

  const locationCooldownReduction = location.cooldownTime * cdrPercent;

  ctx.setState(patch<IGameGathering>({
    cooldowns: {
      ...state.cooldowns,
      [location.name]: Math.max(0, location.cooldownTime - (locationCooldownReduction || 0) - (cdrValue || 0))
    }
  }));
}
