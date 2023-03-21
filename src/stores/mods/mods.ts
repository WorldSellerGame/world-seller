

import { Injectable } from '@angular/core';
import { Selector, State, Store } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGameMods } from '../../interfaces';
import { attachments } from './mods.attachments';
import {
  defaultMods
} from './mods.functions';

@State<IGameMods>({
  name: 'mods',
  defaults: defaultMods()
})
@Injectable()
export class ModsState {

  constructor(private store: Store) {
    attachments.forEach(({ action, handler }) => {
      attachAction(ModsState, action, handler);
    });
  }

  @Selector()
  static mods(state: IGameMods) {
    return state.mods;
  }

  @Selector()
  static themes(state: IGameMods) {
    return Object.values(state.mods).map(mod => mod.content.themes || []).flat();
  }

}
