import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonPopover } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { sortBy, sum, uniq } from 'lodash';
import { LocalStorage } from 'ngx-webstorage';
import { Observable, Subscription } from 'rxjs';
import { IGameItem } from '../../../../interfaces';
import { CharSelectState, CombatState, MercantileState } from '../../../../stores';
import { OOCEatFood } from '../../../../stores/combat/combat.actions';
import { NotifyWarning } from '../../../../stores/game/game.actions';
import {
  QuickSellItemFromInventory, QuickSellManyItemsFromInventory,
  SellItem, SendManyItemsToStockpile, SendToStockpile
} from '../../../../stores/mercantile/mercantile.actions';
import { maxShopCounterSize, shopRegisterMultiplier } from '../../../../stores/mercantile/mercantile.functions';
import { itemValue } from '../../../helpers';
import { setDiscordStatus } from '../../../helpers/electron';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit, OnDestroy {

  @Select(CharSelectState.activeCharacterInventory) inventory$!: Observable<IGameItem[]>;
  @Select(CombatState.currentEncounter) encounter$!: Observable<any>;
  @Select(CombatState.currentDungeon) dungeon$!: Observable<any>;
  @Select(MercantileState.unlocked) mercantileUnlocked$!: Observable<boolean>;
  @Select(MercantileState.stockpileInfo) stockpileInfo$!: Observable<{ current: number; max: number }>;

  @LocalStorage('currenttab-inventory') public activeCategory!: string;
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

    setDiscordStatus({
      state: 'Browsing their inventory...'
    });

    this.categorySub = this.inventory$.subscribe(x => {
      if(this.activeCategory && this.getItemsInCategory(x, this.activeCategory).length > 0) {
        return;
      }

      if (this.hasNoItems(x)) {
        this.activeCategory = '';
        return;
      }

      this.activeCategory = this.getItemCategories(x)[0];
    });

    this.inventorySub = this.inventory$.subscribe(x => {
      this.itemCategories = this.getItemCategories(x);
      this.itemsByCategory = {};

      this.itemCategories.forEach(cat => {
        this.itemsByCategory[cat] = this.getItemsInCategory(x, cat);
      });
    });
  }

  ngOnDestroy() {
    this.categorySub?.unsubscribe();
    this.inventorySub?.unsubscribe();
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

  getItemsInCategory(items: IGameItem[], category: string): IGameItem[] {
    return sortBy((items || []).filter(x => (x?.quantity ?? 0) > 0).filter(item => item.category === category), 'name');
  }

  realSellValue(item: IGameItem) {
    return itemValue(item,
      shopRegisterMultiplier(this.store.selectSnapshot(state => state.mercantile.shop.saleBonusLevel ?? 0))) * (item.quantity ?? 1);
  }

  eat(item: IGameItem) {
    this.store.dispatch(new OOCEatFood(item));
  }

  quickSell(item: IGameItem) {
    this.store.dispatch(new QuickSellItemFromInventory(item));
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

  sendToStockpile(item: IGameItem) {
    this.store.dispatch(new SendToStockpile(item));
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
    this.store.dispatch(new QuickSellManyItemsFromInventory(this.itemsSelected));

    this.clearSelected();
  }

  sendSelectedToStockpile() {
    this.store.dispatch(new SendManyItemsToStockpile(this.itemsSelected));
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
