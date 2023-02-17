import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameGatherLocation, IGameWorkersGathering } from '../../../../../interfaces';
import { FishingState, WorkersState } from '../../../../../stores';
import { CancelFishing, SetFishingLocation } from '../../../../../stores/fishing/fishing.actions';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-fishing',
  templateUrl: './fishing.page.html',
  styleUrls: ['./fishing.page.scss'],
})
export class FishingPage implements OnInit {

  public get locationData() {
    return this.contentService.fishing;
  }

  public get setAction() {
    return SetFishingLocation;
  }

  public get cancelAction() {
    return CancelFishing;
  }

  @Select(FishingState.level) level$!: Observable<number>;
  @Select(FishingState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(FishingState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;
  @Select(WorkersState.gatheringWorkers) gatheringWorkers$!: Observable<{
    workerAllocations: IGameWorkersGathering[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(private contentService: ContentService) { }

  ngOnInit() {
  }

}
