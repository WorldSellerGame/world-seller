import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { IGameEncounterCharacter, IPlayerCharacter } from '../../../interfaces';
import { CharSelectState, CombatState } from '../../../stores';
import { CharacterInfoService } from '../../services/character-info.service';

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

  public currentlyInCombat = false;

  private isInCombat!: Subscription;

  constructor(public charInfo: CharacterInfoService) { }

  ngOnInit() {
    this.isInCombat = this.currentEncounter$.subscribe(encounter => {
      this.currentlyInCombat = !!encounter;
    });
  }

  ngOnDestroy(): void {
    this.isInCombat?.unsubscribe();
  }

}
