

import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { NotifyService } from '../../app/services/notify.service';
import { IGame } from '../../interfaces';
import { NotifyError, NotifyInfo, NotifyWarning } from './game.actions';
import { attachments } from './game.attachments';
import { defaultGame } from './game.functions';

@State<IGame>({
  name: 'game',
  defaults: defaultGame()
})
@Injectable()
export class GameState {

  constructor(private notify: NotifyService) {
    attachments.forEach(({ action, handler }) => {
      attachAction(GameState, action, handler);
    });
  }

  @Action(NotifyError)
  notifyError(ctx: StateContext<IGame>, { message }: NotifyError) {
    this.notify.error(message);
  }

  @Action(NotifyWarning)
  notifyWarning(ctx: StateContext<IGame>, { message }: NotifyWarning) {
    this.notify.warn(message);
  }

  @Action(NotifyInfo)
  notifyInfo(ctx: StateContext<IGame>, { message }: NotifyInfo) {
    this.notify.notify(message);
  }

}
