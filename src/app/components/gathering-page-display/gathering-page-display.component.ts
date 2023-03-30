import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { sortBy } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { IGameGatherLocation, IGameItem, IGameWorkersGathering, Stat } from '../../../interfaces';
import { CharSelectState } from '../../../stores';
import { AssignGatheringWorker, UnassignGatheringWorker } from '../../../stores/workers/workers.actions';
import { calculateStat } from '../../helpers';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'app-gathering-page-display',
  templateUrl: './gathering-page-display.component.html',
  styleUrls: ['./gathering-page-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GatheringPageDisplayComponent implements OnInit, OnDestroy {


  @Input() tradeskill = '';
  @Input() level$!: Observable<number>;
  @Input() currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;
  @Input() cooldowns$!: Observable<Record<string, number>>;
  @Input() gatheringWorkers$!: Observable<{
    workerAllocations: IGameWorkersGathering[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  @Input() locationData: IGameGatherLocation[] = [];
  @Input() setAction: any;
  @Input() cancelAction: any;
  @Input() favoriteAction: any;

  @Input() starredLocations: Record<string, boolean> | null = {};

  @Output() totalsMetadata = new EventEmitter<{ totalDiscovered: number; totalLocations: number }>();

  public allStarredLocations: Record<string, boolean> = {};
  public visibleStars: Record<string, boolean> = {};

  public locations: IGameGatherLocation[] = [];
  private locSub!: Subscription;
  private starSub!: Subscription;

  @Select(CharSelectState.activeCharacterEquipment) equipment$!: Observable<Record<string, IGameItem>>;

  constructor(
    private store: Store,
    private notifyService: NotifyService
  ) { }

  ngOnInit() {
    this.allStarredLocations = this.starredLocations || {};

    this.locSub = this.level$.subscribe(level => {
      this.locations = this.visibleLocations(this.locationData, level);
      this.resortLocations();

      this.setMetadata();
    });
  }

  ngOnDestroy() {
    this.locSub?.unsubscribe();
    this.starSub?.unsubscribe();
  }

  trackBy(index: number) {
    return index;
  }

  resortLocations() {
    this.locations = sortBy(this.locations, [loc => !this.allStarredLocations[loc.name], loc => loc.level.min]);
  }

  toggleFavorite(location: IGameGatherLocation, value: boolean) {
    this.store.dispatch(new this.favoriteAction(location));
    this.allStarredLocations[location.name] = value;
    this.resortLocations();
  }

  setMetadata() {
    const totalDiscovered = this.locations.length;
    const totalLocations = this.locationData.length;

    this.totalsMetadata.emit({ totalDiscovered, totalLocations });
  }

  private getStatForTradeskill() {
    switch(this.tradeskill) {
      case 'fishing':   return { base: Stat.FishingPower, percent: Stat.FishingPowerPercent };
      case 'foraging':  return { base: Stat.ScythePower,  percent: Stat.ScythePowerPercent };
      case 'hunting':   return { base: Stat.HuntingPower, percent: Stat.HuntingPowerPercent };
      case 'logging':   return { base: Stat.AxePower,     percent: Stat.AxePowerPercent };
      case 'mining':    return { base: Stat.PickaxePower, percent: Stat.PickaxePowerPercent };
    }

    return undefined;
  }

  showRealDurationForLocation(location: IGameGatherLocation, equipment: Record<string, IGameItem>) {

    const stats = this.getStatForTradeskill();
    if(!stats) {
      return location.gatherTime;
    }

    const { base, percent } = stats;

    const gdrValue = calculateStat(equipment, base);
    const gdrPercent = calculateStat(equipment, percent);
    const reducedValue = (gdrPercent / 100) * location.gatherTime;

    return Math.max(1, Math.floor(location.gatherTime - reducedValue - gdrValue));
  }

  visibleLocations(locations: IGameGatherLocation[], currentLevel = 0) {
    return locations.filter(location => currentLevel >= location.level.min);
  }

  async gather(location: IGameGatherLocation) {
    const snapshot = this.store.snapshot();
    const areAnyActive = ['fishing', 'foraging', 'hunting', 'logging', 'mining']
      .some(tradeskill => snapshot[tradeskill].currentLocationDuration > 0);

    const finish = () => {
      this.store.dispatch(new this.setAction(location));
    };

    if(!areAnyActive) {
      finish();
      return;
    }

    this.notifyService.confirm(
      'Cancel gathering?',
      'You are already gathering somewhere else. Gathering here will cancel that gathering and the time spend will be lost.',
      [
        {
          text: 'No, keep gathering',
          role: 'cancel'
        },
        {
          text: 'Yes, start gathering here',
          handler: () => {
            finish();
          }
        }
      ]
    );
  }

  cancelGather() {
    this.store.dispatch(new this.cancelAction());
  }

  workersAllocatedToLocation(allWorkers: IGameWorkersGathering[], location: IGameGatherLocation): IGameWorkersGathering[] {
    return allWorkers.filter(w => w.location.name === location.name && w.tradeskill === this.tradeskill);
  }

  allocateWorker(location: IGameGatherLocation) {
    this.store.dispatch(new AssignGatheringWorker(this.tradeskill, location));
  }

  unallocateWorker(location: IGameGatherLocation) {
    this.store.dispatch(new UnassignGatheringWorker(this.tradeskill, location));
  }

  getHighestWorkerProgress(data: IGameWorkersGathering[]): number {
    return Math.max(...data.map(worker => worker.currentTick / worker.location.gatherTime));
  }

}
