

import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { ICharSelect } from '../../interfaces';
import { attachments } from './charselect.attachments';
import { defaultCharSelect } from './charselect.functions';

@State<ICharSelect>({
  name: 'charselect',
  defaults: defaultCharSelect()
})
@Injectable()
export class CharSelectState {

  constructor() {
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

}
