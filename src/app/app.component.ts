import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { sum } from 'lodash';
import { Observable, Subscription, of } from 'rxjs';
import { IGameRefiningRecipe, IPlayerCharacter } from '../interfaces';
import { CharSelectState, OptionsState } from '../stores';
import { DiscoverResourceOrItem, GainItemOrResource, SyncTotalLevel } from '../stores/charselect/charselect.actions';
import { UpdateAllItems } from '../stores/game/game.actions';
import { getMercantileLevel, getTotalLevel } from './helpers';
import { GameloopService } from './services/gameloop.service';
import { NotifyService } from './services/notify.service';

interface IMenuItem {
  title: string;
  url: string;
  icon: string;
  requirements: string;
  unlocked: Observable<boolean>;
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
      requirements: 'Discover Plant Fiber',
      unlocked: this.store.select(state => state.fishing.unlocked),
      timer: this.store.select(state => state.fishing.currentLocationDuration),
      level: this.store.select(state => state.fishing.level) },

    { title: 'Foraging',  url: 'foraging',  icon: 'foraging',
      requirements: 'None',
      unlocked: this.store.select(state => state.foraging.unlocked),
      timer: this.store.select(state => state.foraging.currentLocationDuration),
      level: this.store.select(state => state.foraging.level) },

    { title: 'Hunting',   url: 'hunting',   icon: 'hunting',
      requirements: 'Discover Stone',
      unlocked: this.store.select(state => state.hunting.unlocked),
      timer: this.store.select(state => state.hunting.currentLocationDuration),
      level: this.store.select(state => state.hunting.level) },

    { title: 'Logging',   url: 'logging',   icon: 'logging',
      requirements: 'None',
      unlocked: this.store.select(state => state.logging.unlocked),
      timer: this.store.select(state => state.logging.currentLocationDuration),
      level: this.store.select(state => state.logging.level) },

    { title: 'Mining',    url: 'mining',    icon: 'mining',
      requirements: 'Discover Pine Log',
      unlocked: this.store.select(state => state.mining.unlocked),
      timer: this.store.select(state => state.mining.currentLocationDuration),
      level: this.store.select(state => state.mining.level) },
  ];

  public refiningTradeskills: IMenuItem[] = [
    { title: 'Alchemy',    url: 'alchemy',    icon: 'alchemy',
      requirements: 'Discover Pine Needle & make an Oven',
      unlocked: this.store.select(state => state.alchemy.unlocked),
      timer: this.store.select(state => sum(
        state.alchemy.recipeQueue
          .map((r: IGameRefiningRecipe) => r.currentDuration
                                          + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.alchemy.level) },

    { title: 'Blacksmithing',    url: 'blacksmithing',    icon: 'blacksmithing',
      requirements: 'Discover Stone & Pine Log',
      unlocked: this.store.select(state => state.blacksmithing.unlocked),
      timer: this.store.select(state => sum(
        state.blacksmithing.recipeQueue
          .map((r: IGameRefiningRecipe) => r.currentDuration
                                        + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.blacksmithing.level) },

    { title: 'Cooking',    url: 'cooking',    icon: 'cooking',
      requirements: 'Discover Pinecone',
      unlocked: this.store.select(state => state.cooking.unlocked),
      timer: this.store.select(state => sum(
        state.cooking.recipeQueue
          .map((r: IGameRefiningRecipe) => r.currentDuration
                                          + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.cooking.level) },

    { title: 'Jewelcrafting',    url: 'jewelcrafting',    icon: 'jewelcrafting',
      requirements: 'Discover Dandelion',
      unlocked: this.store.select(state => state.jewelcrafting.unlocked),
      timer: this.store.select(state => sum(
        state.jewelcrafting.recipeQueue
          .map((r: IGameRefiningRecipe) => r.currentDuration
                                            + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.jewelcrafting.level) },

    { title: 'Weaving',    url: 'weaving',    icon: 'weaving',
      requirements: 'Discover Whorl',
      unlocked: this.store.select(state => state.weaving.unlocked),
      timer: this.store.select(state => sum(
        state.weaving.recipeQueue
          .map((r: IGameRefiningRecipe) => r.currentDuration
                                        + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.weaving.level) }
  ];


  public peripheralTradeskills: IMenuItem[] = [

    { title: 'Combat',    url: 'combat',    icon: 'combat',
      requirements: 'Discover Stone Knife',
      unlocked: this.store.select(state => state.combat.unlocked),
      timer: of(0),
      level: this.store.select(state => state.combat.level) },

    { title: 'Farming',    url: 'farming',    icon: 'farming',
      requirements: 'Discover Carrot Seed',
      unlocked: this.store.select(state => state.farming.unlocked),
      timer: of(0),
      level: this.store.select(state => state.farming.level) },

    { title: 'Mercantile',    url: 'mercantile',    icon: 'mercantile',
      requirements: 'Discover Coin (quick sell an item)',
      unlocked: this.store.select(state => state.mercantile.unlocked),
      timer: of(0),
      level: this.store.select(state => getMercantileLevel(state)) },

    { title: 'Prospecting',    url: 'prospecting',    icon: 'prospecting',
      requirements: 'Discover Stone',
      unlocked: this.store.select(state => state.prospecting.unlocked),
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
    private readonly notifyService: NotifyService,
    private readonly gameloopService: GameloopService
  ) { }

  ngOnInit() {
    this.gameloopService.init();

    this.store.dispatch(new UpdateAllItems());

    this.level = this.store.select(state => getTotalLevel(state)).subscribe(level => {
      this.totalLevel = level;

      this.store.dispatch(new SyncTotalLevel(level));
    });

    this.debug = this.debugMode$.subscribe(debugMode => {
      if(!debugMode) {
        (window as any).gainItem = () => {};
        (window as any).discover = () => {};
        (window as any).gainAchievement = () => {};
        return;
      }

      (window as any).gainItem = (item: string, amount: number) => {
        this.store.dispatch(new GainItemOrResource(item, amount));
      };

      (window as any).discover = (item: string) => {
        this.store.dispatch(new DiscoverResourceOrItem(item));
      };

      (window as any).gainAchievement = (achievementText: string) => {
        this.notifyService.achievement(achievementText);
      };
    });
  }

  ngOnDestroy() {
    this.gameloopService.stop();
    this.level?.unsubscribe();
    this.debug?.unsubscribe();
  }

}
