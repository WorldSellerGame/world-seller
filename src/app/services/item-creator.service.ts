import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

import * as itemData from '../../assets/content/items.json';
import { IGameItem } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ItemCreatorService {

  readonly itemData = (itemData as any).default || itemData;

  constructor() { }

  public createItem(itemName: string, quantity = 1): IGameItem {
    const baseItem = cloneDeep(this.itemData[itemName]);

    baseItem.quantity = quantity;

    return baseItem;
  }
}
