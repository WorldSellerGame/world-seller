

import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGameFarming, IGameProspecting } from '../../interfaces';
import { attachments } from './prospecting.attachments';
import { defaultProspecting } from './prospecting.functions';

@State<IGameProspecting>({
  name: 'prospecting',
  defaults: defaultProspecting()
})
@Injectable()
export class ProspectingState {

  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(ProspectingState, action, handler);
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

}
