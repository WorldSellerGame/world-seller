

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { ItemCreatorService } from '../../app/services/item-creator.service';
import { NotifyService } from '../../app/services/notify.service';
import { IGameMercantile } from '../../interfaces';
import { GainResources, WorkerCreateItem } from '../charselect/charselect.actions';
import { UpdateAllItems } from '../game/game.actions';
import { SendToStockpile } from './mercantile.actions';
import { attachments } from './mercantile.attachments';
import { defaultMercantile, maxShopCounterSize, maxStockpileSize } from './mercantile.functions';

@State<IGameMercantile>({
  name: 'mercantile',
  defaults: defaultMercantile()
})
@Injectable()
export class MercantileState {

  constructor(private itemCreatorService: ItemCreatorService, private notifyService: NotifyService) {
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

  @Action(UpdateAllItems)
  async updateAllItems(ctx: StateContext<IGameMercantile>) {
    const state = ctx.getState();

    const shopItems = state.shop.forSale.map(item => {
      const baseItem = this.itemCreatorService.createItem(item.internalId || '');
      if(!baseItem) {
        return undefined;
      }

      return {
        ...item,
        ...baseItem
      };
    }).filter(Boolean);

    const stockpileItems = state.stockpile.items.map(item => {
      const baseItem = this.itemCreatorService.createItem(item.internalId || '');
      if(!baseItem) {
        return undefined;
      }

      return {
        ...item,
        ...baseItem
      };
    }).filter(Boolean);

    ctx.setState(patch<IGameMercantile>({
      shop: patch({
        forSale: shopItems,
      }),
      stockpile: patch({
        items: stockpileItems,
      })
    }));
  }

  @Action(WorkerCreateItem)
  async gainItemFromWorker(ctx: StateContext<IGameMercantile>, { itemName, quantity }: WorkerCreateItem) {

    if(itemName === 'nothing') {
      return;
    }

    // if it's a resource, gain that
    const isResource = this.itemCreatorService.isResource(itemName);
    if(isResource) {
      ctx.dispatch(new GainResources({ [itemName]: quantity }));
      return;
    }

    // try to gain an item
    const createdItem = this.itemCreatorService.createItem(itemName, quantity);
    if(!createdItem) {
      return;
    }

    this.notifyService.notify(`Gained ${itemName} x${quantity}!`);

    ctx.dispatch(new SendToStockpile(createdItem));
  }

}
