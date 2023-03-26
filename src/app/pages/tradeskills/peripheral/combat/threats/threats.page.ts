import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IEnemyDrop, IGameEnemyThreat } from '../../../../../../interfaces';
import { CombatState } from '../../../../../../stores';
import { ChangeThreats, InitiateCombat } from '../../../../../../stores/combat/combat.actions';
import { ContentService } from '../../../../../services/content.service';

@Component({
  selector: 'app-threats',
  templateUrl: './threats.page.html',
  styleUrls: ['./threats.page.scss'],
})
export class ThreatsPage implements OnInit {

  @Select(CombatState.level) level$!: Observable<number>;
  @Select(CombatState.threatInfo) threatInfo$!: Observable<{ threats: string[]; threatChangeTicks: number }>;

  public readonly debugActions = [
    { icon: 'refresh', text: 'Refresh Threats', action: ChangeThreats },
  ];

  constructor(private store: Store, private router: Router, private contentService: ContentService) { }

  ngOnInit() {
  }

  public trackBy(index: number) {
    return index;
  }

  getThreatInfo(threatName: string): IGameEnemyThreat {
    return this.contentService.getThreatByName(threatName);
  }

  getEnemyDrops(enemyName: string): IEnemyDrop[] {
    return this.contentService.getEnemyByName(enemyName).drops;
  }

  fight(threatName: string) {
    this.store.dispatch(new InitiateCombat(threatName, false));
  }

  getPotentialDrops(threatName: string) {
    const { enemies } = this.getThreatInfo(threatName);

    const resources: Record<string, { min: number; max: number }> = {};
    const items: Record<string, { min: number; max: number }> = {};

    enemies.forEach(enemy => {
      this.getEnemyDrops(enemy).forEach(drop => {
        if(drop.resource) {
          resources[drop.resource] ??= { min: 0, max: 0 };
          resources[drop.resource].min += drop.min;
          resources[drop.resource].max += drop.max;
        }

        if(drop.item) {
          items[drop.item] ??= { min: 0, max: 0 };
          items[drop.item].min += drop.min;
          items[drop.item].max += drop.max;
        }
      });
    });

    return { resources, items };
  }

}
