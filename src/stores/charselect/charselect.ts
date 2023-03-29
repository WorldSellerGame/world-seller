

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { append, patch, updateItem } from '@ngxs/store/operators';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { ContentService } from '../../app/services/content.service';
import { ItemCreatorService } from '../../app/services/item-creator.service';
import { AchievementStat, ICharSelect, IGameItem, IPlayerCharacter, ItemType } from '../../interfaces';
import { IncrementStat } from '../achievements/achievements.actions';
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

  private hasSentNotifications: Record<string, boolean> = {};

  constructor(
    private store: Store,
    private contentService: ContentService,
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
    return { ...this.activeCharacter(state)?.resources ?? {} };
  }

  @Selector()
  static activeCharacterCoins(state: ICharSelect): number {
    return this.activeCharacter(state)?.resources?.['Coin'] ?? 0;
  }

  @Selector()
  static activeCharacterInventory(state: ICharSelect) {
    return this.activeCharacter(state)?.inventory ?? [];
  }

  @Selector()
  static activeCharacterInventoryUnlocked(state: ICharSelect) {
    return this.activeCharacter(state)?.inventoryUnlocked;
  }

  @Selector()
  static activeCharacterEquipment(state: ICharSelect) {
    return { ...this.activeCharacter(state)?.equipment ?? {} };
  }

  @Selector()
  static activeCharacterDiscoveries(state: ICharSelect) {
    return { ...this.activeCharacter(state)?.discoveries ?? {} };
  }

  @Action(UpdateAllItems)
  async updateAllItems(ctx: StateContext<ICharSelect>) {
    const state = ctx.getState();
    const characters = (state.characters || []).map(char => {
      if(!char) {
        return;
      }

      if(char.inventory.length > 0) {
        char.inventoryUnlocked = true;
      }

      // delete invalid resources
      const resources = (char.resources || {});
      Object.keys(resources).forEach(resource => {
        if(this.contentService.getResourceByName(resource)) {
          return;
        }

        delete resources[resource];
      });

      const inventory = (char.inventory || [])
        .map((oldItem) => this.itemCreatorService.migrateItem(oldItem))
        .filter(Boolean);

      const equipment = Object.keys(char.equipment).reduce((acc, key) => {
        const oldItem = char.equipment[key as ItemType];
        if(!oldItem) {
          return { ...acc };
        }

        const migratedItem = this.itemCreatorService.migrateItem(oldItem);
        if(!migratedItem) {
          return { ...acc };
        }

        return { ...acc, [key]: migratedItem };
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

    if(!activeCharacter.inventoryUnlocked && this.contentService.isItem(itemName)) {
      ctx.setState(patch<ICharSelect>({
        characters: updateItem<IPlayerCharacter>(state.currentCharacter, patch<IPlayerCharacter>({
          inventoryUnlocked: true
        }))
      }));
    }

    if(!checkSnapshot.fishing.unlocked && !this.hasSentNotifications['fishing'] && checkDiscoveries['Plant Fiber']) {
      this.hasSentNotifications['fishing'] = true;

      ctx.dispatch([
        new UnlockFishing(),
        new NotifySuccess('You can now go fishing!')
      ]);
    }

    if(!checkSnapshot.hunting.unlocked && !this.hasSentNotifications['hunting'] && checkDiscoveries['Stone']) {
      this.hasSentNotifications['hunting'] = true;

      ctx.dispatch([
        new UnlockHunting(),
        new NotifySuccess('You can now go hunting!')
      ]);
    }

    if(!checkSnapshot.mining.unlocked && !this.hasSentNotifications['mining'] && checkDiscoveries['Pine Log']) {
      this.hasSentNotifications['mining'] = true;

      ctx.dispatch([
        new UnlockMining(),
        new NotifySuccess('You can now go mining!')
      ]);
    }

    if(!checkSnapshot.alchemy.unlocked && !this.hasSentNotifications['alchemy'] && checkDiscoveries['Pine Needle'] && checkDiscoveries['Oven']) {
      this.hasSentNotifications['alchemy'] = true;

      ctx.dispatch([
        new UnlockAlchemy(),
        new NotifySuccess('You can now do alchemy!')
      ]);
    }

    if(!checkSnapshot.blacksmithing.unlocked && !this.hasSentNotifications['blacksmithing'] && checkDiscoveries['Stone'] && checkDiscoveries['Pine Log']) {
      this.hasSentNotifications['blacksmithing'] = true;

      ctx.dispatch([
        new UnlockBlacksmithing(),
        new NotifySuccess('You can now do blacksmithing!')
      ]);
    }

    if(!checkSnapshot.cooking.unlocked && !this.hasSentNotifications['cooking'] && checkDiscoveries['Pinecone']) {
      this.hasSentNotifications['cooking'] = true;

      ctx.dispatch([
        new UnlockCooking(),
        new NotifySuccess('You can now cook!')
      ]);
    }

    if(!checkSnapshot.jewelcrafting.unlocked && !this.hasSentNotifications['jewelcrafting'] && checkDiscoveries['Dandelion']) {
      this.hasSentNotifications['jewelcrafting'] = true;

      ctx.dispatch([
        new UnlockJewelcrafting(),
        new NotifySuccess('You can now craft jewelry!')
      ]);
    }

    if(!checkSnapshot.weaving.unlocked && !this.hasSentNotifications['weaving'] && checkDiscoveries['Whorl']) {
      this.hasSentNotifications['weaving'] = true;

      ctx.dispatch([
        new UnlockWeaving(),
        new NotifySuccess('You can now do weaving!')
      ]);
    }

    if(!checkSnapshot.combat.unlocked && !this.hasSentNotifications['combat'] && checkDiscoveries['Stone Knife']) {
      this.hasSentNotifications['combat'] = true;

      ctx.dispatch([
        new UnlockCombat(),
        new NotifySuccess('You can now engage in combat!')
      ]);
    }

    if(!checkSnapshot.farming.unlocked && !this.hasSentNotifications['farming'] && checkDiscoveries['Carrot Seed']) {
      this.hasSentNotifications['farming'] = true;

      ctx.dispatch([
        new UnlockFarming(),
        new NotifySuccess('You can now go farming!')
      ]);
    }

    if(!checkSnapshot.mercantile.unlocked && !this.hasSentNotifications['mercantile'] && checkDiscoveries['Coin']) {
      this.hasSentNotifications['mercantile'] = true;

      ctx.dispatch([
        new UnlockMercantile(),
        new NotifySuccess('You can now engage in mercantile acts!')
      ]);
    }

    if(!checkSnapshot.prospecting.unlocked && !this.hasSentNotifications['prospecting'] && checkDiscoveries['Stone']) {
      this.hasSentNotifications['prospecting'] = true;

      ctx.dispatch([
        new UnlockProspecting(),
        new NotifySuccess('You can now transmute!')
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

    const earnedResources = Object.keys(resources)
      .filter(x => x !== 'nothing')
      .filter(x => resources[x] > 0)
      .filter(x => this.contentService.isResource(x));

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

    if(itemName === 'nothing') {
      ctx.dispatch(new NotifyWarning('You didn\'t get anything...'));
      return;
    }

    if(!this.contentService.isItem(itemName) && !this.contentService.isResource(itemName)) {
      return;
    }

    const state = ctx.getState();
    const activeCharacter = state.characters[state.currentCharacter];

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
    ctx.dispatch([
      new NotifyInfo(`Gained ${itemName} x${quantity}!`),
      new DiscoverResourceOrItem(itemName),
      new IncrementStat(AchievementStat.ItemsGained, quantity)
    ]);

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
