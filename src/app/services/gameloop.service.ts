import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription, combineLatest, filter, interval, map } from 'rxjs';
import { IGameFarmingPlot, IGameRefiningRecipe, IPlayerCharacter } from '../../interfaces';
import { CharSelectState } from '../../stores';
import { SetActiveCharacter } from '../../stores/charselect/charselect.actions';
import { TickTimer } from '../../stores/game/game.actions';

@Injectable({
  providedIn: 'root'
})
export class GameloopService {

  @Select(CharSelectState.activeCharacter) activeCharacter$!: Observable<IPlayerCharacter>;

  private interval!: Subscription;
  private biggestTimer!: Subscription;

  private currentCharacterSlot = -1;

  public get characterSlot() {
    return this.currentCharacterSlot;
  }

  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  init() {

    this.router.events
      .pipe(
        filter(ev => ev instanceof NavigationEnd),
        map(() => this.route.firstChild)
      )
      .subscribe(route => {
        if(!route) {
          return;
        }

        const characterSlot = +(route.snapshot.paramMap.get('slot') || '-1');
        if(this.currentCharacterSlot === characterSlot) {
          return;
        }

        this.currentCharacterSlot = characterSlot;
        this.store.dispatch(new SetActiveCharacter(characterSlot));
      });

    this.activeCharacter$.subscribe(character => {
      if(!character) {
        this.stop();
        this.router.navigate(['/']);
        return;
      }

      this.start();
    });
  }

  start() {
    this.stop();

    this.interval = combineLatest([
      interval(1000),
      this.store.select(state => state.options.tickTimer)
    ]).subscribe(([i, timer]) => {
      this.store.dispatch(new TickTimer(timer || 1));
    });

    this.biggestTimer = this.store.select(state => {
      const gathering = ['fishing', 'foraging', 'hunting', 'logging', 'mining']
        .map(skill => state[skill].currentLocationDuration);

      const refining = ['alchemy', 'blacksmithing', 'cooking', 'jewelcrafting', 'weaving']
        .map(skill => state[skill].recipeQueue.map((x: IGameRefiningRecipe) => x.currentDuration))
        .flat();

      const farming = state.farming.plots.map((plot: IGameFarmingPlot) => plot.currentDuration);

      return Math.max(...gathering, ...refining, ...farming);
    }).subscribe(value => {
      if(value < 0) {
        this.title.setTitle('World Seller');
        return;
      }

      const hours = Math.floor(value / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((value % 3600) / 60).toString().padStart(2, '0');
      const seconds = Math.floor((value % 3600) % 60).toString().padStart(2, '0');

      if(hours === '00' && minutes === '00' && seconds === '00') {
        this.title.setTitle('World Seller');
        return;
      }

      this.title.setTitle(`World Seller [${hours}:${minutes}:${seconds}]`);
    });
  }

  stop() {
    this.interval?.unsubscribe();
    this.biggestTimer?.unsubscribe();
  }

}
