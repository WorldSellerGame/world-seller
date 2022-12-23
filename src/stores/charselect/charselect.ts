

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { NotifyService } from '../../app/services/notify.service';
import { ICharSelect } from '../../interfaces';
import { GainResources } from './charselect.actions';
import { attachments } from './charselect.attachments';
import { defaultCharSelect } from './charselect.functions';

@State<ICharSelect>({
  name: 'charselect',
  defaults: defaultCharSelect()
})
@Injectable()
export class CharSelectState {

  constructor(private notifyService: NotifyService) {
    attachments.forEach(({ action, handler }) => {
      attachAction(CharSelectState, action, handler);
    });
  }

  @Selector()
  static characters(state: ICharSelect) {
    return state.characters;
  }

  @Selector()
  static activeCharacter(state: ICharSelect) {
    return state.characters[state.currentCharacter];
  }

  @Selector()
  static activeCharacterResources(state: ICharSelect) {
    return this.activeCharacter(state)?.resources ?? {};
  }

  @Action(GainResources)
  async gainResources(ctx: StateContext<ICharSelect>, { resources }: GainResources) {
    const resStr = Object.keys(resources).map(key => `${resources[key]}x ${key}`).join(', ');
    this.notifyService.notify(`Gained ${resStr}!`);
  }

}
