import { IGameItem } from './game';

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
}
