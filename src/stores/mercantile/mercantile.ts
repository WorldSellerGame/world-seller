

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { ItemCreatorService } from '../../app/services/item-creator.service';
import { NotifyService } from '../../app/services/notify.service';
import { IGameMercantile } from '../../interfaces';
import { GainResources, WorkerCreateItem } from '../charselect/charselect.actions';
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
