import { StateContext } from '@ngxs/store';

import { cancelGathering } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';
import { GainMiningLevels, StarMiningLocation } from './mining.actions';

export const defaultMining: () => IGameGathering = () => ({
  version: 0,
  unlocked: false,
  level: 0,
  currentLocation: null,
  currentLocationDurationInitial: -1,
  currentLocationDuration: -1,
  cooldowns: {},
  starred: {},
});

export function unlockMining(ctx: StateContext<IGameGathering>) {
  ctx.patchState({ unlocked: true });
}

export function gainMiningLevels(ctx: StateContext<IGameGathering>, { levels }: GainMiningLevels) {
  ctx.patchState({ level: Math.max(0, ctx.getState().level + levels) });
}

export function resetMining(ctx: StateContext<IGameGathering>) {
  ctx.setState(defaultMining());
}

export function cancelMining(ctx: StateContext<IGameGathering>) {
  cancelGathering(ctx);
}

export function starMiningLocation(ctx: StateContext<IGameGathering>, { location }: StarMiningLocation) {
  const starred = ctx.getState().starred || {};
  starred[location.name] = !starred[location.name];
  ctx.patchState({ starred });
}
