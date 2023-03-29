import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { sum } from 'lodash';
import { Observable, of } from 'rxjs';
import { IGameFarmingPlot, IGameRefiningRecipe } from '../interfaces';
import { CharSelectState, OptionsState } from '../stores';
import { UpdateAllItems } from '../stores/game/game.actions';
import { getMercantileLevel } from './helpers';
import { GameloopService } from './services/gameloop.service';
import { NotifyService } from './services/notify.service';

interface IMenuItem {
  title: string;
  url: string;
  icon: string;
  requirements: string;
  badge: Observable<{ icon: string; color: string } | undefined>;
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

  @Select(OptionsState.getColorTheme) colorTheme$!: Observable<string>;
  @Select(OptionsState.getSidebarDisplay) sidebarDisplay$!: Observable<string>;
  @Select(CharSelectState.activeCharacterInventoryUnlocked) inventoryUnlocked$!: Observable<boolean>;

  public gatheringTradeskills: IMenuItem[] = [
    { title: 'Fishing',   url: 'fishing',   icon: 'fishing',
      requirements: 'Discover Plant Fiber',
      badge: of(undefined),
      unlocked: this.store.select(state => state.fishing.unlocked),
      timer: this.store.select(state => Math.floor(state.fishing.currentLocationDuration)),
      level: this.store.select(state => state.fishing.level) },

    { title: 'Foraging',  url: 'foraging',  icon: 'foraging',
      requirements: 'None',
      badge: of(undefined),
      unlocked: this.store.select(state => state.foraging.unlocked),
      timer: this.store.select(state => Math.floor(state.foraging.currentLocationDuration)),
      level: this.store.select(state => state.foraging.level) },

    { title: 'Hunting',   url: 'hunting',   icon: 'hunting',
      requirements: 'Discover Stone',
      badge: of(undefined),
      unlocked: this.store.select(state => state.hunting.unlocked),
      timer: this.store.select(state => Math.floor(state.hunting.currentLocationDuration)),
      level: this.store.select(state => state.hunting.level) },

    { title: 'Logging',   url: 'logging',   icon: 'logging',
      requirements: 'None',
      badge: of(undefined),
      unlocked: this.store.select(state => state.logging.unlocked),
      timer: this.store.select(state => Math.floor(state.logging.currentLocationDuration)),
      level: this.store.select(state => state.logging.level) },

    { title: 'Mining',    url: 'mining',    icon: 'mining',
      requirements: 'Discover Pine Log',
      badge: of(undefined),
      unlocked: this.store.select(state => state.mining.unlocked),
      timer: this.store.select(state => Math.floor(state.mining.currentLocationDuration)),
      level: this.store.select(state => state.mining.level) },
  ];

  public refiningTradeskills: IMenuItem[] = [
    { title: 'Alchemy',    url: 'alchemy',    icon: 'alchemy',
      requirements: 'Discover Pine Needle & make an Oven',
      badge: of(undefined),
      unlocked: this.store.select(state => state.alchemy.unlocked),
      timer: this.store.select(state => sum(
        state.alchemy.recipeQueue
          .map((r: IGameRefiningRecipe) => Math.floor(r.currentDuration)
                                          + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.alchemy.level) },

    { title: 'Blacksmithing',    url: 'blacksmithing',    icon: 'blacksmithing',
      requirements: 'Discover Stone & Pine Log',
      badge: of(undefined),
      unlocked: this.store.select(state => state.blacksmithing.unlocked),
      timer: this.store.select(state => sum(
        state.blacksmithing.recipeQueue
          .map((r: IGameRefiningRecipe) => Math.floor(r.currentDuration)
                                        + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.blacksmithing.level) },

    { title: 'Cooking',    url: 'cooking',    icon: 'cooking',
      requirements: 'Discover Pinecone',
      badge: of(undefined),
      unlocked: this.store.select(state => state.cooking.unlocked),
      timer: this.store.select(state => sum(
        state.cooking.recipeQueue
          .map((r: IGameRefiningRecipe) => Math.floor(r.currentDuration)
                                          + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.cooking.level) },

    { title: 'Jewelcrafting',    url: 'jewelcrafting',    icon: 'jewelcrafting',
      requirements: 'Discover Dandelion',
      badge: of(undefined),
      unlocked: this.store.select(state => state.jewelcrafting.unlocked),
      timer: this.store.select(state => sum(
        state.jewelcrafting.recipeQueue
          .map((r: IGameRefiningRecipe) => Math.floor(r.currentDuration)
                                            + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.jewelcrafting.level) },

    { title: 'Weaving',    url: 'weaving',    icon: 'weaving',
      requirements: 'Discover Whorl',
      badge: of(undefined),
      unlocked: this.store.select(state => state.weaving.unlocked),
      timer: this.store.select(state => sum(
        state.weaving.recipeQueue
          .map((r: IGameRefiningRecipe) => Math.floor(r.currentDuration)
                                        + (r.durationPer * (r.totalLeft - 1)))
      )),
      level: this.store.select(state => state.weaving.level) }
  ];

  public peripheralTradeskills: IMenuItem[] = [

    { title: 'Combat',    url: 'combat',    icon: 'combat',
      requirements: 'Discover Stone Knife',
      badge: of(undefined),
      unlocked: this.store.select(state => state.combat.unlocked),
      timer: of(0),
      level: this.store.select(state => state.combat.level) },

    { title: 'Farming',    url: 'farming',    icon: 'farming',
      requirements: 'Discover Carrot Seed',
      badge: this.store.select(state => {
        const isReady = state.farming.plots.some((p: IGameFarmingPlot) => p.currentDuration <= 0);
        if(!isReady) {
          return undefined;
        }

        return {
          icon: 'alert-circle',
          color: 'primary'
        };
      }),
      unlocked: this.store.select(state => state.farming.unlocked),
      timer: this.store.select(state => Math.max(...state.farming.plots.map((p: IGameFarmingPlot) => p.currentDuration))),
      level: this.store.select(state => state.farming.level) },

    { title: 'Mercantile',    url: 'mercantile',    icon: 'mercantile',
      requirements: 'Discover Coin (quick sell an item)',
      badge: of(undefined),
      unlocked: this.store.select(state => state.mercantile.unlocked),
      timer: of(0),
      level: this.store.select(state => getMercantileLevel(state)) },

    { title: 'Transmutation',    url: 'transmutation',    icon: 'prospecting',
      requirements: 'Discover Stone',
      badge: of(undefined),
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
    private readonly gameloopService: GameloopService,
    public notifyService: NotifyService
  ) { }

  ngOnInit() {
    this.gameloopService.init();

    this.store.dispatch(new UpdateAllItems());
  }

  ngOnDestroy() {
    this.gameloopService.stop();
  }

}
