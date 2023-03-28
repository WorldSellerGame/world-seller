

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { sample, sampleSize } from 'lodash';
import { ContentService } from '../../app/services/content.service';
import { ItemCreatorService } from '../../app/services/item-creator.service';
import { IGameMercantile, IGameMercantileExchange, IGameMercantileExchangeItem } from '../../interfaces';
import { GainResources, WorkerCreateItem } from '../charselect/charselect.actions';
import { NotifyInfo, TickTimer, UpdateAllItems } from '../game/game.actions';
import { SendToStockpile } from './mercantile.actions';
import { attachments } from './mercantile.attachments';
import { defaultMercantile, exchangeTicks, maxShopCounterSize, maxStockpileSize, totalExchangeItems } from './mercantile.functions';

@State<IGameMercantile>({
  name: 'mercantile',
  defaults: defaultMercantile()
})
@Injectable()
export class MercantileState {

  constructor(private store: Store, private contentService: ContentService, private itemCreatorService: ItemCreatorService) {
    attachments.forEach(({ action, handler }) => {
      attachAction(MercantileState, action, handler);
    });
  }

  @Selector()
  static unlocked(state: IGameMercantile) {
    return state.unlocked;
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
  static exchange(state: IGameMercantile) {
    return state.exchange;
  }

  @Selector()
  static shopCounterInfo(state: IGameMercantile) {
    return { current: state.shop.forSale.length, max: maxShopCounterSize(state.shop.saleCounterLevel) };
  }

  @Selector()
  static stockpileInfo(state: IGameMercantile) {
    return { current: state.stockpile.items.length, max: maxStockpileSize(state.stockpile.limitLevel) };
  }

  private pickResourcesBasedOnDiscoveries(itemCount: number): IGameMercantileExchangeItem[] {
    const store = this.store.snapshot();
    const discoveries = store.charselect.characters[store.charselect.currentCharacter].discoveries || {};

    let validResources = Object.keys(discoveries).filter(disc => this.contentService.isResource(disc));
    if(validResources.length === 0) {
      validResources = ['Dandelion', 'Pine Log', 'Plant Fiber'];
    }

    validResources = validResources.filter(x => x !== 'Coin');

    const exchangees = sampleSize(validResources, itemCount);

    return exchangees.map(resourceName => ({
      costItem: sample(validResources.filter(x => x !== resourceName)) as string,
      forItem: resourceName
    }));
  }

  @Action(UpdateAllItems)
  async updateAllItems(ctx: StateContext<IGameMercantile>) {
    const state = ctx.getState();

    const shopItems = (state.shop.forSale || []).map(item => {
      const baseItem = this.itemCreatorService.createItem(item.internalId || '');
      if(!baseItem) {
        return undefined;
      }

      return {
        ...item,
        ...baseItem
      };
    }).filter(Boolean);

    const stockpileItems = (state.stockpile.items || []).map(item => {
      const baseItem = this.itemCreatorService.createItem(item.internalId || '');
      if(!baseItem) {
        return undefined;
      }

      return {
        ...item,
        ...baseItem
      };
    }).filter(Boolean);

    const exchangeOffers = (state.exchange.items || []).map(item => {
      if(!this.contentService.getResourceByName(item.costItem)) {
        return undefined;
      }

      if(!this.contentService.getResourceByName(item.forItem)) {
        return undefined;
      }

      return item;
    }).filter(Boolean);

    ctx.setState(patch<IGameMercantile>({
      shop: patch({
        forSale: shopItems,
      }),
      stockpile: patch({
        items: stockpileItems,
      }),
      exchange: patch({
        items: exchangeOffers
      })
    }));
  }

  @Action(TickTimer)
  async tickTimer(ctx: StateContext<IGameMercantile>, { ticks }: TickTimer) {
    const state = ctx.getState();

    const totalItems = totalExchangeItems(state.exchange.exchangeLevel);

    // default stuff
    if(!state.exchange.items || state.exchange.items.length < totalItems) {
      const items = this.pickResourcesBasedOnDiscoveries(totalItems);

      ctx.setState(patch<IGameMercantile>({
        exchange: patch<IGameMercantileExchange>({
          items
        })
      }));

      return;
    }

    const nextTicks = state.exchange.currentTick - ticks;
    if(nextTicks < 0) {
      const items = this.pickResourcesBasedOnDiscoveries(totalItems);

      ctx.setState(patch<IGameMercantile>({
        exchange: patch<IGameMercantileExchange>({
          items,
          lastPaidForRotate: 0,
          currentTick: exchangeTicks()
        })
      }));

      return;
    }

    ctx.setState(patch<IGameMercantile>({
      exchange: patch<IGameMercantileExchange>({
        currentTick: nextTicks
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

    ctx.dispatch([
      new NotifyInfo(`Workers made ${itemName} x${quantity} and put it in your stockpile!`),
      new SendToStockpile(createdItem)
    ]);
  }

}
