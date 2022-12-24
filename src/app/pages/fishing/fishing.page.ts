import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import * as locationData from '../../../assets/content/fishing.json';
import { IGameGatherLocation } from '../../../interfaces';
import { FishingState } from '../../../stores';
import { CancelFishing, SetFishingLocation } from '../../../stores/fishing/fishing.actions';

@Component({
  selector: 'app-fishing',
  templateUrl: './fishing.page.html',
  styleUrls: ['./fishing.page.scss'],
})
export class FishingPage implements OnInit {

  public readonly locationData = (locationData as any).default || locationData;

  @Select(FishingState.level) level$!: Observable<number>;
  @Select(FishingState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(FishingState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  visibleLocations(locations: IGameGatherLocation[], currentLevel = 0) {
    return locations.filter(location => currentLevel >= location.level.min);
  }

  gather(location: IGameGatherLocation) {
    this.store.dispatch(new SetFishingLocation(location));
  }

  cancelGather() {
    this.store.dispatch(new CancelFishing());
  }

}
