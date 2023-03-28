import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, first } from 'rxjs';
import { IGameGatherLocation, IGameWorkersGathering } from '../../../../../interfaces';
import { HuntingState, WorkersState } from '../../../../../stores';
import { CancelHunting, SetHuntingLocation } from '../../../../../stores/hunting/hunting.actions';
import { setDiscordStatus } from '../../../../helpers/electron';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-hunting',
  templateUrl: './hunting.page.html',
  styleUrls: ['./hunting.page.scss'],
})
export class HuntingPage implements OnInit {

  public get locationData() {
    return this.contentService.getHuntingLocations();
  }

  public get setAction() {
    return SetHuntingLocation;
  }

  public get cancelAction() {
    return CancelHunting;
  }

  public pageMetadata = { totalDiscovered: 0, totalLocations: 0 };

  @Select(HuntingState.level) level$!: Observable<number>;
  @Select(HuntingState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(HuntingState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;
  @Select(WorkersState.gatheringWorkers) gatheringWorkers$!: Observable<{
    workerAllocations: IGameWorkersGathering[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
    this.level$.pipe(first()).subscribe(level => {
      this.currentLocation$.pipe(first()).subscribe(currentLocation => {
        const state = currentLocation ? `Hunting Lv.${level} @ ${currentLocation.location.name}...` : `Hunting Lv.${level}, browsing...`;

        setDiscordStatus({
          state
        });
      });
    });
  }

}
