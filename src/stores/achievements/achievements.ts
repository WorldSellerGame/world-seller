

import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGameAchievements } from '../../interfaces';
import { attachments } from './achievements.attachments';
import { defaultAchievements } from './achievements.functions';

@State<IGameAchievements>({
  name: 'achievements',
  defaults: defaultAchievements()
})
@Injectable()
export class AchievementsState {

  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(AchievementsState, action, handler);
    });
  }

  @Selector()
  static stats(state: IGameAchievements) {
    return state.stats;
  }

  @Selector()
  static achievements(state: IGameAchievements) {
    return state.achievements;
  }

}
