

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { append, patch, updateItem } from '@ngxs/store/operators';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { ItemCreatorService } from '../../app/services/item-creator.service';
import { ICharSelect, IGameItem, IPlayerCharacter, ItemType } from '../../interfaces';
import { UnlockAlchemy } from '../alchemy/alchemy.actions';
import { UnlockBlacksmithing } from '../blacksmithing/blacksmithing.actions';
import { UnlockCombat } from '../combat/combat.actions';
import { UnlockCooking } from '../cooking/cooking.actions';
import { UnlockFarming } from '../farming/farming.actions';
import { UnlockFishing } from '../fishing/fishing.actions';
import { NotifyError, NotifyInfo, NotifySuccess, NotifyWarning, UpdateAllItems } from '../game/game.actions';
import { UnlockHunting } from '../hunting/hunting.actions';
import { UnlockJewelcrafting } from '../jewelcrafting/jewelcrafting.actions';
import { UnlockMercantile } from '../mercantile/mercantile.actions';
import { UnlockMining } from '../mining/mining.actions';
import { UnlockProspecting } from '../prospecting/prospecting.actions';
import { UnlockWeaving } from '../weaving/weaving.actions';
import {
  BreakItem, DecreaseDurability, DiscoverResourceOrItem,
  GainItemOrResource, GainResources, SaveActiveCharacter
} from './charselect.actions';
import { attachments } from './charselect.attachments';
import { defaultCharSelect } from './charselect.functions';

@State<ICharSelect>({
  name: 'charselect',
  defaults: defaultCharSelect()
})
@Injectable()
export class CharSelectState {

  constructor(
    private store: Store,
    private itemCreatorService: ItemCreatorService
  ) {
    attachments.forEach(({ action, handler }) => {
      attachAction(CharSelectState, action, handler);
    });
  }

  @Selector()
  static characters(state: ICharSelect) {
    return state.characters;
  }

  @Selector()
  static activeCharacter(state: ICharSelect) {
    return state.characters[state.currentCharacter];
  }

  @Selector()
  static activeCharacterResources(state: ICharSelect) {
    return this.activeCharacter(state)?.resources ?? {};
  }

  @Selector()
  static activeCharacterCoins(state: ICharSelect): number {
    return this.activeCharacter(state)?.resources?.['Coin'] ?? 0;
  }

  @Selector()
  static activeCharacterInventory(state: ICharSelect) {
    return this.activeCharacter(state)?.inventory ?? {};
  }

  @Selector()
  static activeCharacterEquipment(state: ICharSelect) {
    return this.activeCharacter(state)?.equipment ?? {};
  }

  @Selector()
  static activeCharacterDiscoveries(state: ICharSelect) {
    return this.activeCharacter(state)?.discoveries ?? {};
  }

  @Action(UpdateAllItems)
  async updateAllItems(ctx: StateContext<ICharSelect>) {
    const state = ctx.getState();
    const characters = state.characters.map(char => {
      if(!char) {
        return;
      }

      const inventory = char.inventory.map((oldItem) => {

        // can't migrate an item with no id
        if(!oldItem.internalId) {
          return undefined;
        }

        const newItem = this.itemCreatorService.createItem(oldItem.internalId, oldItem.quantity);
        if(!newItem) {
          return undefined;
        }

        newItem.durability = oldItem.durability;
        newItem.stats = oldItem.stats;

        return newItem;
      }, []).filter(Boolean);

      const equipment = Object.keys(char.equipment).reduce((acc, key) => {
        const oldItem = char.equipment[key as ItemType];
        if(!oldItem) {
          return { ...acc };
        }

        // can't migrate an item with no id
        if(!oldItem.internalId) {
          return { ...acc };
        }

        const newItem = this.itemCreatorService.createItem(oldItem.internalId, oldItem.quantity);
        if(!newItem) {
          return { ...acc };
        }

        newItem.durability = oldItem.durability;
        newItem.stats = oldItem.stats;

        return { ...acc, [key]: newItem };
      }, {});

      return { ...char, inventory, equipment };
    });

    ctx.setState(patch({ characters }));
  }

