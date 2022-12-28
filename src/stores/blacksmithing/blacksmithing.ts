

import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGameRefining } from '../../interfaces';
import { attachments } from './blacksmithing.attachments';
import { defaultBlacksmithing } from './blacksmithing.functions';

@State<IGameRefining>({
  name: 'blacksmithing',
  defaults: defaultBlacksmithing()
})
@Injectable()
export class BlacksmithingState {

  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(BlacksmithingState, action, handler);
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
