import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { IGameEncounterCharacter, IPlayerCharacter } from '../../../interfaces';
import { CharSelectState, CombatState } from '../../../stores';
import { SyncTotalLevel } from '../../../stores/charselect/charselect.actions';
import { getTotalLevel } from '../../helpers';
import { setMainDiscordStatus } from '../../helpers/electron';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit, OnDestroy {

  @Select(CharSelectState.activeCharacter) activeCharacter$!: Observable<IPlayerCharacter>;
  @Select(CharSelectState.activeCharacterCoins) coins$!: Observable<number>;
  @Select(CombatState.currentPlayer) currentPlayer$!: Observable<IGameEncounterCharacter>;
  @Select(CombatState.currentEncounter) currentEncounter$!: Observable<any>;
  @Select(CombatState.oocTicks) oocTicks$!: Observable<{ health: number; energy: number }>;

  public totalLevel = 0;
  public currentlyInCombat = false;

  private level!: Subscription;
  private isInCombat!: Subscription;

  constructor(private store: Store) { }

  ngOnInit() {
    this.level = this.store.select(state => getTotalLevel(state)).subscribe(level => {
      this.totalLevel = level;

      setMainDiscordStatus(`Level ${level.toLocaleString()}`);

      this.store.dispatch(new SyncTotalLevel(level));
    });

    this.isInCombat = this.currentEncounter$.subscribe(encounter => {
      this.currentlyInCombat = !!encounter;
    });
  }

  ngOnDestroy(): void {
    this.level?.unsubscribe();
    this.isInCombat?.unsubscribe();
  }

}
