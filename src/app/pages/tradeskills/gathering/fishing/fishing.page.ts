import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, first } from 'rxjs';
import { IGameGatherLocation, IGameWorkersGathering } from '../../../../../interfaces';
import { FishingState, WorkersState } from '../../../../../stores';
import { CancelFishing, SetFishingLocation } from '../../../../../stores/fishing/fishing.actions';
import { setDiscordStatus } from '../../../../helpers/electron';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-fishing',
  templateUrl: './fishing.page.html',
  styleUrls: ['./fishing.page.scss'],
})
export class FishingPage implements OnInit {

  public get locationData() {
    return this.contentService.getFishingLocations();
  }

  public get setAction() {
    return SetFishingLocation;
  }

  public get cancelAction() {
    return CancelFishing;
  }

  public pageMetadata = { totalDiscovered: 0, totalLocations: 0 };

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
    this.level$.pipe(first()).subscribe(level => {
      this.currentLocation$.pipe(first()).subscribe(currentLocation => {
        const state = currentLocation ? `Fishing Lv.${level} @ ${currentLocation.location.name}...` : `Fishing Lv.${level}, browsing...`;

        setDiscordStatus({
          state
        });
      });
    });
  }

}
