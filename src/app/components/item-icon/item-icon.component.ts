import { Component, Input, OnInit } from '@angular/core';

import { getItemRarityClass } from '../../helpers';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-item-icon',
  templateUrl: './item-icon.component.html',
  styleUrls: ['./item-icon.component.scss'],
})
export class ItemIconComponent implements OnInit {

  @Input() name = '';
  @Input() quantity = -1;
  @Input() maxQuantity = 0;
  @Input() showX = false;
  @Input() angryColorWhenQuantityExceedsMax = false;
  @Input() inlineIconSize = false;
  @Input() emphasizeText = true;

  get itemClass() {
    return getItemRarityClass(this.contentService.items[this.name]);
  }

  public get icon() {
    return this.contentService.items[this.name]?.icon.toLowerCase();
  }

  public get rarity() {
    return this.contentService.items[this.name]?.rarity.toLowerCase();
  }

  public get description() {
    return this.contentService.items[this.name]?.description;
  }

  constructor(private contentService: ContentService) { }

  ngOnInit() {}

}
