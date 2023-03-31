import { StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { IGameAchievements } from '../../interfaces';
import { AnalyticsTrack } from '../game/game.actions';
import { IncrementStat } from './achievements.actions';

export const defaultAchievements: () => IGameAchievements = () => ({
  version: 0,
  stats: {},
  achievements: {}
});

export function resetAchievements(ctx: StateContext<IGameAchievements>) {
  ctx.setState(defaultAchievements());
}

export function resetStats(ctx: StateContext<IGameAchievements>) {
  ctx.patchState({
    stats: {}
  });
}

export function resetAchievementList(ctx: StateContext<IGameAchievements>) {
  ctx.patchState({
    achievements: {}
  });
}

export function incrementStat(ctx: StateContext<IGameAchievements>, { stat, value }: IncrementStat) {
  const currentState = ctx.getState();

  ctx.dispatch(new AnalyticsTrack(`Achievement:${stat}`, value));

  ctx.setState(patch<IGameAchievements>({
    stats: patch<Record<string, number>>({
      [stat]: (currentState.stats[stat] ?? 0) + value
    })
  }));
}

export function unlockAchievement(ctx: StateContext<IGameAchievements>, { achievement }: { achievement: string }) {
  ctx.setState(patch<IGameAchievements>({
    achievements: patch<Record<string, boolean>>({
      [achievement]: true
    })
  }));
}
