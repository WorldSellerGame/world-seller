

import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGameFarming } from '../../interfaces';
import { attachments } from './farming.attachments';
import { defaultFarming } from './farming.functions';

@State<IGameFarming>({
  name: 'farming',
  defaults: defaultFarming()
})
@Injectable()
export class FarmingState {

  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(FarmingState, action, handler);
    });
  }

  @Selector()
  static level(state: IGameFarming) {
    return state.level;
  }

  @Selector()
  static plotInfo(state: IGameFarming) {
    return { maxPlots: state.maxPlots, plots: state.plots };
  }

  @Selector()
  static upgrades(state: IGameFarming) {
    return { workerUpgradeLevel: state.workerUpgradeLevel || 0 };
  }

}
