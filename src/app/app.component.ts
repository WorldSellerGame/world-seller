import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { sum } from 'lodash';
import { Observable, Subscription, of } from 'rxjs';
import { IGameRefiningRecipe, IPlayerCharacter } from '../interfaces';
import { CharSelectState, OptionsState } from '../stores';
import { GainJobResult, SyncTotalLevel } from '../stores/charselect/charselect.actions';
import { getMercantileLevel, getTotalLevel } from './helpers';
import { GameloopService } from './services/gameloop.service';
import { NotifyService } from './services/notify.service';

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

  @Select(CharSelectState.activeCharacter) activeCharacter$!: Observable<IPlayerCharacter>;
  @Select(CharSelectState.activeCharacterCoins) coins$!: Observable<number>;
  @Select(OptionsState.getColorTheme) colorTheme$!: Observable<string>;
  @Select(OptionsState.isDebugMode) debugMode$!: Observable<boolean>;
  @Select(OptionsState.getSidebarDisplay) sidebarDisplay$!: Observable<string>;

  public debug!: Subscription;
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

    { title: 'Jewelcrafting',    url: 'jewelcrafting',    icon: 'jewelcrafting',
      timer: this.store.select(state => sum(
        state.jewelcrafting.recipeQueue
          .map((r: IGameRefiningRecipe) => r.currentDuration
                                            + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.jewelcrafting.level) },

    { title: 'Weaving',    url: 'weaving',    icon: 'weaving',
      timer: this.store.select(state => sum(
        state.weaving.recipeQueue
          .map((r: IGameRefiningRecipe) => r.currentDuration
                                        + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.weaving.level) }
  ];


  public peripheralTradeskills: IMenuItem[] = [

    { title: 'Combat',    url: 'combat',    icon: 'combat',
      timer: of(0),
      level: this.store.select(state => state.combat.level) },

    { title: 'Farming',    url: 'farming',    icon: 'farming',
      timer: of(0),
      level: this.store.select(state => state.farming.level) },

    { title: 'Mercantile',    url: 'mercantile',    icon: 'mercantile',
      timer: of(0),
      level: this.store.select(state => getMercantileLevel(state)) },

    { title: 'Prospecting',    url: 'prospecting',    icon: 'prospecting',
      timer: of(0),
      level: this.store.select(state => state.prospecting.level) }
  ];

  public get showMenu(): boolean {
    return window.location.href.includes('/game/');
  }

  public get characterSlot() {
    return this.gameloopService.characterSlot;
  }

  constructor(
    private store: Store,
    private notify: NotifyService,
    private readonly gameloopService: GameloopService
  ) { }

  ngOnInit() {
    this.gameloopService.init();

    this.level = this.store.select(state => getTotalLevel(state)).subscribe(level => {
      this.totalLevel = level;

      this.store.dispatch(new SyncTotalLevel(level));
    });

    const oldError = window.onerror;

    this.debug = this.debugMode$.subscribe(debugMode => {
      if(!debugMode) {
        (window as any).gainItem = () => {};
        window.onerror = oldError;
        return;
      }

      window.onerror = (error: Event | string) => {
        const message = (error as ErrorEvent).message ?? error;

        this.notify.error(message);
        console.error(error);
      };

      (window as any).gainItem = (item: string, amount: number) => {
        this.store.dispatch(new GainJobResult(item, amount));
      };
    });
  }

  ngOnDestroy() {
    this.gameloopService.stop();
    this.level?.unsubscribe();
    this.debug?.unsubscribe();
  }

}
