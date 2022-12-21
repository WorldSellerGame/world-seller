

import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGameMining } from '../../interfaces';
import { attachments } from './mining.attachments';
import { defaultMining } from './mining.functions';

@State<IGameMining>({
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
  static level(state: IGameMining) {
    return state.level;
  }

  @Selector()
  static currentLocation(state: IGameMining) {
    if(!state.currentLocation) {
      return undefined;
    }

    return { location: state.currentLocation, duration: state.currentLocationDuration };
  }

}
