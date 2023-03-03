import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { sortBy, uniq } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { IGameItem } from '../../../../interfaces';
import { CharSelectState } from '../../../../stores';
import { QuickSellItemFromInventory, SellItem, SendToStockpile } from '../../../../stores/mercantile/mercantile.actions';
import { setDiscordStatus } from '../../../helpers/electron';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit, OnDestroy {

  @Select(CharSelectState.activeCharacterInventory) inventory$!: Observable<IGameItem[]>;

  public activeCategory = '';
  public categorySub!: Subscription;

  constructor(private store: Store) { }

  ngOnInit() {
    this.categorySub = this.inventory$.subscribe(x => {
      if (this.hasNoItems(x)) {
        this.activeCategory = '';
        return;
      }

      this.activeCategory = this.itemCategories(x)[0];

      setDiscordStatus({
        state: 'Browsing their inventory...'
      });
    });
  }

  ngOnDestroy() {
    this.categorySub?.unsubscribe();
  }

  trackBy(index: number) {
    return index;
  }

  changeCategory(category: string) {
    this.activeCategory = category;
  }

  hasNoItems(items: IGameItem[]): boolean {
    return items.length === 0;
  }

  itemCategories(items: IGameItem[] = []): string[] {
    return sortBy(uniq(items.filter(x => (x?.quantity ?? 0) > 0).map(x => x.category)));
  }

  itemsInCategory(items: IGameItem[], category: string): IGameItem[] {
    return sortBy((items || []).filter(x => (x?.quantity ?? 0) > 0).filter(item => item.category === category), 'name');
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
