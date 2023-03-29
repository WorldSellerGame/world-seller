import { Component, OnInit } from '@angular/core';

import { Select, Store } from '@ngxs/store';
import { Observable, first } from 'rxjs';
import { IGameGatherLocation, IGameWorkersGathering } from '../../../../../interfaces';
import { MiningState, WorkersState } from '../../../../../stores';
import { CancelMining, SetMiningLocation, StarMiningLocation } from '../../../../../stores/mining/mining.actions';
import { setDiscordStatus } from '../../../../helpers/electron';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-mining',
  templateUrl: './mining.page.html',
  styleUrls: ['./mining.page.scss'],
})
export class MiningPage implements OnInit {

  public locationData = this.contentService.getMiningLocations();

  public get setAction() {
    return SetMiningLocation;
  }

  public get cancelAction() {
    return CancelMining;
  }

  public get favoriteAction() {
    return StarMiningLocation;
  }

  public pageMetadata = { totalDiscovered: 0, totalLocations: 0 };

  @Select(MiningState.level) level$!: Observable<number>;
  @Select(MiningState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(MiningState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;
  @Select(MiningState.starredNodes) starredLocations$!: Observable<Record<string, boolean>>;
  @Select(WorkersState.gatheringWorkers) gatheringWorkers$!: Observable<{
    workerAllocations: IGameWorkersGathering[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
    this.level$.pipe(first()).subscribe(level => {
      this.currentLocation$.pipe(first()).subscribe(currentLocation => {
        const state = currentLocation ? `Mining Lv.${level} @ ${currentLocation.location.name}...` : `Mining Lv.${level}, browsing...`;

        setDiscordStatus({
          state
        });
      });
    });
  }

}
