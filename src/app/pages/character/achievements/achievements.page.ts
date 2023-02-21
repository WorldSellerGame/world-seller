import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { IAchievement } from '../../../../interfaces';
import { AchievementsState } from '../../../../stores';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.page.html',
  styleUrls: ['./achievements.page.scss'],
})
export class AchievementsPage implements OnInit, OnDestroy {

  @Select(AchievementsState.stats) stats$!: Observable<Record<string, number>>;
  @Select(AchievementsState.achievements) achievements$!: Observable<Record<string, boolean>>;

  private achievementSub!: Subscription;

  public earnedAchievements: Record<string, boolean> = {};
  public achievementsInOrder: (IAchievement & { unearned: boolean })[] = [];

  constructor(private contentService: ContentService) { }

  ngOnInit() {
    this.achievementSub = this.achievements$.subscribe(achievements => {
      const allAchievements = this.contentService.getAllAchievements();

      const earnedAchievements = Object.keys(achievements).map(x => allAchievements[x]);
      const unearnedAchievements = Object.keys(allAchievements)
        .filter(x => !achievements[x])
        .map(x => ({ ...allAchievements[x], unearned: true }));

      this.earnedAchievements = achievements;
      this.achievementsInOrder = [...earnedAchievements, ...unearnedAchievements]
        .filter(Boolean) as (IAchievement & { unearned: boolean })[];
    });
  }

  ngOnDestroy() {
    this.achievementSub?.unsubscribe();
  }

  displayValue(lowerStat: number, upperStat: number) {
    return Math.min(lowerStat, upperStat);
  }

}
