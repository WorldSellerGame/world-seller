import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { sortBy, uniq } from 'lodash';
import { LocalStorage } from 'ngx-webstorage';
import { Observable, Subscription } from 'rxjs';
import { IGameItem } from '../../../../interfaces';
import { CharSelectState, CombatState, MercantileState } from '../../../../stores';
import { OOCEatFood } from '../../../../stores/combat/combat.actions';
import { NotifyWarning } from '../../../../stores/game/game.actions';
import { QuickSellItemFromInventory, SellItem, SendToStockpile } from '../../../../stores/mercantile/mercantile.actions';
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

  @LocalStorage('currenttab-inventory') public activeCategory!: string;
  public categorySub!: Subscription;

  constructor(private store: Store) { }

  ngOnInit() {
    this.activeCategory ??= '';

    setDiscordStatus({
      state: 'Browsing their inventory...'
    });

    this.categorySub = this.inventory$.subscribe(x => {
      if(this.activeCategory && this.itemsInCategory(x, this.activeCategory).length > 0) {
        return;
      }

      if (this.hasNoItems(x)) {
        this.activeCategory = '';
        return;
      }

      this.activeCategory = this.itemCategories(x)[0];
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

  itemsInCategory(items: IGameItem[], category: string): IGameItem[] {
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

}
