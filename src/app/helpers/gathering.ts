import { StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { random } from 'lodash';
import { AchievementStat, IGameGatherLocation, IGameGathering, Tradeskill } from '../../interfaces';
import { IncrementStat } from '../../stores/achievements/achievements.actions';
import { GainResources } from '../../stores/charselect/charselect.actions';
import { CancelFishing } from '../../stores/fishing/fishing.actions';
import { CancelForaging } from '../../stores/foraging/foraging.actions';
import { NotifyTradeskill, PlaySFX } from '../../stores/game/game.actions';
import { CancelHunting } from '../../stores/hunting/hunting.actions';
import { CancelLogging } from '../../stores/logging/logging.actions';
import { CancelMining } from '../../stores/mining/mining.actions';
import { isLocationOnCooldown, lowerGatheringCooldowns, putLocationOnCooldown } from './cooldowns';
import { pickResourcesWithWeights } from './pick-weight';

export function getResourceRewardsForLocation(location: IGameGatherLocation) {
  const numResources = random(location.perGather.min, location.perGather.max);
  const gainedResources = pickResourcesWithWeights(location.resources, numResources);

  return gainedResources;
}

export function decreaseGatherTimer(
  ctx: StateContext<IGameGathering>,
  tradeskill: Tradeskill,
  ticks: number,
  cdrValue: number,
  cdrPercent: number,
  cancelProto: any,
  incrementStatOnFinish: AchievementStat
) {
  const state = ctx.getState();

  lowerGatheringCooldowns(ctx, ticks);

  if(state.currentLocationDuration < 0 || !state.currentLocation) {
    return;
  }

  const newTicks = Math.floor(state.currentLocationDuration - ticks);

  ctx.setState(patch<IGameGathering>({
    currentLocationDuration: newTicks
  }));

  if(newTicks <= 0) {
    const location = state.currentLocation;

    const gainedResources = getResourceRewardsForLocation(location);

    putLocationOnCooldown(ctx, location, cdrValue, cdrPercent);

    if(location.level.max > state.level) {
      ctx.setState(patch<IGameGathering>({
        level: state.level + 1
      }));
    }

    const resourceNotifications = Object.keys(gainedResources)
      .map(resource => ({ tradeskill, message: `+${gainedResources[resource]}x ${resource}!` }))
      .map(res => new NotifyTradeskill(res.tradeskill, res.message));

    ctx.dispatch(new cancelProto()).subscribe(() => {
      ctx.dispatch([
        ...resourceNotifications,
        new GainResources(gainedResources, false),
        new IncrementStat(incrementStatOnFinish, 1),
        new PlaySFX(`tradeskill-finish-${tradeskill}`)
      ]);
    });
  }
}

export function cancelGathering(ctx: StateContext<IGameGathering>) {
  ctx.setState(patch<IGameGathering>({
    currentLocationDurationInitial: -1,
    currentLocationDuration: -1,
    currentLocation: null
  }));
}

export function cancelAllGathering() {
  return [
    new CancelFishing(),
    new CancelMining(),
    new CancelLogging(),
    new CancelForaging(),
    new CancelHunting()
  ];
}

export function setGatheringLocation(
  ctx: StateContext<IGameGathering>,
  location: IGameGatherLocation,
  gdrValue: number,
  tradeskill: Tradeskill
) {

  if(isLocationOnCooldown(ctx, location)) {
    return;
  }

  ctx.dispatch([
    ...cancelAllGathering(),
    new PlaySFX(`tradeskill-start-${tradeskill}`)
  ]).subscribe(() => {
    const gatherTime = Math.floor(Math.max(1, location.gatherTime - (gdrValue || 0)));

    ctx.setState(patch<IGameGathering>({
      currentLocation: location,
      currentLocationDurationInitial: gatherTime,
      currentLocationDuration: gatherTime
    }));
  });
}
