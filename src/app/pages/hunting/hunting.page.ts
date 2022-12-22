import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import * as locationData from '../../../assets/content/hunting.json';
import { IGameGatherLocation } from '../../../interfaces';
import { HuntingState } from '../../../stores';
import { CancelHunting, SetHuntingLocation } from '../../../stores/hunting/hunting.actions';

@Component({
  selector: 'app-hunting',
  templateUrl: './hunting.page.html',
  styleUrls: ['./hunting.page.scss'],
})
export class HuntingPage implements OnInit {

  public readonly locationData = (locationData as any).default || locationData;

  @Select(HuntingState.level) level$!: Observable<number>;
  @Select(HuntingState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(HuntingState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  visibleLocations(locations: IGameGatherLocation[], currentLevel = 1) {
    return locations.filter(location => currentLevel >= location.level.min);
  }

  gather(location: IGameGatherLocation) {
    this.store.dispatch(new SetHuntingLocation(location));
  }

  cancelGather() {
    this.store.dispatch(new CancelHunting());
  }

}
