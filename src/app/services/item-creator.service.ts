import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { IGameItem } from '../../interfaces';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root'
})
export class ItemCreatorService {

  constructor(private contentService: ContentService) { }

  public resourceMatchesType(itemName: string, type: string): boolean {
    return this.contentService.resources[itemName]?.category === type;
  }

  public iconFor(itemName: string): string {
    return this.contentService.items[itemName]?.icon || this.contentService.resources[itemName]?.icon;
  }

  public isResource(itemName: string): boolean {
    return !!this.contentService.resources[itemName];
  }

  public createItem(itemName: string, quantity = 1): IGameItem {
    const baseItem = cloneDeep(this.contentService.items[itemName]);

    baseItem.id = uuidv4();
    baseItem.quantity = quantity;

    return baseItem;
  }
}
