

import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGameGathering } from '../../interfaces';
import { attachments } from './logging.attachments';
import { defaultLogging } from './logging.functions';

@State<IGameGathering>({
  name: 'logging',
  defaults: defaultLogging()
})
@Injectable()
export class LoggingState {

  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(LoggingState, action, handler);
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
