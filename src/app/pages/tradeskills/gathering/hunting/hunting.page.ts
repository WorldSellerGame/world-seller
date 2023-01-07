import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameGatherLocation } from '../../../../../interfaces';
import { HuntingState } from '../../../../../stores';
import { CancelHunting, SetHuntingLocation } from '../../../../../stores/hunting/hunting.actions';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-hunting',
  templateUrl: './hunting.page.html',
  styleUrls: ['./hunting.page.scss'],
})
export class HuntingPage implements OnInit {

  public get locationData() {
    return this.contentService.hunting;
  }

  @Select(HuntingState.level) level$!: Observable<number>;
  @Select(HuntingState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(HuntingState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
  }

  visibleLocations(locations: IGameGatherLocation[], currentLevel = 0) {
    return locations.filter(location => currentLevel >= location.level.min);
  }

  gather(location: IGameGatherLocation) {
    this.store.dispatch(new SetHuntingLocation(location));
  }

  cancelGather() {
    this.store.dispatch(new CancelHunting());
  }

}
