import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GameOption, IOptions } from '../../../interfaces';
import { OptionsState } from '../../../stores';
import { SetOption } from '../../../stores/options/options.actions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  @Select(OptionsState.options) options$!: Observable<IOptions>;

  public showDevOptions = !environment.production;

  constructor(private store: Store) { }

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

}
