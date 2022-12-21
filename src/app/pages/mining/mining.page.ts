import { Component, OnInit } from '@angular/core';

import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import * as miningData from '../../../assets/content/mining.json';
import { IGameMiningLocation } from '../../../interfaces';
import { MiningState } from '../../../stores';
import { CancelMining, SetMiningLocation } from '../../../stores/mining/mining.actions';

@Component({
  selector: 'app-mining',
  templateUrl: './mining.page.html',
  styleUrls: ['./mining.page.scss'],
})
export class MiningPage implements OnInit {

  public readonly miningData = (miningData as any).default || miningData;

  @Select(MiningState.level) level$!: Observable<number>;
  @Select(MiningState.currentLocation) currentLocation$!: Observable<{ location: IGameMiningLocation; duration: number } | undefined>;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  visibleLocations(locations: IGameMiningLocation[], currentLevel = 1) {
    return locations.filter(location => currentLevel >= location.level.min);
  }

  mine(location: IGameMiningLocation) {
    this.store.dispatch(new SetMiningLocation(location));
  }

  cancelMining() {
    this.store.dispatch(new CancelMining());
  }

}
