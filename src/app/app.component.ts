import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { ICharacter } from '../interfaces';
import { CharSelectState } from '../stores';
import { SyncTotalLevel } from '../stores/charselect/charselect.actions';
import { getTotalLevel } from './helpers';
import { GameloopService } from './services/gameloop.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  @Select(CharSelectState.activeCharacter) activeCharacter$!: Observable<ICharacter>;

  public level!: Subscription;
  public totalLevel = 0;

  public gatheringTradeskills = [
    { title: 'Fishing',   url: 'fishing',   icon: 'fishing',    timer: this.store.select(state => state.fishing.currentLocationDuration) },
    { title: 'Foraging',  url: 'foraging',  icon: 'foraging',   timer: this.store.select(state => state.foraging.currentLocationDuration) },
    { title: 'Hunting',   url: 'hunting',   icon: 'hunting',    timer: this.store.select(state => state.hunting.currentLocationDuration) },
    { title: 'Logging',   url: 'logging',   icon: 'logging',    timer: this.store.select(state => state.logging.currentLocationDuration) },
    { title: 'Mining',    url: 'mining',    icon: 'mining',     timer: this.store.select(state => state.mining.currentLocationDuration) },
  ];

  public refiningTradeskills = [];

  public get showMenu(): boolean {
    return window.location.href.includes('/game/');
  }

  public get characterSlot() {
    return this.gameloopService.characterSlot;
  }

  constructor(
    private store: Store,
    private readonly gameloopService: GameloopService
  ) { }

  ngOnInit() {
    this.gameloopService.init();

    this.level = this.store.select(state => getTotalLevel(state)).subscribe(level => {
      this.totalLevel = level;

      this.store.dispatch(new SyncTotalLevel(level));
    });
  }

  ngOnDestroy() {
    this.gameloopService.stop();
    this.level?.unsubscribe();
  }

}
