import { StateContext } from '@ngxs/store';

import { patch } from '@ngxs/store/operators';
import { random } from 'lodash';
import { pickNameWithWeights } from '../../app/helpers';
import { AchievementStat, IGameProspecting } from '../../interfaces';
import { IncrementStat } from '../achievements/achievements.actions';
import { GainItemOrResource, GainResources } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { GainProspectingLevels, ProspectRock } from './prospecting.actions';

export const defaultProspecting: () => IGameProspecting = () => ({
  version: 0,
  unlocked: false,
  level: 0,
  queueSize: 1
});

export function unlockProspecting(ctx: StateContext<IGameProspecting>) {
  ctx.patchState({ unlocked: true });
}

export function gainProspectingLevels(ctx: StateContext<IGameProspecting>, { levels }: GainProspectingLevels) {
  ctx.patchState({ level: Math.max(0, ctx.getState().level + levels) });
}

export function resetProspecting(ctx: StateContext<IGameProspecting>) {
  ctx.setState(defaultProspecting());
}

export function decreaseDuration(ctx: StateContext<IGameProspecting>, { ticks }: TickTimer) {
}

export function prospectRock(ctx: StateContext<IGameProspecting>, { prospect, quantity }: ProspectRock) {
  const state = ctx.getState();

  ctx.dispatch(new GainResources({ [prospect.startingItem]: -quantity }));

  const choice = pickNameWithWeights(prospect.becomes);
  ctx.dispatch([
    new GainItemOrResource(choice, random(prospect.perGather.min, prospect.perGather.max)),
    new IncrementStat(AchievementStat.ProspectingProspects)
  ]);

  console.log(choice);

  if(choice !== 'nothing' && prospect.level.max > state.level) {
    ctx.setState(patch<IGameProspecting>({
      level: state.level + 1
    }));
  }
};
