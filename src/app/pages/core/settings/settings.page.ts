import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GameOption, IOptions } from '../../../../interfaces';
import { OptionsState } from '../../../../stores';
import { UnlockForaging } from '../../../../stores/foraging/foraging.actions';
import { UnlockLogging } from '../../../../stores/logging/logging.actions';
import { GainCoins } from '../../../../stores/mercantile/mercantile.actions';
import { SetOption } from '../../../../stores/options/options.actions';
import { MetaService } from '../../../services/meta.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  @Select(OptionsState.options) options$!: Observable<IOptions>;

  public get showDevOptions() {
    return !environment.production || window.location.href.includes('deploy-preview');
  }

  constructor(private store: Store, public metaService: MetaService) { }

  ngOnInit() {
  }

  setOption(option: string, value: any) {
    setTimeout(() => {
      this.store.dispatch(new SetOption(option as GameOption, value));
    }, 0);
  }

  changeTickTimer($event: any) {
    this.setOption(GameOption.TickTimer, $event.detail.value);
  }

  exportCharacter(slot: number) {
    this.metaService.exportCharacter(slot);
  }

  addManyCoins() {
    this.store.dispatch(new GainCoins(1000));
  }

  unlockBasics() {
    this.store.dispatch([new UnlockForaging(), new UnlockLogging()]);
  }
}
