import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameRefiningRecipe, IGameWorkersRefining } from '../../../../../interfaces';
import { CharSelectState, JewelcraftingState, WorkersState } from '../../../../../stores';

import { CancelJewelcraftingJob, StartJewelcraftingJob } from '../../../../../stores/jewelcrafting/jewelcrafting.actions';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-jewelcrafting',
  templateUrl: './jewelcrafting.page.html',
  styleUrls: ['./jewelcrafting.page.scss'],
})
export class JewelcraftingPage implements OnInit {

  public get locationData() {
    return this.contentService.jewelcrafting;
  }

  public get startAction() {
    return StartJewelcraftingJob;
  }

  public get cancelAction() {
    return CancelJewelcraftingJob;
  }

  @Select(JewelcraftingState.level) level$!: Observable<number>;
  @Select(JewelcraftingState.currentQueue) currentQueue$!: Observable<{ queue: IGameRefiningRecipe[]; size: number }>;

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
