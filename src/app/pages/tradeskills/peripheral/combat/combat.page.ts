import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameDungeon, IGameEncounter } from '../../../../../interfaces';
import { CombatState } from '../../../../../stores';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.page.html',
  styleUrls: ['./combat.page.scss'],
})
export class CombatPage implements OnInit {

  @Select(CombatState.currentDungeon) currentDungeon$!: Observable<IGameDungeon>;
  @Select(CombatState.currentEncounter) currentEncounter$!: Observable<IGameEncounter>;

  constructor() { }

  ngOnInit() {
  }

}
