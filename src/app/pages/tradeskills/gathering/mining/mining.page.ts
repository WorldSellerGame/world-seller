import { Component, OnInit } from '@angular/core';

import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameGatherLocation } from '../../../../../interfaces';
import { MiningState } from '../../../../../stores';
import { CancelMining, SetMiningLocation } from '../../../../../stores/mining/mining.actions';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-mining',
  templateUrl: './mining.page.html',
  styleUrls: ['./mining.page.scss'],
})
export class MiningPage implements OnInit {

  public get locationData() {
    return this.contentService.mining;
  }

  @Select(MiningState.level) level$!: Observable<number>;
  @Select(MiningState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(MiningState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
  }

  visibleLocations(locations: IGameGatherLocation[], currentLevel = 0) {
    return locations.filter(location => currentLevel >= location.level.min);
  }

  gather(location: IGameGatherLocation) {
    this.store.dispatch(new SetMiningLocation(location));
  }

  cancelGather() {
    this.store.dispatch(new CancelMining());
  }

}
