import { StateContext } from '@ngxs/store';

import { patch } from '@ngxs/store/operators';
import { random } from 'lodash';
import { pickNameWithWeights } from '../../app/helpers';
import { IGameProspecting } from '../../interfaces';
import { GainJobResult, GainResources, SyncTotalLevel } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { ProspectRock } from './prospecting.actions';

export const defaultProspecting: () => IGameProspecting = () => ({
  version: 0,
  level: 0,
  queueSize: 1
});

export function resetProspecting(ctx: StateContext<IGameProspecting>) {
  ctx.setState(defaultProspecting());
}

export function decreaseDuration(ctx: StateContext<IGameProspecting>, { ticks }: TickTimer) {
}

export function prospectRock(ctx: StateContext<IGameProspecting>, { prospect, quantity }: ProspectRock) {
  const state = ctx.getState();

  ctx.dispatch(new GainResources({ [prospect.startingItem]: -quantity }));

  const choice = pickNameWithWeights(prospect.becomes);
  ctx.dispatch(new GainJobResult(choice, random(prospect.perGather.min, prospect.perGather.max)));

  if(prospect.level.max > state.level) {
    ctx.setState(patch<IGameProspecting>({
      level: state.level + 1
    }));

    ctx.dispatch(new SyncTotalLevel());
  }
};
