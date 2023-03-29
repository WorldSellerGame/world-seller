import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, first } from 'rxjs';
import { IGameItem, IGameRecipe, IGameRefiningOptions, IGameRefiningRecipe, IGameWorkersRefining } from '../../../../../interfaces';
import { CharSelectState, WeavingState, WorkersState } from '../../../../../stores';

import {
  CancelWeavingJob, ChangeWeavingFilterOption,
  StarWeavingRecipe, StartWeavingJob
} from '../../../../../stores/weaving/weaving.actions';
import { setDiscordStatus } from '../../../../helpers/electron';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-weaving',
  templateUrl: './weaving.page.html',
  styleUrls: ['./weaving.page.scss'],
})
export class WeavingPage implements OnInit {

  public locationData: IGameRecipe[] = [];

  public get startAction() {
    return StartWeavingJob;
  }

  public get cancelAction() {
    return CancelWeavingJob;
  }

  public get optionAction() {
    return ChangeWeavingFilterOption;
  }

  public get favoriteAction() {
    return StarWeavingRecipe;
  }

  public pageMetadata = { totalDiscovered: 0, totalRecipes: 0 };

  @Select(WeavingState.level) level$!: Observable<number>;
  @Select(WeavingState.currentQueue) currentQueue$!: Observable<{ queue: IGameRefiningRecipe[]; size: number }>;
  @Select(WeavingState.options) options$!: Observable<IGameRefiningOptions>;
  @Select(WeavingState.starred) starred$!: Observable<Record<string, boolean>>;

  @Select(CharSelectState.activeCharacterInventory) items$!: Observable<IGameItem[]>;
  @Select(WorkersState.refiningWorkers) refiningWorkers$!: Observable<{
    workerAllocations: IGameWorkersRefining[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(private contentService: ContentService) { }

  ngOnInit() {
    this.locationData = this.contentService.getWeavingRecipes();

    this.level$.pipe(first()).subscribe(level => {
      this.currentQueue$.pipe(first()).subscribe(currentQueue => {
        const state = currentQueue.queue.length > 0
          ? `Weaving Lv.${level} @ ${currentQueue.queue[0].recipe.result}...`
          : `Weaving Lv.${level}, browsing...`;

        setDiscordStatus({
          state
        });
      });
    });
  }
}
