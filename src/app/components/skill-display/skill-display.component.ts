import { Component, Input, OnInit } from '@angular/core';
import { IGameCombatAbility } from '../../../interfaces';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-skill-display',
  templateUrl: './skill-display.component.html',
  styleUrls: ['./skill-display.component.scss'],
})
export class SkillDisplayComponent implements OnInit {

  @Input() skill!: string;

  constructor(private contentService: ContentService) { }

  ngOnInit() {}

  getSkillByName(name: string): IGameCombatAbility {
    return this.contentService.getAbilityByName(name);
  }

}
