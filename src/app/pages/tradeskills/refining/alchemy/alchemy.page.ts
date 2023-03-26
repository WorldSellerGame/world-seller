import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, first } from 'rxjs';
import { IGameItem, IGameRecipe, IGameRefiningOptions, IGameRefiningRecipe, IGameWorkersRefining } from '../../../../../interfaces';
import { AlchemyState, CharSelectState, WorkersState } from '../../../../../stores';

import { CancelAlchemyJob, ChangeAlchemyFilterOption, StartAlchemyJob } from '../../../../../stores/alchemy/alchemy.actions';
import { setDiscordStatus } from '../../../../helpers/electron';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-alchemy',
  templateUrl: './alchemy.page.html',
  styleUrls: ['./alchemy.page.scss'],
})
export class AlchemyPage implements OnInit {

  public locationData: IGameRecipe[] = [];

  public get startAction() {
    return StartAlchemyJob;
  }

  public get cancelAction() {
    return CancelAlchemyJob;
  }

  public get optionAction() {
    return ChangeAlchemyFilterOption;
  }

  public amounts: Record<string, number> = {};

  @Select(AlchemyState.level) level$!: Observable<number>;
  @Select(AlchemyState.currentQueue) currentQueue$!: Observable<{ queue: IGameRefiningRecipe[]; size: number }>;
  @Select(AlchemyState.options) options$!: Observable<IGameRefiningOptions>;

  @Select(CharSelectState.activeCharacterInventory) items$!: Observable<IGameItem[]>;
  @Select(WorkersState.refiningWorkers) refiningWorkers$!: Observable<{
    workerAllocations: IGameWorkersRefining[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(private contentService: ContentService) { }

  ngOnInit() {
    this.locationData = this.contentService.getAlchemyRecipes();

    this.level$.pipe(first()).subscribe(level => {
      this.currentQueue$.pipe(first()).subscribe(currentQueue => {
        const state = currentQueue.queue.length > 0
          ? `Alchemy Lv.${level} @ ${currentQueue.queue[0].recipe.result}...`
          : `Alchemy Lv.${level}, browsing...`;

        setDiscordStatus({
          state
        });
      });
    });
  }

}
