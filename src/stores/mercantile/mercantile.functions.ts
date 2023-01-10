import { StateContext } from '@ngxs/store';

import { append, patch, removeItem } from '@ngxs/store/operators';
import { random, sum } from 'lodash';
import { IGameItem, IGameMercantile, IGameMercantileShop, IGameMercantileStockpile } from '../../interfaces';
import { GainResources } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import {
  GainCoins, QuickSellItemFromInventory, QuickSellItemFromStockpile,
  SellItem, SendToInventory, SendToStockpile, SpendCoins, UnsellItem
} from './mercantile.actions';

export const defaultMercantile: () => IGameMercantile = () => ({
  version: 0,
  level: 0,
  shop: {
    forSale: [],
    saleCounterLevel: 0,
    saleBonusLevel: 0,
    decorationsLevel: 0
  },
  stockpile: {
    items: [],
    limitLevel: 0
  }
});

// register functions
export function maxShopRegisterLevel() {
  return 10;
}

export function maxShopRegisterUpgradeCost(currentLevel: number): number {
  return 10000 * (currentLevel + 1);
}

export function shopRegisterMultiplier(currentLevel: number): number {
  return currentLevel * 0.1;
}

// decoration functions
export function maxShopDecorationLevel() {
  return 3;
}

export function maxShopDecorationUpgradeCost(currentLevel: number): number {
  return 100000 * (currentLevel + 1);
}

export function shopSaleDecorationReduction(currentLevel: number): number {
  return currentLevel * 0.05;
}

// sale counter functions
export function maxShopCounterLevel() {
  return 7;
}

export function maxShopCounterUpgradeCost(currentLevel: number): number {
  return 5000 * (currentLevel + 1);
}

export function maxShopCounterSize(saleCounterLevel: number): number {
  return 3 + (saleCounterLevel);
}

// stockpile functions
export function maxStockpileLevel() {
  return 90;
}

export function maxStockpileSizeUpgradeCost(currentLevel: number): number {
  return 1000 * (currentLevel + 1);
}

export function maxStockpileSize(limitLevel: number): number {
  return 100 + (limitLevel * 10);
}

// item functions
export function itemValue(item: IGameItem, multiplier = 1): number {
  return multiplier * (item.quantity ?? 1) * (item.value ?? 1);
}

export function shouldSellItem(item: IGameItem, reductionMultiplier = 0): boolean {
  const ticks = item.sellTicks ?? 0;
  const value = item.value ?? 1;

  const sellProbability = Math.min(100, Math.floor((reductionMultiplier + (ticks / value)) * 100));

  // they can't sell this early
  if(sellProbability < 25) {
    return false;
  }

  // random chance of selling anywhere after it's been listed for 25% of it's max duration
  // the chance is 1..300 instead of 1..100 to make it a bit harder to get something in the range
  if(random(1, 300) < sellProbability) {
    return true;
  }

  return ticks >= value;
}

// mercantile functions
export function resetMercantile(ctx: StateContext<IGameMercantile>) {
  ctx.setState(defaultMercantile());
}

export function gainCoins(ctx: StateContext<any>, { amount }: GainCoins) {
  if(amount === 0) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  ctx.dispatch(new GainResources({ Coin: amount }));
}

export function spendCoins(ctx: StateContext<any>, { amount }: SpendCoins) {
  gainCoins(ctx, { amount: -amount });
}

export function decreaseDuration(ctx: StateContext<IGameMercantile>, { ticks }: TickTimer) {
  const state = ctx.getState();

  const soldItems: IGameItem[] = [];

  const items = state.shop.forSale;
  items.forEach(item => {
    item.sellTicks ??= 0;
    item.sellTicks += ticks;

    if(shouldSellItem(item)) {
      soldItems.push(item);
    }
  });

  const soldValue = sum(soldItems.map(item => itemValue(item, 1 + 2 + shopRegisterMultiplier(state.level))));
  gainCoins(ctx, { amount: soldValue });

  const newItems = items.filter(item => !soldItems.includes(item));

  ctx.setState(patch<IGameMercantile>({
    shop: patch<IGameMercantileShop>({
      forSale: newItems
    })
  }));
}

export function sendToStockpile(ctx: StateContext<IGameMercantile>, { item }: SendToStockpile) {
  const state = ctx.getState();

  const maxSize = maxStockpileSize(state.stockpile.limitLevel);
  if(state.stockpile.items.length >= maxSize) {
    gainCoins(ctx, { amount: itemValue(item) });
    return;
  }

  ctx.setState(patch<IGameMercantile>({
    stockpile: patch<IGameMercantileStockpile>({
      items: append<IGameItem>([item])
    })
  }));
}

