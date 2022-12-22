import { Component, OnInit } from '@angular/core';

import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import * as locationData from '../../../assets/content/mining.json';
import { IGameGatherLocation } from '../../../interfaces';
import { MiningState } from '../../../stores';
import { CancelMining, SetMiningLocation } from '../../../stores/mining/mining.actions';

@Component({
  selector: 'app-mining',
  templateUrl: './mining.page.html',
  styleUrls: ['./mining.page.scss'],
})
export class MiningPage implements OnInit {

  public readonly locationData = (locationData as any).default || locationData;

  @Select(MiningState.level) level$!: Observable<number>;
  @Select(MiningState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(MiningState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  visibleLocations(locations: IGameGatherLocation[], currentLevel = 1) {
    return locations.filter(location => currentLevel >= location.level.min);
  }

  gather(location: IGameGatherLocation) {
    this.store.dispatch(new SetMiningLocation(location));
  }

  cancelGather() {
    this.store.dispatch(new CancelMining());
  }

}
