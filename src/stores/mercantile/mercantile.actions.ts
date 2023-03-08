import { IGameItem } from '../../interfaces';

export class UnlockMercantile {
  static type = '[Mercantile] Unlock';
}

export class GainCoins {
  static type = '[Mercantile] Gain Coins';
  constructor(public amount: number) {}
}

export class SpendCoins {
  static type = '[Mercantile] Spend Coins';
  constructor(public amount: number) {}
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

export class SendToInventory {
  static type = '[Mercantile] Send To Inventory';
  constructor(public item: IGameItem) {}
}

export class QuickSellItemFromInventory {
  static type = '[Mercantile] Quick Sell Item From Inventory';
  constructor(public item: IGameItem) {}
}

export class QuickSellItemFromStockpile {
  static type = '[Mercantile] Quick Sell Item From Stockpile';
  constructor(public item: IGameItem) {}
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

export class RotateExchangeGoods {
  static type = '[Mercantile] Rotate Exchange Goods';
  constructor() {}
}

export class UpgradeExchange {
  static type = '[Mercantile] Upgrade Exchange';
  constructor() {}
}
