import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import * as itemData from '../../assets/content/items.json';
import * as resourceData from '../../assets/content/resources.json';
import { IGameItem, IGameResource } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ItemCreatorService {

  readonly resourceData: Record<string, IGameResource> = (resourceData as any).default || resourceData;
  readonly itemData: Record<string, IGameItem> = (itemData as any).default || itemData;

  constructor() { }

  public resourceMatchesType(itemName: string, type: string): boolean {
    return this.resourceData[itemName]?.category === type;
  }

  public iconFor(itemName: string): string {
    return this.itemData[itemName]?.icon || this.resourceData[itemName]?.icon;
  }

  public isResource(itemName: string): boolean {
    return !!this.resourceData[itemName];
  }

  public createItem(itemName: string, quantity = 1): IGameItem {
    const baseItem = cloneDeep(this.itemData[itemName]);

    baseItem.id = uuidv4();
    baseItem.quantity = quantity;

    return baseItem;
  }
}
