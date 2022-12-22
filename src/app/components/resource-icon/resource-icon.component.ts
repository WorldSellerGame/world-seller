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

  public get icon() {
    return this.resourceInfo[this.name]?.icon.toLowerCase();
  }

  public get rarity() {
    return this.resourceInfo[this.name]?.rarity.toLowerCase();
  }

  constructor() { }

  ngOnInit() {}

}
