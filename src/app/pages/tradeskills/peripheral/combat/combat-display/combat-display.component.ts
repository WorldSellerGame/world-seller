import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CombatAbilityTarget, IGameCombatAbility, IGameEncounter, IGameEncounterCharacter } from '../../../../../../interfaces';
import { CombatState } from '../../../../../../stores';
import {
  EndCombat, EndCombatAndResetPlayer,
  TargetEnemyWithAbility, TargetSelfWithAbility
} from '../../../../../../stores/combat/combat.actions';
import { ContentService } from '../../../../../services/content.service';

@Component({
  selector: 'app-combat-display',
  templateUrl: './combat-display.component.html',
  styleUrls: ['./combat-display.component.scss'],
})
export class CombatDisplayComponent implements OnInit {

  public readonly debugActions = [
    { icon: 'refresh', text: 'End Combat & Reset Player', action: EndCombatAndResetPlayer },
    { icon: 'trash',   text: 'End Combat (No Reset)',     action: EndCombat },
  ];

  public readonly selfTargets = [CombatAbilityTarget.All, CombatAbilityTarget.Self];
  public readonly enemyTargets = [CombatAbilityTarget.All, CombatAbilityTarget.AllEnemies, CombatAbilityTarget.Single];

  public activeAbilityIndex = -1;
  public activeAbilityInfo: IGameCombatAbility | undefined;

  @Select(CombatState.currentEncounter) currentEncounter$!: Observable<{ encounter: IGameEncounter; player: IGameEncounterCharacter }>;

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {}

  getAbility(ability: string): IGameCombatAbility {
    return this.contentService.abilities[ability];
  }

  canDoAbility(player: IGameEncounterCharacter, ability: string, abilityIndex: number): boolean {
    const abilityRef = this.getAbility(ability);
    return !(player.cooldowns[abilityIndex] > 0) && player.currentEnergy >= abilityRef.energyCost;
  }

  canTargetSelf() {
    if(!this.activeAbilityInfo) {
      return false;
    }

    return this.selfTargets.includes(this.activeAbilityInfo.target);
  }

  canTargetEnemy(enemy: IGameEncounterCharacter) {
    if(!this.activeAbilityInfo) {
      return false;
    }

    if(enemy.currentHealth <= 0) {
      return false;
    }

    return this.enemyTargets.includes(this.activeAbilityInfo.target);
  }

  unselectAbility() {
    this.activeAbilityIndex = -1;
    this.activeAbilityInfo = undefined;
  }

  selectAbility(ability: string, abilityIndex: number) {
    if(this.activeAbilityIndex === abilityIndex) {
      this.unselectAbility();
      return;
    }

    this.activeAbilityIndex = abilityIndex;
    this.activeAbilityInfo = this.getAbility(ability);
  }

  targetEnemy(index: number, enemy: IGameEncounterCharacter, source: IGameEncounterCharacter) {
    if(!this.activeAbilityInfo || !this.canTargetEnemy(enemy)) {
      return;
    }

    this.store.dispatch(new TargetEnemyWithAbility(index, source, this.activeAbilityInfo, this.activeAbilityIndex));
    this.unselectAbility();
  }

  targetSelf() {
    if(!this.activeAbilityInfo || !this.canTargetSelf()) {
      return;
    }

    this.store.dispatch(new TargetSelfWithAbility(this.activeAbilityInfo, this.activeAbilityIndex));
    this.unselectAbility();
  }

}
