import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonPopover } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { sortBy, sum, uniq } from 'lodash';
import { LocalStorage } from 'ngx-webstorage';
import { Observable, Subscription } from 'rxjs';
import { IGameItem, IGameMercantileStockpile } from '../../../../../../interfaces';
import { CharSelectState, MercantileState } from '../../../../../../stores';
import { NotifyWarning } from '../../../../../../stores/game/game.actions';
import {
  QuickSellAllFromStockpile, QuickSellItemFromStockpile,
  QuickSellManyItemsFromStockpile,
  SellItem, SendManyItemsToInventory, SendToInventory, UpgradeStockpileSize, UpgradeWorkerSellRate
} from '../../../../../../stores/mercantile/mercantile.actions';
import {
  maxShopCounterSize, maxStockpileLevel,
  maxStockpileSizeUpgradeCost,
  maxWorkerSellLevel,
  maxWorkerSellUpgradeCost,
  shopRegisterMultiplier
} from '../../../../../../stores/mercantile/mercantile.functions';
import { itemValue } from '../../../../../helpers';

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

  public inventorySub!: Subscription;
  public itemCategories: string[] = [];
  public itemsByCategory: Record<string, IGameItem[]> = {};

  public isMultiSelect = false;
  public lastSelectedCategory = '';
  public lastSelectedIndex = -1;
  public itemsSelectedById: Record<string, boolean> = {};
  public itemsSelected: IGameItem[] = [];

  constructor(private store: Store) { }

  ngOnInit() {
    this.activeCategory ??= '';

    this.categorySub = this.stockpile$.subscribe(x => {
      const items = x.items;

      if(this.activeCategory && this.getItemsInCategory(items, this.activeCategory).length > 0) {
        return;
      }

      if (this.hasNoItems(items)) {
        this.activeCategory = '';
        return;
      }

      this.activeCategory = this.getItemCategories(items)[0];
    });

    this.inventorySub = this.stockpile$.subscribe(x => {
      const items = x.items;

      this.itemCategories = this.getItemCategories(items);
      this.itemsByCategory = {};

      this.itemCategories.forEach(cat => {
        this.itemsByCategory[cat] = this.getItemsInCategory(items, cat);
      });
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

  getItemCategories(items: IGameItem[] = []): string[] {
    return sortBy(uniq(items.filter(x => (x?.quantity ?? 0) > 0).map(x => x.category)));
  }

  getItemsInCategory(items: IGameItem[] = [], category: string): IGameItem[] {
    return sortBy(items.filter(x => (x?.quantity ?? 0) > 0).filter(item => item.category === category), 'name');
  }

  realSellValue(item: IGameItem) {
    return itemValue(item,
      shopRegisterMultiplier(this.store.selectSnapshot(state => state.mercantile.shop.saleBonusLevel ?? 0))) * (item.quantity ?? 1);
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

  canUpgradeWorkerSellRate(currentCoins: number, currentLevel: number): boolean {
    if(this.isWorkerRateMaxLevel(currentLevel)) {
      return false;
    }

    return currentCoins >= this.workerRateUpgradeCost(currentLevel);
  }

  isWorkerRateMaxLevel(currentLevel: number): boolean {
    return currentLevel >= maxWorkerSellLevel();
  }

  workerRateUpgradeCost(currentLevel: number) {
    return maxWorkerSellUpgradeCost(currentLevel);
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

  upgradeWorkerSellRate() {
    this.store.dispatch(new UpgradeWorkerSellRate());
  }

  openMenu(item: IGameItem, index: number, popover: IonPopover, $event: any) {
    $event.preventDefault();
    $event.stopPropagation();

    if(this.isMultiSelect) {
      if(item.category === this.lastSelectedCategory && $event.shiftKey) {
        this.shiftSelection(index);
        return;
      }

      this.toggleSelected(item, index);
      return;
    }

    if($event.ctrlKey && !this.isMultiSelect) {
      this.select(item, index);
      return;
    }

    popover.present($event);
  }

  select(item: IGameItem, index: number) {
    if(this.itemsSelectedById[item.id ?? '']) {
      return;
    }

    this.itemsSelected.push(item);
    this.itemsSelectedById[item.id ?? ''] = true;
    this.isMultiSelect = true;
    this.lastSelectedCategory = item.category;
    this.lastSelectedIndex = index;
  }

  unselect(item: IGameItem, index: number) {
    if(!this.itemsSelectedById[item.id ?? '']) {
      return;
    }

    this.itemsSelected = this.itemsSelected.filter(x => x !== item);
    this.itemsSelectedById[item.id ?? ''] = false;
    this.isMultiSelect = this.itemsSelected.length > 0;
    this.lastSelectedCategory = item.category;
    this.lastSelectedIndex = index;
  }

  selectAll() {
    Object.values(this.itemsByCategory).forEach(items => {
      items.forEach(item => {
        this.select(item, -1);
      });
    });
  }

  toggleSelected(item: IGameItem, index: number) {
    if(this.itemsSelectedById[item.id ?? '']) {
      this.unselect(item, index);
      return;
    }

    this.select(item, index);
  }

  shiftSelection(newIndex: number) {
    const isSelected = !this.itemsSelectedById[this.itemsByCategory[this.lastSelectedCategory][this.lastSelectedIndex].id ?? ''];

    const handleItem = (index: number) => {
      if(isSelected) {
        this.unselect(this.itemsByCategory[this.lastSelectedCategory][index], index);
        return;
      }

      this.select(this.itemsByCategory[this.lastSelectedCategory][index], index);
    };

    if(this.lastSelectedIndex < newIndex) {
      for(let i = this.lastSelectedIndex; i <= newIndex; i++) {
        handleItem(i);
      }
    }

    if(this.lastSelectedIndex > newIndex) {
      for(let i = this.lastSelectedIndex; i >= newIndex; i--) {
        handleItem(i);
      }
    }
  }

  quickSellValue() {
    return sum(this.itemsSelected.map(item => this.realSellValue(item)));
  }

  quickSellSelected() {
    this.store.dispatch(new QuickSellManyItemsFromStockpile(this.itemsSelected));
    this.clearSelected();
  }

  sendSelectedToInventory() {
    this.store.dispatch(new SendManyItemsToInventory(this.itemsSelected));
    this.clearSelected();
  }

  clearSelected() {
    this.isMultiSelect = false;
    this.itemsSelected = [];
    this.itemsSelectedById = {};
    this.lastSelectedCategory = '';
    this.lastSelectedIndex = -1;
  }

}
