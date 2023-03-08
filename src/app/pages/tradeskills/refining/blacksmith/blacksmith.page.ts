import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, first } from 'rxjs';
import { IGameRefiningOptions, IGameRefiningRecipe, IGameWorkersRefining } from '../../../../../interfaces';
import { BlacksmithingState, CharSelectState, WorkersState } from '../../../../../stores';

import { CancelBlacksmithingJob, ChangeBlacksmithingFilterOption, StartBlacksmithingJob } from '../../../../../stores/blacksmithing/blacksmithing.actions';
import { setDiscordStatus } from '../../../../helpers/electron';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-blacksmith',
  templateUrl: './blacksmith.page.html',
  styleUrls: ['./blacksmith.page.scss'],
})
export class BlacksmithPage implements OnInit {

  public get locationData() {
    return this.contentService.blacksmithing;
  }

  public get startAction() {
    return StartBlacksmithingJob;
  }

  public get cancelAction() {
    return CancelBlacksmithingJob;
  }

  public get optionAction() {
    return ChangeBlacksmithingFilterOption;
  }

  @Select(BlacksmithingState.level) level$!: Observable<number>;
  @Select(BlacksmithingState.currentQueue) currentQueue$!: Observable<{ queue: IGameRefiningRecipe[]; size: number }>;
  @Select(BlacksmithingState.options) options$!: Observable<IGameRefiningOptions>;

  @Select(CharSelectState.activeCharacterDiscoveries) discoveries$!: Observable<Record<string, boolean>>;
  @Select(CharSelectState.activeCharacterResources) resources$!: Observable<Record<string, number>>;
  @Select(WorkersState.refiningWorkers) refiningWorkers$!: Observable<{
    workerAllocations: IGameWorkersRefining[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(private contentService: ContentService) { }

  ngOnInit() {
    this.level$.pipe(first()).subscribe(level => {
      this.currentQueue$.pipe(first()).subscribe(currentQueue => {
        const state = currentQueue.queue.length > 0
          ? `Blacksmithing Lv.${level} @ ${currentQueue.queue[0].recipe.result}...`
          : `Blacksmithing Lv.${level}, browsing...`;

        setDiscordStatus({
          state
        });
      });
    });
  }

}
