

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, updateItem } from '@ngxs/store/operators';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { ItemCreatorService } from '../../app/services/item-creator.service';
import { NotifyService } from '../../app/services/notify.service';
import { ICharSelect, ICharacter, IGameItem, ItemType } from '../../interfaces';
import { DecreaseDurability, GainJobResult, GainResources, SaveActiveCharacter, UnequipItem } from './charselect.actions';
import { attachments } from './charselect.attachments';
import { defaultCharSelect } from './charselect.functions';

@State<ICharSelect>({
  name: 'charselect',
  defaults: defaultCharSelect()
})
@Injectable()
export class CharSelectState {

  constructor(
    private notifyService: NotifyService,
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

  @Action(GainResources)
  async gainResources(ctx: StateContext<ICharSelect>, { resources }: GainResources) {

    const resourceNames = Object.keys(resources);
    const earnedNothing = resourceNames.length === 0 || (resourceNames.includes('nothing') && resourceNames.length === 1);

    if(earnedNothing) {
      this.notifyService.warn('You didn\'t get anything...');
    }

    const earnedResources = Object.keys(resources).filter(x => x !== 'nothing').filter(x => resources[x] > 0);

    if(earnedResources.length === 0) {
      return;
    }

    const resStr = Object.keys(resources).map(key => `${resources[key]}x ${key}`).join(', ');
    this.notifyService.notify(`Gained ${resStr}!`);
  }

  @Action(GainJobResult)
  async gainItem(ctx: StateContext<ICharSelect>, { itemName, quantity }: GainJobResult) {

    if(itemName === 'nothing') {
      this.notifyService.warn('You didn\'t get anything...');
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
      this.notifyService.warn('You didn\'t get anything...');
      return;
    }

    this.notifyService.notify(`Gained ${itemName} x${quantity}!`);

    const state = ctx.getState();

    const existingItem = state.characters[state.currentCharacter].inventory.find(item => item.name === itemName);

    if(existingItem && createdItem.canStack) {
      ctx.setState(patch<ICharSelect>({
        characters: updateItem<ICharacter>(state.currentCharacter, patch<ICharacter>({
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
      characters: updateItem<ICharacter>(state.currentCharacter, patch<ICharacter>({
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
    if(newDurability <= 0) {
      ctx.dispatch(new UnequipItem(slot));
      this.notifyService.error(`Your ${currentItem.name} broke!`);
      return;
    }

    ctx.setState(patch<ICharSelect>({
      characters: updateItem<ICharacter>(state.currentCharacter, patch<ICharacter>({
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
