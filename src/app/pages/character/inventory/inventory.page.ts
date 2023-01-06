import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { sortBy, uniq } from 'lodash';
import { Observable } from 'rxjs';
import { IGameItem } from '../../../../interfaces';
import { CharSelectState } from '../../../../stores';
import { QuickSellItemFromInventory, SellItem, SendToStockpile } from '../../../../stores/mercantile/mercantile.actions';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  @Select(CharSelectState.activeCharacterInventory) inventory$!: Observable<IGameItem[]>;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  hasNoItems(items: IGameItem[]): boolean {
    return items.length === 0;
  }

  itemCategories(items: IGameItem[]): string[] {
    return sortBy(uniq(items.filter(x => (x?.quantity ?? 0) > 0).map(x => x.category)));
  }

  itemsInCategory(items: IGameItem[], category: string): IGameItem[] {
    return sortBy(items.filter(x => (x?.quantity ?? 0) > 0).filter(item => item.category === category), 'name');
  }

  quickSell(item: IGameItem) {
    this.store.dispatch(new QuickSellItemFromInventory(item));
  }

  sell(item: IGameItem) {
    this.store.dispatch(new SellItem(item));
  }

  sendToStockpile(item: IGameItem) {
    this.store.dispatch(new SendToStockpile(item));
  }

}
