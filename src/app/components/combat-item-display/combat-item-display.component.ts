import { Component, Input, OnInit } from '@angular/core';
import { IGameItem } from '../../../interfaces';
import { getItemRarityClass } from '../../helpers';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-combat-item-display',
  templateUrl: './combat-item-display.component.html',
  styleUrls: ['./combat-item-display.component.scss'],
})
export class CombatItemDisplayComponent implements OnInit {

  @Input() item!: IGameItem;
  @Input() showEffectInfo = false;
  @Input() showUses = true;

  get itemClass() {
    return getItemRarityClass(this.item);
  }

  get effectInfo() {
    if(!this.item.effects) {
      return '';
    }

    return this.contentService.getAbilityByName(this.item.effects[0].effect)?.description || '';
  }

  constructor(private contentService: ContentService) { }

  ngOnInit() {}

}
