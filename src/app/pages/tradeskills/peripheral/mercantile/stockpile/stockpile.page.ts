import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { sortBy, uniq } from 'lodash';
import { LocalStorage } from 'ngx-webstorage';
import { Observable, Subscription } from 'rxjs';
import { IGameItem, IGameMercantileStockpile } from '../../../../../../interfaces';
import { CharSelectState, MercantileState } from '../../../../../../stores';
import {
  QuickSellAllFromStockpile, QuickSellItemFromStockpile,
  SellItem, SendToInventory, UpgradeStockpileSize
} from '../../../../../../stores/mercantile/mercantile.actions';
import { maxShopCounterSize, maxStockpileLevel, maxStockpileSizeUpgradeCost } from '../../../../../../stores/mercantile/mercantile.functions';
import { NotifyWarning } from '../../../../../../stores/game/game.actions';

@Component({
  selector: 'app-stockpile',
  templateUrl: './stockpile.page.html',
  styleUrls: ['./stockpile.page.scss'],
})
export class StockpilePage implements OnInit, OnDestroy {

  @Select(MercantileState.stockpile) stockpile$!: Observable<IGameMercantileStockpile>;
  @Select(CharSelectState.activeCharacterCoins) coins$!: Observable<number>;
  @Select(MercantileState.stockpileInfo) stockpileInfo$!: Observable<{ current: number; max: number }>;

  @LocalStorage('currenttab-stockpile') public activeCategory!: string;
  public categorySub!: Subscription;

  constructor(private store: Store) { }

  ngOnInit() {
    this.activeCategory ??= '';

    this.categorySub = this.stockpile$.subscribe(x => {
      const items = x.items;

      if(this.activeCategory && this.itemsInCategory(items, this.activeCategory).length > 0) {
        return;
      }

      if (this.hasNoItems(items)) {
        this.activeCategory = '';
        return;
      }

      this.activeCategory = this.itemCategories(items)[0];
    });
  }

  ngOnDestroy() {
    this.categorySub?.unsubscribe();
  }

  trackBy<IGameItem>(index: number, item: IGameItem): string {
    return (item as any).id || index.toString();
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

  itemsInCategory(items: IGameItem[] = [], category: string): IGameItem[] {
    return sortBy(items.filter(x => (x?.quantity ?? 0) > 0).filter(item => item.category === category), 'name');
  }

  canUpgradeStorage(currentCoins: number, currentLevel: number): boolean {
    if(this.isStockpileStorageMaxLevel(currentLevel)) {
      return false;
    }

    return currentCoins >= this.stockpileStorageUpgradeCost(currentLevel);
  }

  isStockpileStorageMaxLevel(currentLevel: number): boolean {
    return currentLevel >= maxStockpileLevel();
  }

  stockpileStorageUpgradeCost(currentLevel: number) {
    return maxStockpileSizeUpgradeCost(currentLevel);
  }

  quickSell(item: IGameItem) {
    this.store.dispatch(new QuickSellItemFromStockpile(item));
  }

  quickSellAll() {
    this.store.dispatch(new QuickSellAllFromStockpile());
  }

  sell(item: IGameItem) {
    const state = this.store.snapshot().mercantile;
    const maxSize = maxShopCounterSize(state.shop.saleCounterLevel);
    if(state.shop.forSale.length >= maxSize) {
      this.store.dispatch(new NotifyWarning('You cannot sell any more items at this time!'));
      return;
    }

    this.store.dispatch(new SellItem(item));
  }

  sendToInventory(item: IGameItem) {
    this.store.dispatch(new SendToInventory(item));
  }

  upgradeStorage() {
    this.store.dispatch(new UpgradeStockpileSize());
  }

}
