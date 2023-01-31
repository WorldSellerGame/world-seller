import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { get, uniqBy } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { IGameCombatAbility, IGameItem } from '../../../../../../interfaces';
import { CharSelectState, CombatState } from '../../../../../../stores';
import { SetSkill } from '../../../../../../stores/combat/combat.actions';
import { getSkillsFromItems } from '../../../../../helpers';
import { ContentService } from '../../../../../services/content.service';

@Component({
  selector: 'app-loadout',
  templateUrl: './loadout.page.html',
  styleUrls: ['./loadout.page.scss'],
})
export class LoadoutPage implements OnInit, OnDestroy {

  @Select(CombatState.activeSkills) activeSkills$!: Observable<string[]>;
  @Select(CharSelectState.activeCharacterEquipment) equipment$!: Observable<Record<string, IGameItem>>;

  public level!: Subscription;

  public readonly skills = [0, 1, 2, 3, 4];

  public learnedSkills: Array<{ name: string; skill: IGameCombatAbility }> = [];

  public selectedSkill = '';

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
    this.level = this.store.subscribe(state => {
      let currentlyLearnedSkills: Array<{ name: string; skill: IGameCombatAbility }> = [];

      const allSkills = this.contentService.abilities;

      // check all the skills and see what we know!
      Object.keys(allSkills).forEach(skillName => {
        const skill = allSkills[skillName];

        const { requires, replaces } = skill;

        let canLearn = false;

        // check requirements - there must be one to learn it
        if(Object.keys(requires || {}).length > 0) {
          canLearn = Object.keys(requires).every(req => get(state, [req, 'level'], 0) >= requires[req]);
        }

        if(canLearn) {

          // replace the older skill with the newer one
          if(replaces) {
            currentlyLearnedSkills = currentlyLearnedSkills.filter(learnedSkill => learnedSkill.name === replaces);
          }

          // replace any copies of this skill
          currentlyLearnedSkills = uniqBy(currentlyLearnedSkills, 'name');

          currentlyLearnedSkills.push({
            name: skillName,
            skill
          });
        }
      });

      this.learnedSkills = currentlyLearnedSkills;
    });
  }

  ngOnDestroy() {
    this.level?.unsubscribe();
  }

  getItemSkills(items: Record<string, IGameItem>): string[] {
    return getSkillsFromItems(items);
  }

  selectSkill(skillName: string) {
    if(this.selectedSkill === skillName) {
      this.selectedSkill = '';
      return;
    }

    this.selectedSkill = skillName;
  }

  slotSkill(skillName: string, index: number) {
    if(!skillName) {
      return;
    }

    this.store.dispatch(new SetSkill(skillName, index));

    this.selectedSkill = '';
  }

  unslotSkill(index: number) {
    this.store.dispatch(new SetSkill('', index));
  }

}
