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

  get item() {
    return this.contentService.getItemByName(this.name);
  }

  get itemClass() {
    return getItemRarityClass(this.item);
  }

  public get icon() {
    return this.item?.icon.toLowerCase();
  }

  public get rarity() {
    return this.item?.rarity.toLowerCase();
  }

  public get description() {
    return this.item?.description;
  }

  constructor(private contentService: ContentService) { }

  ngOnInit() {}

}
