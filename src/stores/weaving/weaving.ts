

import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGameRefining } from '../../interfaces';
import { attachments } from './weaving.attachments';
import { defaultWeaving } from './weaving.functions';

@State<IGameRefining>({
  name: 'weaving',
  defaults: defaultWeaving()
})
@Injectable()
export class WeavingState {

  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(WeavingState, action, handler);
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

  @Selector()
  static options(state: IGameRefining) {
    return {
      hideDiscovered: state.hideDiscovered,
      hideNew: state.hideNew,
      hideHasIngredients: state.hideHasIngredients,
      hideHasNoIngredients: state.hideHasNoIngredients
    };
  }

}
