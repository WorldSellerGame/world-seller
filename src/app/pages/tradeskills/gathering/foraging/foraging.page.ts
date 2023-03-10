import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, first } from 'rxjs';
import { IGameGatherLocation, IGameWorkersGathering } from '../../../../../interfaces';
import { ForagingState, WorkersState } from '../../../../../stores';
import { CancelForaging, SetForagingLocation } from '../../../../../stores/foraging/foraging.actions';
import { setDiscordStatus } from '../../../../helpers/electron';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-foraging',
  templateUrl: './foraging.page.html',
  styleUrls: ['./foraging.page.scss'],
})
export class ForagingPage implements OnInit {

  public get locationData() {
    return this.contentService.getForagingLocations();
  }

  public get setAction() {
    return SetForagingLocation;
  }

  public get cancelAction() {
    return CancelForaging;
  }

  @Select(ForagingState.level) level$!: Observable<number>;
  @Select(ForagingState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(ForagingState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;
  @Select(WorkersState.gatheringWorkers) gatheringWorkers$!: Observable<{
    workerAllocations: IGameWorkersGathering[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
    this.level$.pipe(first()).subscribe(level => {
      this.currentLocation$.pipe(first()).subscribe(currentLocation => {
        const state = currentLocation ? `Foraging Lv.${level} @ ${currentLocation.location.name}...` : `Foraging Lv.${level}, browsing...`;

        setDiscordStatus({
          state
        });
      });
    });
  }

}
