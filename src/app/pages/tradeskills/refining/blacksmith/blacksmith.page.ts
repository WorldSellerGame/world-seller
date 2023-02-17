import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameRefiningRecipe, IGameWorkersRefining } from '../../../../../interfaces';
import { BlacksmithingState, CharSelectState, WorkersState } from '../../../../../stores';

import { CancelBlacksmithingJob, StartBlacksmithingJob } from '../../../../../stores/blacksmithing/blacksmithing.actions';
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

  @Select(BlacksmithingState.level) level$!: Observable<number>;
  @Select(BlacksmithingState.currentQueue) currentQueue$!: Observable<{ queue: IGameRefiningRecipe[]; size: number }>;

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
