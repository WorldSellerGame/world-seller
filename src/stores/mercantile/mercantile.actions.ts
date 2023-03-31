import { IGameItem } from '../../interfaces';

export class UnlockMercantile {
  static type = '[Mercantile] Unlock';
}

export class GainMercantileLevels {
  static type = '[Mercantile] Gain Levels';
  constructor(public levels = 1) {}
}

export class GainCoins {
  static type = '[Mercantile] Gain Coins';
  constructor(public amount: number, public reason = 'Unknown') {}
}

export class SpendCoins {
  static type = '[Mercantile] Spend Coins';
  constructor(public amount: number, public reason = 'Unknown') {}
}

export class SellItem {
  static type = '[Mercantile] Sell Item';
  constructor(public item: IGameItem) {}
}

export class UnsellItem {
  static type = '[Mercantile] Unsell Item';
  constructor(public item: IGameItem) {}
}

export class SendToStockpile {
  static type = '[Mercantile] Send To Stockpile';
  constructor(public item: IGameItem) {}
}

export class SendManyItemsToStockpile {
  static type = '[Mercantile] Send Many Items To Stockpile';
  constructor(public items: IGameItem[]) {}
}

export class RemoveFromStockpile {
  static type = '[Mercantile] Remove From Stockpile';
  constructor(public item: IGameItem) {}
}

export class SendToInventory {
  static type = '[Mercantile] Send To Inventory';
  constructor(public item: IGameItem) {}
}

export class SendManyItemsToInventory {
  static type = '[Mercantile] Send Many Items To Inventory';
  constructor(public items: IGameItem[]) {}
}

export class QuickSellItemFromInventory {
  static type = '[Mercantile] Quick Sell Item From Inventory';
  constructor(public item: IGameItem) {}
}

export class QuickSellManyItemsFromInventory {
  static type = '[Mercantile] Quick Sell Many Items From Inventory';
  constructor(public items: IGameItem[]) {}
}

export class QuickSellItemFromStockpile {
  static type = '[Mercantile] Quick Sell Item From Stockpile';
  constructor(public item: IGameItem) {}
}

export class QuickSellManyItemsFromStockpile {
  static type = '[Mercantile] Quick Sell Many Items From Stockpile';
  constructor(public items: IGameItem[]) {}
}

export class QuickSellAllFromStockpile {
  static type = '[Mercantile] Quick Sell ALL From Stockpile';
  constructor() {}
}

export class UpgradeShopCounter {
  static type = '[Mercantile] Upgrade Shop Counter';
  constructor() {}
}

export class UpgradeShopRegister {
  static type = '[Mercantile] Upgrade Shop Register';
  constructor() {}
}

export class UpgradeShopDecorations {
  static type = '[Mercantile] Upgrade Shop Decorations';
  constructor() {}
}

export class UpgradeStockpileSize {
  static type = '[Mercantile] Upgrade Stockpile Size';
  constructor() {}
}

export class UpgradeWorkerSellRate {
  static type = '[Mercantile] Upgrade Worker Sell Rate';
  constructor() {}
}

export class RotateExchangeGoods {
  static type = '[Mercantile] Rotate Exchange Goods';
  constructor() {}
}

export class UpgradeExchange {
  static type = '[Mercantile] Upgrade Exchange';
  constructor() {}
}
