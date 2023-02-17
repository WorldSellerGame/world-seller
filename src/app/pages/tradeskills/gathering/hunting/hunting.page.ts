import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameGatherLocation, IGameWorkersGathering } from '../../../../../interfaces';
import { HuntingState, WorkersState } from '../../../../../stores';
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

  public get setAction() {
    return SetHuntingLocation;
  }

  public get cancelAction() {
    return CancelHunting;
  }

  @Select(HuntingState.level) level$!: Observable<number>;
  @Select(HuntingState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(HuntingState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;
  @Select(WorkersState.gatheringWorkers) gatheringWorkers$!: Observable<{
    workerAllocations: IGameWorkersGathering[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
  }

}
