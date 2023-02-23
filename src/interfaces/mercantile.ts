import { IGameItem } from './game';

export interface IGameMercantileExchangeItem {
  costItem: string;
  forItem: string;
}

export interface IGameMercantileExchange {
  items: IGameMercantileExchangeItem[];
  currentTick: number;
  lastPaidForRotate: number;
  exchangeLevel: number;
}

export interface IGameMercantileShop {
  forSale: IGameItem[];
  saleCounterLevel: number;
  saleBonusLevel: number;
  decorationsLevel: number;
}

export interface IGameMercantileStockpile {
  items: IGameItem[];
  limitLevel: number;
}

export interface IGameMercantile {
  version: number;
  unlocked: boolean;
  level: number;

  shop: IGameMercantileShop;
  stockpile: IGameMercantileStockpile;
  exchange: IGameMercantileExchange;
}