  @Action(DiscoverResourceOrItem)
  async discoverResourceOrItem(ctx: StateContext<ICharSelect>, { itemName }: DiscoverResourceOrItem) {

    const state = ctx.getState();
    const activeCharacter = state.characters[state.currentCharacter];
    const discoveries = activeCharacter.discoveries || {};

    // attempt to unlock other content
    const checkDiscoveries = { ...discoveries, [itemName]: true };
    const checkSnapshot = this.store.snapshot();

    if(!checkSnapshot.fishing.unlocked && checkDiscoveries['Plant Fiber']) {
      ctx.dispatch([
        new UnlockFishing(),
        new NotifySuccess('You can now go fishing!')
      ]);
    }

    if(!checkSnapshot.hunting.unlocked && checkDiscoveries['Stone']) {
      ctx.dispatch([
        new UnlockHunting(),
        new NotifySuccess('You can now go hunting!')
      ]);
    }

    if(!checkSnapshot.mining.unlocked && checkDiscoveries['Pine Log']) {
      ctx.dispatch([
        new UnlockMining(),
        new NotifySuccess('You can now go mining!')
      ]);
    }

    if(!checkSnapshot.alchemy.unlocked && checkDiscoveries['Pine Needle'] && checkDiscoveries['Oven']) {
      ctx.dispatch([
        new UnlockAlchemy(),
        new NotifySuccess('You can now do alchemy!')
      ]);
    }

    if(!checkSnapshot.blacksmithing.unlocked && checkDiscoveries['Stone'] && checkDiscoveries['Pine Log']) {
      ctx.dispatch([
        new UnlockBlacksmithing(),
        new NotifySuccess('You can now do blacksmithing!')
      ]);
    }

    if(!checkSnapshot.cooking.unlocked && checkDiscoveries['Pinecone']) {
      ctx.dispatch([
        new UnlockCooking(),
        new NotifySuccess('You can now cook!')
      ]);
    }

    if(!checkSnapshot.jewelcrafting.unlocked && checkDiscoveries['Dandelion']) {
      ctx.dispatch([
        new UnlockJewelcrafting(),
        new NotifySuccess('You can now craft jewelry!')
      ]);
    }

    if(!checkSnapshot.weaving.unlocked && checkDiscoveries['Whorl']) {
      ctx.dispatch([
        new UnlockWeaving(),
        new NotifySuccess('You can now do weaving!')
      ]);
    }

    if(!checkSnapshot.combat.unlocked && checkDiscoveries['Stone Knife']) {
      ctx.dispatch([
        new UnlockCombat(),
        new NotifySuccess('You can now engage in combat!')
      ]);
    }

    if(!checkSnapshot.farming.unlocked && checkDiscoveries['Carrot Seed']) {
      ctx.dispatch([
        new UnlockFarming(),
        new NotifySuccess('You can now go farming!')
      ]);
    }

    if(!checkSnapshot.mercantile.unlocked && checkDiscoveries['Coin']) {
      ctx.dispatch([
        new UnlockMercantile(),
        new NotifySuccess('You can now engage in mercantile acts!')
      ]);
    }

    if(!checkSnapshot.prospecting.unlocked && checkDiscoveries['Stone']) {
      ctx.dispatch([
        new UnlockProspecting(),
        new NotifySuccess('You can now prospect stones for gems!')
      ]);
    }

    // save ourselves the patch
    if(discoveries[itemName]) {
      return;
    }

    ctx.setState(patch<ICharSelect>({
      characters: updateItem<IPlayerCharacter>(state.currentCharacter, patch<IPlayerCharacter>({
        discoveries: patch<Record<string, boolean>>({
          [itemName]: true
        })
      }))
    }));
  }

