

import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGameMercantile } from '../../interfaces';
import { attachments } from './mercantile.attachments';
import { defaultMercantile, maxShopCounterSize, maxStockpileSize } from './mercantile.functions';

@State<IGameMercantile>({
  name: 'mercantile',
  defaults: defaultMercantile()
})
@Injectable()
export class MercantileState {

  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(MercantileState, action, handler);
    });
  }

  @Selector()
  static level(state: IGameMercantile) {
    return state.level;
  }

  @Selector()
  static shop(state: IGameMercantile) {
    return state.shop;
  }

  @Selector()
  static stockpile(state: IGameMercantile) {
    return state.stockpile;
  }

  @Selector()
  static shopCounterInfo(state: IGameMercantile) {
    return { current: state.shop.forSale.length, max: maxShopCounterSize(state.shop.saleCounterLevel) };
  }

  @Selector()
  static stockpileInfo(state: IGameMercantile) {
    return { current: state.stockpile.items.length, max: maxStockpileSize(state.stockpile.limitLevel) };
  }

}
