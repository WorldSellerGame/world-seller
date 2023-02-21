import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IAchievement, IGameAchievements } from '../../interfaces';
import { AchievementsState } from '../../stores';
import { UnlockAchievement } from '../../stores/achievements/achievements.actions';
import { ContentService } from './content.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class AchievementsService {

  @Select(AchievementsState.stats) stats$!: Observable<IGameAchievements['stats']>;
  @Select(AchievementsState.achievements) achievements$!: Observable<IGameAchievements['achievements']>;

  private achievements: Record<string, boolean> = {};

  constructor(private store: Store, private contentService: ContentService, private notifyService: NotifyService) {}

  init() {
    const allAchievements = this.contentService.getAllAchievements();

    // track achievements we have so we don't double up
    this.achievements$.subscribe(achievements => {
      this.achievements = achievements;
    });

    // any time stats change, we do the sad thing
    this.stats$.subscribe(stats => {
      Object.keys(allAchievements).forEach(achievement => {
        const achievementRef = this.contentService.getAchievementByName(achievement);
        if(!achievementRef) {
          return;
        }

        if(this.achievements[achievement]) {
          return;
        }

        if(!this.meetsAchievementCriteria(achievementRef, stats[achievementRef.stat] ?? 0)) {
          return;
        }

        this.unlockAchievement(achievement, achievementRef);
      });
    });
  }

  meetsAchievementCriteria(achievement: IAchievement, value: number) {
    return value >= achievement.requiredValue;
  }

  unlockAchievement(achievementKey: string, achievement: IAchievement) {
    if(this.achievements[achievementKey]) {
      return;
    }

    this.achievements[achievementKey] = true;
    this.store.dispatch(new UnlockAchievement(achievementKey));
    this.notifyService.achievement(`Achievement Unlocked: ${achievement.name} - ${achievement.description}`);
  }

}
