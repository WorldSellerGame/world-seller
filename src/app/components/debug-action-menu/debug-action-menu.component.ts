import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OptionsState } from '../../../stores';

@Component({
  selector: 'app-debug-action-menu',
  templateUrl: './debug-action-menu.component.html',
  styleUrls: ['./debug-action-menu.component.scss'],
})
export class DebugActionMenuComponent implements OnInit {

  @Input() actions!: Array<{ icon: string; text: string; action: any; actionArgs?: any[] }>;

  @Select(OptionsState.isDebugMode) isDebugMode$!: Observable<boolean>;

  constructor(private store: Store) { }

  ngOnInit() {}

  doAction(action: any, args: any[] = []) {
    this.store.dispatch(new action(...args));
  }

}
