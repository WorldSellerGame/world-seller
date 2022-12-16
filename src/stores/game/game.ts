

import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGame } from '../../interfaces';
import { attachments } from './game.attachments';
import { defaultGame } from './game.functions';

@State<IGame>({
  name: 'game',
  defaults: defaultGame()
})
@Injectable()
export class GameState {

  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(GameState, action, handler);
    });
  }

}
