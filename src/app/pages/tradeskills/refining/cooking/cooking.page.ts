import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameRefiningRecipe, IGameWorkersRefining } from '../../../../../interfaces';
import { CharSelectState, CookingState, WorkersState } from '../../../../../stores';

import { CancelCookingJob, StartCookingJob } from '../../../../../stores/cooking/cooking.actions';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-cooking',
  templateUrl: './cooking.page.html',
  styleUrls: ['./cooking.page.scss'],
})
export class CookingPage implements OnInit {

  public get locationData() {
    return this.contentService.cooking;
  }

  public get startAction() {
    return StartCookingJob;
  }

  public get cancelAction() {
    return CancelCookingJob;
  }

  @Select(CookingState.level) level$!: Observable<number>;
  @Select(CookingState.currentQueue) currentQueue$!: Observable<{ queue: IGameRefiningRecipe[]; size: number }>;

  @Select(CharSelectState.activeCharacterResources) resources$!: Observable<Record<string, number>>;
  @Select(WorkersState.refiningWorkers) refiningWorkers$!: Observable<{
    workerAllocations: IGameWorkersRefining[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(private contentService: ContentService) { }

  ngOnInit() {
  }

}
