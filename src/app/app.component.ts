import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { sum } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { ICharacter, IGameRefiningRecipe } from '../interfaces';
import { CharSelectState, OptionsState } from '../stores';
import { SyncTotalLevel } from '../stores/charselect/charselect.actions';
import { getTotalLevel } from './helpers';
import { GameloopService } from './services/gameloop.service';

interface IMenuItem {
  title: string;
  url: string;
  icon: string;
  timer: Observable<number>;
  level: Observable<number>;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  @Select(CharSelectState.activeCharacter) activeCharacter$!: Observable<ICharacter>;
  @Select(OptionsState.isShrinkSidebar) isShrinkSidebar$!: Observable<boolean>;

  public level!: Subscription;
  public totalLevel = 0;

  public gatheringTradeskills: IMenuItem[] = [
    { title: 'Fishing',   url: 'fishing',   icon: 'fishing',
      timer: this.store.select(state => state.fishing.currentLocationDuration),
      level: this.store.select(state => state.fishing.level) },

    { title: 'Foraging',  url: 'foraging',  icon: 'foraging',
      timer: this.store.select(state => state.foraging.currentLocationDuration),
      level: this.store.select(state => state.foraging.level) },

    { title: 'Hunting',   url: 'hunting',   icon: 'hunting',
      timer: this.store.select(state => state.hunting.currentLocationDuration),
      level: this.store.select(state => state.hunting.level) },

    { title: 'Logging',   url: 'logging',   icon: 'logging',
      timer: this.store.select(state => state.logging.currentLocationDuration),
      level: this.store.select(state => state.logging.level) },

    { title: 'Mining',    url: 'mining',    icon: 'mining',
      timer: this.store.select(state => state.mining.currentLocationDuration),
      level: this.store.select(state => state.mining.level) },
  ];

  public refiningTradeskills: IMenuItem[] = [
    { title: 'Alchemy',    url: 'alchemy',    icon: 'alchemy',
      timer: this.store.select(state => sum(
        state.alchemy.recipeQueue
          .map((r: IGameRefiningRecipe) => r.currentDuration
                                          + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.alchemy.level) },

    { title: 'Blacksmithing',    url: 'blacksmithing',    icon: 'blacksmithing',
      timer: this.store.select(state => sum(
        state.blacksmithing.recipeQueue
          .map((r: IGameRefiningRecipe) => r.currentDuration
                                        + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.blacksmithing.level) },

    { title: 'Cooking',    url: 'cooking',    icon: 'cooking',
      timer: this.store.select(state => sum(
        state.cooking.recipeQueue
          .map((r: IGameRefiningRecipe) => r.currentDuration
                                          + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.cooking.level) },

    { title: 'Weaving',    url: 'weaving',    icon: 'weaving',
      timer: this.store.select(state => sum(
        state.weaving.recipeQueue
          .map((r: IGameRefiningRecipe) => r.currentDuration
                                        + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.weaving.level) }
  ];

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
