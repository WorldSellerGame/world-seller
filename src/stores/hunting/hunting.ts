

import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGameGathering } from '../../interfaces';
import { attachments } from './hunting.attachments';
import { defaultHunting } from './hunting.functions';

@State<IGameGathering>({
  name: 'hunting',
  defaults: defaultHunting()
})
@Injectable()
export class HuntingState {

  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(HuntingState, action, handler);
    });
  }

  @Selector()
  static level(state: IGameGathering) {
    return state.level;
  }

  @Selector()
  static currentLocation(state: IGameGathering) {
    if(!state.currentLocation) {
      return undefined;
    }

    return { location: state.currentLocation, duration: state.currentLocationDuration };
  }

}
