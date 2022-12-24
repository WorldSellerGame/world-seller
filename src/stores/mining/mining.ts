

import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGameGathering } from '../../interfaces';
import { attachments } from './mining.attachments';
import { defaultMining } from './mining.functions';

@State<IGameGathering>({
  name: 'mining',
  defaults: defaultMining()
})
@Injectable()
export class MiningState {

  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(MiningState, action, handler);
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

  @Selector()
  static cooldowns(state: IGameGathering) {
    return state.cooldowns;
  }

}
