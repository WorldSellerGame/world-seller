import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameGatherLocation, IGameWorkersGathering } from '../../../../../interfaces';
import { ForagingState, WorkersState } from '../../../../../stores';
import { CancelForaging, SetForagingLocation } from '../../../../../stores/foraging/foraging.actions';
import { AssignGatheringWorker, UnassignGatheringWorker } from '../../../../../stores/workers/workers.actions';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-foraging',
  templateUrl: './foraging.page.html',
  styleUrls: ['./foraging.page.scss'],
})
export class ForagingPage implements OnInit {

  public get locationData() {
    return this.contentService.foraging;
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
  }

  visibleLocations(locations: IGameGatherLocation[], currentLevel = 0) {
    return locations.filter(location => currentLevel >= location.level.min);
  }

  gather(location: IGameGatherLocation) {
    this.store.dispatch(new SetForagingLocation(location));
  }

  cancelGather() {
    this.store.dispatch(new CancelForaging());
  }

  workersAllocatedToLocation(allWorkers: IGameWorkersGathering[], location: IGameGatherLocation): number {
    return allWorkers.filter(w => w.location.name === location.name && w.tradeskill === 'foraging').length;
  }

  allocateWorker(location: IGameGatherLocation) {
    this.store.dispatch(new AssignGatheringWorker('foraging', location));
  }

  unallocateWorker(location: IGameGatherLocation) {
    this.store.dispatch(new UnassignGatheringWorker('foraging', location));
  }

}