export function removeFromStockpile(ctx: StateContext<IGameMercantile>, { item }: SendToInventory) {
  const state = ctx.getState();

  ctx.setState(patch<IGameMercantile>({
    stockpile: patch<IGameMercantileStockpile>({
      items: removeItem<IGameItem>(state.stockpile.items.indexOf(item))
    })
  }));

}

export function sellItem(ctx: StateContext<IGameMercantile>, { item }: SellItem) {
  const state = ctx.getState();

  const maxSize = maxShopCounterSize(state.shop.saleCounterLevel);
  if(state.shop.forSale.length >= maxSize) {
    gainCoins(ctx, { amount: itemValue(item) });
    return;
  }

  item.sellTicks = 0;

  ctx.setState(patch<IGameMercantile>({
    shop: patch<IGameMercantileShop>({
      forSale: append<IGameItem>([item])
    })
  }));

  removeFromStockpile(ctx, { item });
}

export function unsellItem(ctx: StateContext<IGameMercantile>, { item }: UnsellItem) {
  const state = ctx.getState();

  ctx.setState(patch<IGameMercantile>({
    shop: patch<IGameMercantileShop>({
      forSale: removeItem<IGameItem>(state.shop.forSale.indexOf(item))
    })
  }));
}

export function quickSellFromInventory(ctx: StateContext<IGameMercantile>, { item }: QuickSellItemFromInventory) {
  gainCoins(ctx, { amount: itemValue(item) });
}

export function quickSellItemFromStockpile(ctx: StateContext<IGameMercantile>, { item }: QuickSellItemFromStockpile) {
  gainCoins(ctx, { amount: itemValue(item) });
  removeFromStockpile(ctx, { item });
}

export function quickSellAllFromStockpile(ctx: StateContext<IGameMercantile>) {
  const state = ctx.getState();

  const value = sum(state.stockpile.items.map(item => itemValue(item)));

  gainCoins(ctx, { amount: value });

  ctx.setState(patch<IGameMercantile>({
    stockpile: patch<IGameMercantileStockpile>({
      items: []
    })
  }));
}

export function upgradeStockpileSize(ctx: StateContext<IGameMercantile>) {
  const state = ctx.getState();

  if(state.stockpile.limitLevel >= maxStockpileLevel()) {
    return;
  }

  const cost = maxStockpileSizeUpgradeCost(state.stockpile.limitLevel);
  spendCoins(ctx, { amount: cost });

  ctx.setState(patch<IGameMercantile>({
    stockpile: patch<IGameMercantileStockpile>({
      limitLevel: state.stockpile.limitLevel + 1
    })
  }));
}

export function upgradeShopRegister(ctx: StateContext<IGameMercantile>) {
  const state = ctx.getState();

  if(state.shop.saleBonusLevel >= maxShopRegisterLevel()) {
    return;
  }

  const cost = maxShopRegisterUpgradeCost(state.shop.saleBonusLevel);
  spendCoins(ctx, { amount: cost });

  ctx.setState(patch<IGameMercantile>({
    shop: patch<IGameMercantileShop>({
      saleBonusLevel: state.shop.saleBonusLevel + 1
    })
  }));
}

export function upgradeShopDecorations(ctx: StateContext<IGameMercantile>) {
  const state = ctx.getState();

  if(state.shop.decorationsLevel >= maxShopDecorationLevel()) {
    return;
  }

  const cost = maxShopDecorationUpgradeCost(state.shop.decorationsLevel);
  spendCoins(ctx, { amount: cost });

  ctx.setState(patch<IGameMercantile>({
    shop: patch<IGameMercantileShop>({
      decorationsLevel: state.shop.decorationsLevel + 1
    })
  }));
}

export function upgradeShopCounter(ctx: StateContext<IGameMercantile>) {
  const state = ctx.getState();

  if(state.shop.saleCounterLevel >= maxShopCounterLevel()) {
    return;
  }

  const cost = maxShopCounterUpgradeCost(state.shop.saleCounterLevel);
  spendCoins(ctx, { amount: cost });

  ctx.setState(patch<IGameMercantile>({
    shop: patch<IGameMercantileShop>({
      saleCounterLevel: state.shop.saleCounterLevel + 1
    })
  }));
}
