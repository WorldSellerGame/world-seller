

import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { GameOption, IOptions } from '../../interfaces';
import { attachments } from './options.attachments';
import { defaultOptions } from './options.functions';

@State<IOptions>({
  name: 'options',
  defaults: defaultOptions()
})
@Injectable()
export class OptionsState {

  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(OptionsState, action, handler);
    });
  }

  @Selector()
  static options(state: IOptions) {
    return state;
  }

  @Selector()
  static getSidebarDisplay(state: IOptions) {
    return state[GameOption.SidebarDisplay];
  }

  @Selector()
  static getColorTheme(state: IOptions) {
    return state[GameOption.ColorTheme];
  }
}
