import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { IGameDungeonState, IGameEncounter, IGameEncounterCharacter } from '../../../../../interfaces';
import { CombatState } from '../../../../../stores';
import { setDiscordStatus } from '../../../../helpers/electron';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.page.html',
  styleUrls: ['./combat.page.scss'],
})
export class CombatPage implements OnInit, OnDestroy {

  @Select(CombatState.level) level$!: Observable<number>;
  @Select(CombatState.currentDungeon) currentDungeon$!: Observable<IGameDungeonState>;
  @Select(CombatState.currentEncounter) currentEncounter$!: Observable<{ encounter: IGameEncounter; player: IGameEncounterCharacter }>;

  private state$!: Subscription;

  constructor() { }

  ngOnInit() {
    this.state$ = combineLatest([this.level$, this.currentDungeon$, this.currentEncounter$]).subscribe(([level, dungeon, encounter]) => {
      let state = `Combat Lv.${level}, perusing...`;

      if(dungeon) {
        state = `Combat Lv.${level}, exploring ${dungeon.dungeon.name}...`;
      }

      if(encounter.encounter.enemies[0]) {
        state = `Combat Lv.${level}, fighting ${encounter.encounter.enemies[0].name} and more...`;
      }

      setDiscordStatus({
        state
      });
    });
  }

  ngOnDestroy() {
    this.state$?.unsubscribe();
  }

}
