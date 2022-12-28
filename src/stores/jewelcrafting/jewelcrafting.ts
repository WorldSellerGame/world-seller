

import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGameRefining } from '../../interfaces';
import { attachments } from './jewelcrafting.attachments';
import { defaultJewelcrafting } from './jewelcrafting.functions';

@State<IGameRefining>({
  name: 'jewelcrafting',
  defaults: defaultJewelcrafting()
})
@Injectable()
export class JewelcraftingState {

  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(JewelcraftingState, action, handler);
    });
  }

  @Selector()
  static level(state: IGameRefining) {
    return state.level;
  }

  @Selector()
  static currentQueue(state: IGameRefining) {
    return { queue: state.recipeQueue, size: state.queueSize };
  }

}
