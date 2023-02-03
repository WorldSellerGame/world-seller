import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { IDungeon } from '../../../../../../interfaces';
import { CombatState } from '../../../../../../stores';
import { EnterDungeon } from '../../../../../../stores/combat/dungeon.actions';
import { ContentService } from '../../../../../services/content.service';

@Component({
  selector: 'app-dungeons',
  templateUrl: './dungeons.page.html',
  styleUrls: ['./dungeons.page.scss'],
})
export class DungeonsPage implements OnInit, OnDestroy {

  @Select(CombatState.level) level$!: Observable<number>;

  private dungeonsSub!: Subscription;
  public dungeons: IDungeon[] = [];

  public get allDungeons() {
    return Object.values(this.contentService.getAllDungeons());
  }

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
    this.dungeonsSub = this.level$.subscribe(x => {
      this.dungeons = this.visibleDungeons(x);
    });
  }

  ngOnDestroy() {
    this.dungeonsSub?.unsubscribe();
  }

  visibleDungeons(level: number) {
    return this.allDungeons.filter(x => level >= x.givesPointAtCombatLevel);
  }

  embark(dungeon: IDungeon) {
    this.store.dispatch(new EnterDungeon(dungeon));
  }

}
