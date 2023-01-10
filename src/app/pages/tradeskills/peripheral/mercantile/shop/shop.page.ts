import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameItem, IGameMercantileShop, IGameWorkersMercantle } from '../../../../../../interfaces';
import { CharSelectState, MercantileState, WorkersState } from '../../../../../../stores';
import {
  SendToInventory, SendToStockpile, UnsellItem, UpgradeShopCounter,
  UpgradeShopDecorations, UpgradeShopRegister
} from '../../../../../../stores/mercantile/mercantile.actions';
import {
  maxShopCounterLevel, maxShopCounterSize, maxShopCounterUpgradeCost, maxShopDecorationLevel,
  maxShopDecorationUpgradeCost, maxShopRegisterLevel,
  maxShopRegisterUpgradeCost
} from '../../../../../../stores/mercantile/mercantile.functions';
import { AssignMercantileWorker, UnassignMercantileWorker } from '../../../../../../stores/workers/workers.actions';
import { maxMercantileWorkers } from '../../../../../../stores/workers/workers.functions';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {

  @Select(MercantileState.shop) shop$!: Observable<IGameMercantileShop>;
  @Select(MercantileState.shopCounterInfo) shopCounter$!: Observable<{ current: number; max: number }>;
  @Select(CharSelectState.activeCharacterCoins) coins$!: Observable<number>;
  @Select(WorkersState.mercantileWorkers) mercantileWorkers$!: Observable<{
    workerAllocations: IGameWorkersMercantle[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  // register functions
  canUpgradeRegister(currentCoins: number, currentLevel: number): boolean {
    if(this.isRegisterMaxLevel(currentLevel)) {
      return false;
    }

    return currentCoins >= this.registerUpgradeCost(currentLevel);
  }

  isRegisterMaxLevel(currentLevel: number): boolean {
    return currentLevel >= maxShopRegisterLevel();
  }

  registerUpgradeCost(currentLevel: number) {
    return maxShopRegisterUpgradeCost(currentLevel);
  }

  upgradeRegister() {
    this.store.dispatch(new UpgradeShopRegister());
  }

  // decoration functions
  canUpgradeDecorations(currentCoins: number, currentLevel: number): boolean {
    if(this.isDecorationsMaxLevel(currentLevel)) {
      return false;
    }

    return currentCoins >= this.decorationsUpgradeCost(currentLevel);
  }

  isDecorationsMaxLevel(currentLevel: number): boolean {
    return currentLevel >= maxShopDecorationLevel();
  }

  decorationsUpgradeCost(currentLevel: number) {
    return maxShopDecorationUpgradeCost(currentLevel);
  }

  upgradeDecorations() {
    this.store.dispatch(new UpgradeShopDecorations());
  }

  // counter functions
  canUpgradeCounter(currentCoins: number, currentLevel: number): boolean {
    if(this.isCounterMaxLevel(currentLevel)) {
      return false;
    }

    return currentCoins >= this.counterUpgradeCost(currentLevel);
  }

  isCounterMaxLevel(currentLevel: number): boolean {
    return currentLevel >= maxShopCounterLevel();
  }

  counterUpgradeCost(currentLevel: number) {
    return maxShopCounterUpgradeCost(currentLevel);
  }

  upgradeCounter() {
    this.store.dispatch(new UpgradeShopCounter());
  }

  maxShopCounterSize(currentLevel: number) {
    return maxShopCounterSize(currentLevel);
  }

  // worker functions
  allocateWorker() {
    this.store.dispatch(new AssignMercantileWorker());
  }

  unallocateWorker() {
    this.store.dispatch(new UnassignMercantileWorker());
  }

  maxWorkers() {
    return maxMercantileWorkers();
  }

  // misc functions
  saleToStockpile(item: IGameItem) {
    this.store.dispatch(new UnsellItem(item));
    this.store.dispatch(new SendToStockpile(item));
  }

  saleToInventory(item: IGameItem) {
    this.store.dispatch(new UnsellItem(item));
    this.store.dispatch(new SendToInventory(item));
  }

}
