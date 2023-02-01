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

  public createItem(itemName: string, quantity = 1): IGameItem {
    const baseItem = this.contentService.getItemByName(itemName);

    baseItem.id = uuidv4();
    baseItem.quantity = quantity;

    return baseItem;
  }
}
