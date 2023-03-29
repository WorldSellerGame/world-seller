import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { getTotalLevel } from '../helpers';
import { setMainDiscordStatus } from '../helpers/electron';
import { SyncTotalLevel } from '../../stores/charselect/charselect.actions';
import { IGameCombatAbility } from '../../interfaces';
import { ContentService } from './content.service';
import { get, uniqBy } from 'lodash';
import { NotifyInfo } from '../../stores/game/game.actions';

@Injectable({
  providedIn: 'root'
})
export class CharacterInfoService {

  private totalLevel = 0;
  private learnedSkills: Array<{ name: string; skill: IGameCombatAbility }> = [];

  public get level() {
    return this.totalLevel;
  }

  public get skills() {
    return this.learnedSkills;
  }

  constructor(private store: Store, private contentService: ContentService) {
    this.init();
  }

  init() {
    this.store.select(state => getTotalLevel(state)).subscribe(level => {
      this.totalLevel = level;

      setMainDiscordStatus(`Level ${level.toLocaleString()}`);

      this.store.dispatch(new SyncTotalLevel(level));
    });

    this.store.subscribe(state => {
      let currentlyLearnedSkills: Array<{ name: string; skill: IGameCombatAbility }> = [];

      const allSkills = this.contentService.getAllAbilities();

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
            currentlyLearnedSkills = currentlyLearnedSkills.filter(learnedSkill => learnedSkill.name !== replaces);
          }

          // replace any copies of this skill
          currentlyLearnedSkills = uniqBy(currentlyLearnedSkills, 'name');

          currentlyLearnedSkills.push({
            name: skillName,
            skill
          });
        }
      });

      const oldSkills = this.learnedSkills;
      this.learnedSkills = currentlyLearnedSkills;

      if(oldSkills.length > 0 && oldSkills.length < currentlyLearnedSkills.length) {
        const newSkills = currentlyLearnedSkills.filter(newSkill => !oldSkills.find(oldSkill => oldSkill.name === newSkill.name));

        const allSkillRefs = newSkills.map(skill => this.contentService.getAbilityByName(skill.name));
        this.store.dispatch(new NotifyInfo(`Learned new skills: ${allSkillRefs.map(skill => skill.name).join(', ')}`));
      }
    });
  }
}
