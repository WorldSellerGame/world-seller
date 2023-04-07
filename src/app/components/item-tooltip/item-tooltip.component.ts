import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { IGameItem } from '../../../interfaces';
import { getItemRarityClass, itemValue } from '../../helpers';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-item-tooltip',
  templateUrl: './item-tooltip.component.html',
  styleUrls: ['./item-tooltip.component.scss']
})
export class ItemTooltipComponent implements OnInit {

  @Input() item!: IGameItem;

  public hasStats = false;
  public effects = '';
  public useAbilities = '';
  public ability = '';

  get itemClass() {
    return getItemRarityClass(this.item);
  }

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
    this.hasStats = Object.keys(this.item.stats || {}).length > 0;
    this.effects = (this.item?.effects || [])
      .filter(x => x.effect === 'ApplyEffect')
      .map(x => x.effectName)
      .filter(Boolean)
      .map(x => this.contentService.getEffectByName(x as string)?.name || 'Unknown')
      .join(', ');

    this.useAbilities = (this.item.abilities || [])
      .map(x => x.abilityName)
      .map(x => this.contentService.getAbilityByName(x)?.name || 'Unknown')
      .join(', ');

    if(this.item.givesPlayerAbility) {
      this.ability = this.contentService.getAbilityByName(this.item.givesPlayerAbility)?.name || 'Unknown';
    }
  }

  realSellValue(item: IGameItem) {
    return itemValue(item, 1) * (item.quantity ?? 1);
  }

}
