import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, first } from 'rxjs';
import { IGameGatherLocation, IGameWorkersGathering } from '../../../../../interfaces';
import { ForagingState, WorkersState } from '../../../../../stores';
import { CancelForaging, SetForagingLocation, StarForagingLocation } from '../../../../../stores/foraging/foraging.actions';
import { setDiscordStatus } from '../../../../helpers/electron';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-foraging',
  templateUrl: './foraging.page.html',
  styleUrls: ['./foraging.page.scss'],
})
export class ForagingPage implements OnInit {

  public locationData = this.contentService.getForagingLocations();

  public get setAction() {
    return SetForagingLocation;
  }

  public get cancelAction() {
    return CancelForaging;
  }

  public get favoriteAction() {
    return StarForagingLocation;
  }

  public pageMetadata = { totalDiscovered: 0, totalLocations: 0 };

  @Select(ForagingState.level) level$!: Observable<number>;
  @Select(ForagingState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(ForagingState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;
  @Select(ForagingState.starredNodes) starredLocations$!: Observable<Record<string, boolean>>;
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
