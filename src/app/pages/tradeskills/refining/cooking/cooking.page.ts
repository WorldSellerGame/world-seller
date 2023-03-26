import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, first } from 'rxjs';
import { IGameItem, IGameRecipe, IGameRefiningOptions, IGameRefiningRecipe, IGameWorkersRefining } from '../../../../../interfaces';
import { CharSelectState, CookingState, WorkersState } from '../../../../../stores';

import { CancelCookingJob, ChangeCookingFilterOption, StartCookingJob } from '../../../../../stores/cooking/cooking.actions';
import { setDiscordStatus } from '../../../../helpers/electron';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-cooking',
  templateUrl: './cooking.page.html',
  styleUrls: ['./cooking.page.scss'],
})
export class CookingPage implements OnInit {

  public locationData: IGameRecipe[] = [];

  public get startAction() {
    return StartCookingJob;
  }

  public get cancelAction() {
    return CancelCookingJob;
  }

  public get optionAction() {
    return ChangeCookingFilterOption;
  }

  @Select(CookingState.level) level$!: Observable<number>;
  @Select(CookingState.currentQueue) currentQueue$!: Observable<{ queue: IGameRefiningRecipe[]; size: number }>;
  @Select(CookingState.options) options$!: Observable<IGameRefiningOptions>;

  @Select(CharSelectState.activeCharacterInventory) items$!: Observable<IGameItem[]>;
  @Select(WorkersState.refiningWorkers) refiningWorkers$!: Observable<{
    workerAllocations: IGameWorkersRefining[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(private contentService: ContentService) { }

  ngOnInit() {
    this.locationData = this.contentService.getCookingRecipes();

    this.level$.pipe(first()).subscribe(level => {
      this.currentQueue$.pipe(first()).subscribe(currentQueue => {
        const state = currentQueue.queue.length > 0
          ? `Cooking Lv.${level} @ ${currentQueue.queue[0].recipe.result}...`
          : `Cooking Lv.${level}, browsing...`;

        setDiscordStatus({
          state
        });
      });
    });
  }

}
