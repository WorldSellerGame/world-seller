

import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGameRefining } from '../../interfaces';
import { attachments } from './alchemy.attachments';
import { defaultAlchemy } from './alchemy.functions';

@State<IGameRefining>({
  name: 'alchemy',
  defaults: defaultAlchemy()
})
@Injectable()
export class AlchemyState {

  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(AlchemyState, action, handler);
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
