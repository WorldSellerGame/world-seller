

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { AnalyticsService } from '../../app/services/analytics.service';
import { CloudSaveService } from '../../app/services/cloudsave.service';
import { NotifyService } from '../../app/services/notify.service';
import { VisualsService } from '../../app/services/visuals.service';
import { IGame } from '../../interfaces';
import {
  AnalyticsTrack, NotifyError, NotifyInfo, NotifySuccess,
  NotifyTradeskill, NotifyWarning, PlaySFX, UpdateFirebaseSavefile
} from './game.actions';
import { attachments } from './game.attachments';
import { defaultGame } from './game.functions';

@State<IGame>({
  name: 'game',
  defaults: defaultGame()
})
@Injectable()
export class GameState {

  constructor(
    private notify: NotifyService,
    private analytics: AnalyticsService,
    private cloudSaveService: CloudSaveService,
    private visuals: VisualsService
  ) {
    attachments.forEach(({ action, handler }) => {
      attachAction(GameState, action, handler);
    });
  }

  @Selector()
  static firebaseUID(state: IGame) {
    return state.firebaseUID;
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

  @Action(NotifySuccess)
  notifySuccess(ctx: StateContext<IGame>, { message }: NotifySuccess) {
    this.notify.success(message);
  }

  @Action(NotifyTradeskill)
  notifyTradeskill(ctx: StateContext<IGame>, { tradeskill, message }: NotifyTradeskill) {
    this.notify.tradeskill(tradeskill, message);
  }

  @Action(AnalyticsTrack)
  analyticsTrack(ctx: StateContext<IGame>, { event, value }: AnalyticsTrack) {
    this.analytics.sendDesignEvent(event, value);
  }

  @Action(PlaySFX)
  playSFX(ctx: StateContext<IGame>, { sfx }: PlaySFX) {
    this.visuals.playSoundEffect(sfx);
  }

  @Action(UpdateFirebaseSavefile)
  updateFirebaseSavefile() {
    this.cloudSaveService.saveSavefile();
  }

}
