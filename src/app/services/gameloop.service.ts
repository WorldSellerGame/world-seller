import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription, combineLatest, filter, interval, map } from 'rxjs';
import { IPlayerCharacter } from '../../interfaces';
import { CharSelectState } from '../../stores';
import { SetActiveCharacter } from '../../stores/charselect/charselect.actions';
import { TickTimer } from '../../stores/game/game.actions';

@Injectable({
  providedIn: 'root'
})
export class GameloopService {

  @Select(CharSelectState.activeCharacter) activeCharacter$!: Observable<IPlayerCharacter>;

  private interval!: Subscription;

  private currentCharacterSlot = -1;

  public get characterSlot() {
    return this.currentCharacterSlot;
  }

  constructor(
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
  }

  stop() {
    this.interval?.unsubscribe();
  }

}
