import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { IGameGatherLocation, IGameWorkersGathering } from '../../../interfaces';
import { AssignGatheringWorker, UnassignGatheringWorker } from '../../../stores/workers/workers.actions';

@Component({
  selector: 'app-gathering-page-display',
  templateUrl: './gathering-page-display.component.html',
  styleUrls: ['./gathering-page-display.component.scss'],
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

  public locations: IGameGatherLocation[] = [];
  private locSub!: Subscription;

  constructor(private store: Store, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.locSub = this.level$.subscribe(level => {
      this.locations = this.visibleLocations(this.locationData, level);
    });
  }

  ngOnDestroy() {
    this.locSub?.unsubscribe();
  }

  trackBy(index: number) {
    return index;
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

    const alert = await this.alertCtrl.create({
      header: 'Cancel gathering?',
      message: 'You are already gathering somewhere else. Gathering here will cancel that gathering and the time spend will be lost.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Continue',
          handler: () => {
            finish();
          }
        }
      ]
    });

    await alert.present();
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
