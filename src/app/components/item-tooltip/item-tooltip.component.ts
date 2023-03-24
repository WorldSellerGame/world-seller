import { Component, Input, OnInit } from '@angular/core';
import { IGameItem } from '../../../interfaces';
import { getItemRarityClass } from '../../helpers';
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
  public ability = '';

  get itemClass() {
    return getItemRarityClass(this.item);
  }

  constructor(private contentService: ContentService) { }

  ngOnInit() {
    this.hasStats = Object.keys(this.item.stats || {}).length > 0;
    this.effects = (this.item.effects || [])
      .map(x => x.effect)
      .map(x => this.contentService.getAbilityByName(x)?.name || 'Unknown')
      .join(', ');

    if(this.item.givesAbility) {
      this.ability = this.contentService.getAbilityByName(this.item.givesAbility)?.name || 'Unknown';
    }
  }

}
