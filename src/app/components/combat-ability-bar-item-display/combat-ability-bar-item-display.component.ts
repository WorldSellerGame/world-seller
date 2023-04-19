import { Component, Input, OnInit } from '@angular/core';
import { IGameCombatAbility, IGameItem } from '../../../interfaces';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-combat-ability-bar-item-display',
  templateUrl: './combat-ability-bar-item-display.component.html',
  styleUrls: ['./combat-ability-bar-item-display.component.scss'],
})
export class CombatAbilityBarItemDisplayComponent implements OnInit {

  @Input() item!: IGameItem;
  @Input() active = false;

  constructor(private contentService: ContentService) { }

  ngOnInit() {}

  getAbility(name: string): IGameCombatAbility {
    return this.contentService.getAbilityByName(name) || '';
  }

  trackBy(index: number) {
    return index;
  }

}
