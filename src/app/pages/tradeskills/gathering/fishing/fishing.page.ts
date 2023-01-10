import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameGatherLocation, IGameWorkersGathering } from '../../../../../interfaces';
import { FishingState, WorkersState } from '../../../../../stores';
import { CancelFishing, SetFishingLocation } from '../../../../../stores/fishing/fishing.actions';
import { AssignGatheringWorker, UnassignGatheringWorker } from '../../../../../stores/workers/workers.actions';
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

  @Select(FishingState.level) level$!: Observable<number>;
  @Select(FishingState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(FishingState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;
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
    this.store.dispatch(new SetFishingLocation(location));
  }

  cancelGather() {
    this.store.dispatch(new CancelFishing());
  }

  workersAllocatedToLocation(allWorkers: IGameWorkersGathering[], location: IGameGatherLocation): number {
    return allWorkers.filter(w => w.location.name === location.name && w.tradeskill === 'fishing').length;
  }

  allocateWorker(location: IGameGatherLocation) {
    this.store.dispatch(new AssignGatheringWorker('fishing', location));
  }

  unallocateWorker(location: IGameGatherLocation) {
    this.store.dispatch(new UnassignGatheringWorker('fishing', location));
  }

}
