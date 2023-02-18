import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameRefiningRecipe, IGameWorkersRefining } from '../../../../../interfaces';
import { AlchemyState, CharSelectState, WorkersState } from '../../../../../stores';

import { CancelAlchemyJob, StartAlchemyJob } from '../../../../../stores/alchemy/alchemy.actions';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-alchemy',
  templateUrl: './alchemy.page.html',
  styleUrls: ['./alchemy.page.scss'],
})
export class AlchemyPage implements OnInit {

  public get locationData() {
    return this.contentService.alchemy;
  }

  public get startAction() {
    return StartAlchemyJob;
  }

  public get cancelAction() {
    return CancelAlchemyJob;
  }

  public amounts: Record<string, number> = {};

  @Select(AlchemyState.level) level$!: Observable<number>;
  @Select(AlchemyState.currentQueue) currentQueue$!: Observable<{ queue: IGameRefiningRecipe[]; size: number }>;

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
