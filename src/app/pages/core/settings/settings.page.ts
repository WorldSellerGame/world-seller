import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GameOption, IOptions } from '../../../../interfaces';
import { ModsState, OptionsState } from '../../../../stores';
import { ResetAchievements, ResetStats } from '../../../../stores/achievements/achievements.actions';
import { UnlockForaging } from '../../../../stores/foraging/foraging.actions';
import { AnalyticsTrack } from '../../../../stores/game/game.actions';
import { UnlockLogging } from '../../../../stores/logging/logging.actions';
import { GainCoins } from '../../../../stores/mercantile/mercantile.actions';
import { SetOption } from '../../../../stores/options/options.actions';
import { setDiscordStatus } from '../../../helpers/electron';
import { AnalyticsService } from '../../../services/analytics.service';
import { MetaService } from '../../../services/meta.service';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  @Select(OptionsState.options) options$!: Observable<IOptions>;
  @Select(ModsState.themes) themes$!: Observable<Array<{ name: string; value: string }>>;

  public get showDevOptions() {
    return !environment.production || window.location.href.includes('deploy-preview');
  }

  constructor(
    private store: Store,
    public metaService: MetaService,
    private notifyService: NotifyService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    setDiscordStatus({
      state: '⚙️ Perusing settings...'
    });
  }

  setOption(option: string, value: any) {
    setTimeout(() => {
      this.store.dispatch([
        new AnalyticsTrack(`SetOption:${option}:${value}`, 1),
        new SetOption(option as GameOption, value)
      ]);
    }, 0);
  }

  changeTickTimer($event: any) {
    this.setOption(GameOption.TickTimer, $event.detail.value);
  }

  changeMasterVolume($event: any) {
    this.setOption(GameOption.SoundMaster, $event.detail.value);
  }

  changeSFXVolume($event: any) {
    this.setOption(GameOption.SoundSFX, $event.detail.value);
  }

  exportCharacter(slot: number) {
    this.metaService.exportCharacter(slot);
  }

  addManyCoins() {
    this.store.dispatch(new GainCoins(1000, 'ModCheat'));
  }

  unlockBasics() {
    this.store.dispatch([new UnlockForaging(), new UnlockLogging()]);
  }

  resetStats() {
    this.notifyService.confirm(
      'Reset Stats',
      'Are you sure you want to reset your stats? This cannot be undone.',
      [
        {
          text: 'No, Keep Stats',
          role: 'cancel'
        },
        {
          text: 'Yes, Reset Stats',
          handler: () => {
            this.store.dispatch(new ResetStats());
          }
        }
      ]
    );
  }

  resetAchievements() {
    this.notifyService.confirm(
      'Reset Achievements',
      'Are you sure you want to reset your achievements? This cannot be undone.',
      [
        {
          text: 'No, Keep Achievements',
          role: 'cancel'
        },
        {
          text: 'Yes, Reset Achievements',
          handler: () => {
            this.store.dispatch(new ResetAchievements());
          }
        }
      ]
    );
  }
}
