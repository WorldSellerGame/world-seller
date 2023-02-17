import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameGatherLocation, IGameWorkersGathering } from '../../../interfaces';
import { AssignGatheringWorker, UnassignGatheringWorker } from '../../../stores/workers/workers.actions';

@Component({
  selector: 'app-gathering-page-display',
  templateUrl: './gathering-page-display.component.html',
  styleUrls: ['./gathering-page-display.component.scss'],
})
export class GatheringPageDisplayComponent implements OnInit {

  @Input() tradeskill = '';
  @Input() level$!: Observable<number>;
  @Input() currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;
  @Input() cooldowns$!: Observable<Record<string, number>>;
  @Input() gatheringWorkers$!: Observable<{
    workerAllocations: IGameWorkersGathering[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  @Input() locationData: { locations: IGameGatherLocation[] } = { locations: [] };
  @Input() setAction: any;
  @Input() cancelAction: any;

  constructor(private store: Store) { }

  ngOnInit() {}

  visibleLocations(locations: IGameGatherLocation[], currentLevel = 0) {
    return locations.filter(location => currentLevel >= location.level.min);
  }

  gather(location: IGameGatherLocation) {
    this.store.dispatch(new this.setAction(location));
  }

  cancelGather() {
    this.store.dispatch(new this.cancelAction());
  }

  workersAllocatedToLocation(allWorkers: IGameWorkersGathering[], location: IGameGatherLocation): number {
    return allWorkers.filter(w => w.location.name === location.name && w.tradeskill === this.tradeskill).length;
  }

  allocateWorker(location: IGameGatherLocation) {
    this.store.dispatch(new AssignGatheringWorker(this.tradeskill, location));
  }

  unallocateWorker(location: IGameGatherLocation) {
    this.store.dispatch(new UnassignGatheringWorker(this.tradeskill, location));
  }

}