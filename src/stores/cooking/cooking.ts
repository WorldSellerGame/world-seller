

import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGameRefining } from '../../interfaces';
import { attachments } from './cooking.attachments';
import { defaultCooking } from './cooking.functions';

@State<IGameRefining>({
  name: 'cooking',
  defaults: defaultCooking()
})
@Injectable()
export class CookingState {

  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(CookingState, action, handler);
    });
  }

  @Selector()
  static level(state: IGameRefining) {
    return state.level;
  }

  @Selector()
  static currentQueue(state: IGameRefining) {
    return state.recipeQueue;
  }

}
