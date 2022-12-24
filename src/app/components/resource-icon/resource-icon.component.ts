import { Component, Input, OnInit } from '@angular/core';

import * as resources from '../../../assets/content/resources.json';

@Component({
  selector: 'app-resource-icon',
  templateUrl: './resource-icon.component.html',
  styleUrls: ['./resource-icon.component.scss'],
})
export class ResourceIconComponent implements OnInit {

  public readonly resourceInfo = (resources as any).default || resources;

  @Input() name = '';
  @Input() quantity = -1;
  @Input() maxQuantity = 0;
  @Input() showX = false;
  @Input() angryColorWhenQuantityExceedsMax = false;
  @Input() inlineIconSize = false;
  @Input() emphasizeText = true;

  public get icon() {
    return this.resourceInfo[this.name]?.icon.toLowerCase();
  }

  public get rarity() {
    return this.resourceInfo[this.name]?.rarity.toLowerCase();
  }

  public get description() {
    return this.resourceInfo[this.name]?.description;
  }

  constructor() { }

  ngOnInit() {}

}
