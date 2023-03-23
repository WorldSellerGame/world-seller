import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import { IGameItem } from '../../interfaces';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root'
})
export class ItemCreatorService {

  constructor(private contentService: ContentService) { }

  public resourceMatchesType(itemName: string, type: string): boolean {
    return this.contentService.getResourceByName(itemName)?.category === type;
  }

  public iconFor(itemName: string): string {
    return this.contentService.getItemByName(itemName)?.icon || this.contentService.getResourceByName(itemName)?.icon;
  }

  public isResource(itemName: string): boolean {
    return !!this.contentService.getResourceByName(itemName);
  }

  public createItem(itemName: string, quantity = 1): IGameItem | undefined {
    const baseItem = this.contentService.getItemByName(itemName);
    if(!baseItem) {
      return undefined;
    }

    baseItem.internalId = itemName;
    baseItem.id = uuidv4();
    baseItem.quantity = quantity;

    return baseItem;
  }

  public migrateItem(oldItem: IGameItem): IGameItem | undefined {
    if(!oldItem) {
      return undefined;
    }

    const baseItem = this.createItem(oldItem.internalId || '', oldItem.quantity);
    if(!baseItem) {
      return undefined;
    }

    // we only want to migrate stats if it's not food. otherwise we want the correct stats
    if(!baseItem.foodDuration) {
      baseItem.stats = oldItem.stats;
    }

    if(oldItem.durability) {
      baseItem.durability = oldItem.durability;
    }

    if(oldItem.foodDuration) {
      baseItem.foodDuration = oldItem.foodDuration;
    }

    return baseItem;
  }
}