  @Action(GainResources)
  async gainResources(ctx: StateContext<ICharSelect>, { resources, shouldNotify }: GainResources) {

    if(!shouldNotify) {
      return;
    }

    const resourceNames = Object.keys(resources);
    const earnedNothing = resourceNames.length === 0 || (resourceNames.includes('nothing') && resourceNames.length === 1);

    if(earnedNothing) {
      ctx.dispatch(new NotifyWarning('You didn\'t get anything...'));
    }

    const earnedResources = Object.keys(resources).filter(x => x !== 'nothing').filter(x => resources[x] > 0);

    if(earnedResources.length === 0) {
      return;
    }

    // discover all of the resources
    ctx.dispatch(earnedResources.map(r => new DiscoverResourceOrItem(r)));

    const resStr = Object.keys(resources).map(key => `${resources[key]}x ${key}`).join(', ');
    ctx.dispatch(new NotifyInfo(`Gained ${resStr}!`));
  }

  @Action(GainItemOrResource)
  async gainItem(ctx: StateContext<ICharSelect>, { itemName, quantity }: GainItemOrResource) {

    const state = ctx.getState();
    const activeCharacter = state.characters[state.currentCharacter];

    if(itemName === 'nothing') {
      ctx.dispatch(new NotifyWarning('You didn\'t get anything...'));
      return;
    }

    // if it's a resource, gain that
    const isResource = this.itemCreatorService.isResource(itemName);
    if(isResource) {
      ctx.dispatch(new GainResources({ [itemName]: quantity }));
      return;
    }

    // otherwise, try to gain an item
    const createdItem = this.itemCreatorService.createItem(itemName, quantity);
    if(!createdItem) {
      ctx.dispatch(new NotifyWarning('You didn\'t get anything...'));
      return;
    }

    // discover the thing if it's an item (resources are handled elsewhere)
    ctx.dispatch(new DiscoverResourceOrItem(itemName));

    ctx.dispatch(new NotifyInfo(`Gained ${itemName} x${quantity}!`));

    const existingItem = activeCharacter.inventory.find(item => item.name === itemName);

    if(existingItem && createdItem.canStack) {
      ctx.setState(patch<ICharSelect>({
        characters: updateItem<IPlayerCharacter>(state.currentCharacter, patch<IPlayerCharacter>({
          inventory: updateItem<IGameItem>(
            (item) => item?.name === itemName,
            patch<IGameItem>({
              quantity: (existingItem.quantity ?? 1) + quantity
            })
          )
        }))
      }));

      return;
    }

    ctx.setState(patch<ICharSelect>({
      characters: updateItem<IPlayerCharacter>(state.currentCharacter, patch<IPlayerCharacter>({
        inventory: append<IGameItem>([createdItem])
      }))
    }));

    ctx.dispatch(new SaveActiveCharacter());
  }

  @Action(DecreaseDurability)
  decreaseDurability(ctx: StateContext<ICharSelect>, { slot }: DecreaseDurability) {

    const state = ctx.getState();
    const currentCharacter = state.characters[state.currentCharacter];
    if(!currentCharacter) {
      return;
    }

    const currentItem = currentCharacter.equipment[slot];
    if(!currentItem) {
      return;
    }

    // any value less than 0 will never break
    if(currentItem.durability < 0) {
      return;
    }

    const newDurability = Math.max(0, currentItem.durability - 1);

    // only break if it is freshly breaking
    if(currentItem.durability > 0 && newDurability <= 0) {
      ctx.dispatch([
        new BreakItem(slot),
        new NotifyError(`Your ${currentItem.name} broke!`)
      ]);
    }

    ctx.setState(patch<ICharSelect>({
      characters: updateItem<IPlayerCharacter>(state.currentCharacter, patch<IPlayerCharacter>({
        equipment: patch<Partial<Record<ItemType, IGameItem>>>({
          [slot]: patch<IGameItem>({
            durability: newDurability
          })
        })
      }))
    }));

    ctx.dispatch(new SaveActiveCharacter());
  }

}
