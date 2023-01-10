import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameGatherLocation, IGameWorkersGathering } from '../../../../../interfaces';
import { LoggingState, WorkersState } from '../../../../../stores';
import { CancelLogging, SetLoggingLocation } from '../../../../../stores/logging/logging.actions';
import { AssignGatheringWorker, UnassignGatheringWorker } from '../../../../../stores/workers/workers.actions';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.page.html',
  styleUrls: ['./logging.page.scss'],
})
export class LoggingPage implements OnInit {

  public get locationData() {
    return this.contentService.logging;
  }

  @Select(LoggingState.level) level$!: Observable<number>;
  @Select(LoggingState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(LoggingState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;
  @Select(WorkersState.gatheringWorkers) gatheringWorkers$!: Observable<{
    workerAllocations: IGameWorkersGathering[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
  }

  visibleLocations(locations: IGameGatherLocation[], currentLevel = 0) {
    return locations.filter(location => currentLevel >= location.level.min);
  }

  gather(location: IGameGatherLocation) {
    this.store.dispatch(new SetLoggingLocation(location));
  }

  cancelGather() {
    this.store.dispatch(new CancelLogging());
  }

  workersAllocatedToLocation(allWorkers: IGameWorkersGathering[], location: IGameGatherLocation): number {
    return allWorkers.filter(w => w.location.name === location.name && w.tradeskill === 'logging').length;
  }

  allocateWorker(location: IGameGatherLocation) {
    this.store.dispatch(new AssignGatheringWorker('logging', location));
  }

  unallocateWorker(location: IGameGatherLocation) {
    this.store.dispatch(new UnassignGatheringWorker('logging', location));
  }

}
