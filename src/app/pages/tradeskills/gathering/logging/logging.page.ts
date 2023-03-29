import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, first } from 'rxjs';
import { IGameGatherLocation, IGameWorkersGathering } from '../../../../../interfaces';
import { LoggingState, WorkersState } from '../../../../../stores';
import { CancelLogging, SetLoggingLocation, StarLoggingLocation } from '../../../../../stores/logging/logging.actions';
import { setDiscordStatus } from '../../../../helpers/electron';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.page.html',
  styleUrls: ['./logging.page.scss'],
})
export class LoggingPage implements OnInit {

  public locationData = this.contentService.getLoggingLocations();

  public get setAction() {
    return SetLoggingLocation;
  }

  public get cancelAction() {
    return CancelLogging;
  }

  public get favoriteAction() {
    return StarLoggingLocation;
  }

  public pageMetadata = { totalDiscovered: 0, totalLocations: 0 };

  @Select(LoggingState.level) level$!: Observable<number>;
  @Select(LoggingState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(LoggingState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;
  @Select(LoggingState.starredNodes) starredLocations$!: Observable<Record<string, boolean>>;
  @Select(WorkersState.gatheringWorkers) gatheringWorkers$!: Observable<{
    workerAllocations: IGameWorkersGathering[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
    this.level$.pipe(first()).subscribe(level => {
      this.currentLocation$.pipe(first()).subscribe(currentLocation => {
        const state = currentLocation ? `Logging Lv.${level} @ ${currentLocation.location.name}...` : `Logging Lv.${level}, browsing...`;

        setDiscordStatus({
          state
        });
      });
    });
  }

}
