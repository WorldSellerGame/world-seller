import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { sortBy, uniq } from 'lodash';
import { Observable } from 'rxjs';
import { IGameItem } from '../../../interfaces';
import { CharSelectState } from '../../../stores';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  @Select(CharSelectState.activeCharacterInventory) inventory$!: Observable<IGameItem[]>;

  constructor() { }

  ngOnInit() {
  }

  hasNoItems(items: IGameItem[]): boolean {
    return items.length === 0;
  }

  itemCategories(items: IGameItem[]): string[] {
    return sortBy(uniq(items.map(x => x.category)), 'name');
  }

  itemsInCategory(items: IGameItem[], category: string): IGameItem[] {
    return sortBy(items.filter(item => item.category === category), 'name');
  }

}
