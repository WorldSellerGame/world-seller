

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, updateItem } from '@ngxs/store/operators';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { ItemCreatorService } from '../../app/services/item-creator.service';
import { ICharSelect, IGameItem, IPlayerCharacter, ItemType } from '../../interfaces';
import { NotifyError, NotifyInfo, NotifyWarning, UpdateAllItems } from '../game/game.actions';
import { BreakItem, DecreaseDurability, GainJobResult, GainResources, SaveActiveCharacter } from './charselect.actions';
import { attachments } from './charselect.attachments';
import { defaultCharSelect } from './charselect.functions';

@State<ICharSelect>({
  name: 'charselect',
  defaults: defaultCharSelect()
})
@Injectable()
export class CharSelectState {

  constructor(
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

  @Action(UpdateAllItems)
  async updateAllItems(ctx: StateContext<ICharSelect>) {
    const state = ctx.getState();
    const characters = state.characters.map(char => {

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

    const resStr = Object.keys(resources).map(key => `${resources[key]}x ${key}`).join(', ');
    ctx.dispatch(new NotifyInfo(`Gained ${resStr}!`));
  }

  @Action(GainJobResult)
  async gainItem(ctx: StateContext<ICharSelect>, { itemName, quantity }: GainJobResult) {

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

    ctx.dispatch(new NotifyInfo(`Gained ${itemName} x${quantity}!`));

    const state = ctx.getState();

    const existingItem = state.characters[state.currentCharacter].inventory.find(item => item.name === itemName);

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
