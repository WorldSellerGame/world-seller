import { Component, Input, OnInit } from '@angular/core';

import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-resource-icon',
  templateUrl: './resource-icon.component.html',
  styleUrls: ['./resource-icon.component.scss'],
})
export class ResourceIconComponent implements OnInit {

  @Input() name = '';
  @Input() quantity = -1;
  @Input() maxQuantity = 0;
  @Input() showX = false;
  @Input() angryColorWhenQuantityExceedsMax = false;
  @Input() inlineIconSize = false;
  @Input() emphasizeText = true;

  public get icon() {
    return this.contentService.resources[this.name]?.icon.toLowerCase();
  }

  public get rarity() {
    return this.contentService.resources[this.name]?.rarity.toLowerCase();
  }

  public get description() {
    return this.contentService.resources[this.name]?.description;
  }

  constructor(private contentService: ContentService) { }

  ngOnInit() {}

}
