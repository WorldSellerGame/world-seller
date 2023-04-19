import { StateContext } from '@ngxs/store';

import { patch } from '@ngxs/store/operators';
import { random } from 'lodash';
import { pickNameWithWeights } from '../../app/helpers';
import { AchievementStat, IGameProspecting, TransformTradeskill } from '../../interfaces';
import { IncrementStat } from '../achievements/achievements.actions';
import { GainItemOrResource, GainResources } from '../charselect/charselect.actions';
import { NotifyTradeskill, PlaySFX, TickTimer } from '../game/game.actions';
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

  const resourcesGained: Record<string, number> = {};
  let successes = 0;

  for(let i = 0; i < quantity; i++) {

    const choice = pickNameWithWeights(prospect.becomes);
    const gainedAmt = random(prospect.perGather.min, prospect.perGather.max);

    if(choice === 'nothing') {
      continue;
    }

    successes++;

    if(!resourcesGained[choice]) {
      resourcesGained[choice] = 0;
    }

    resourcesGained[choice] += gainedAmt;
  }

  const allResourceGains = Object.keys(resourcesGained)
    .map(key => new GainItemOrResource(key, resourcesGained[key], false));
  const allResourceNotifications = Object.keys(resourcesGained)
    .map(key => new NotifyTradeskill(TransformTradeskill.Prospecting, `+${resourcesGained[key]}x ${key}`));

  ctx.dispatch([
    ...allResourceNotifications,
    ...allResourceGains,
    new IncrementStat(AchievementStat.ProspectingProspects, quantity)
  ]);

  if(successes === 0) {
    ctx.dispatch(new PlaySFX('tradeskill-finish-prospecting'));
  } else {
    ctx.dispatch(new PlaySFX('tradeskill-start-prospecting'));
  }

  if(successes > 0 && prospect.level.max > state.level) {
    ctx.setState(patch<IGameProspecting>({
      level: Math.min(prospect.level.max, state.level + successes)
    }));
  }
};
