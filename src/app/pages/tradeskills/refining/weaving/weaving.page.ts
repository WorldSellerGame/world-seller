import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameRecipe, IGameRefiningRecipe, IGameWorkersRefining } from '../../../../../interfaces';
import { CharSelectState, WeavingState, WorkersState } from '../../../../../stores';

import { sortBy } from 'lodash';
import { CancelWeavingJob, StartWeavingJob } from '../../../../../stores/weaving/weaving.actions';
import { AssignRefiningWorker, UnassignRefiningWorker } from '../../../../../stores/workers/workers.actions';
import { canCraftRecipe } from '../../../../helpers';
import { ContentService } from '../../../../services/content.service';
import { ItemCreatorService } from '../../../../services/item-creator.service';

@Component({
  selector: 'app-weaving',
  templateUrl: './weaving.page.html',
  styleUrls: ['./weaving.page.scss'],
})
export class WeavingPage implements OnInit {

  public get locationData() {
    return this.contentService.weaving;
  }

  public amounts: Record<string, number> = {};

  @Select(WeavingState.level) level$!: Observable<number>;
  @Select(WeavingState.currentQueue) currentQueue$!: Observable<{ queue: IGameRefiningRecipe[]; size: number }>;

  @Select(CharSelectState.activeCharacterResources) resources$!: Observable<Record<string, number>>;
  @Select(WorkersState.refiningWorkers) refiningWorkers$!: Observable<{
    workerAllocations: IGameWorkersRefining[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(private store: Store, private itemCreatorService: ItemCreatorService, private contentService: ContentService) { }

  ngOnInit() {
  }

  isQueueFull(queueInfo: { queue: IGameRefiningRecipe[]; size: number } | null): boolean {
    if(!queueInfo) {
      return false;
    }

    const { queue, size } = queueInfo;
    return queue.length >= size;
  }

  trackBy(index: number) {
    return index;
  }

  iconForRecipe(recipe: IGameRecipe) {
    return this.itemCreatorService.iconFor(recipe.result);
  }

  modifyAmount(recipe: IGameRecipe, amount: number) {
    this.amounts[recipe.result] = (this.amounts[recipe.result] || 1) + amount;
  }

  visibleRecipes(resources: Record<string, number>, recipes: IGameRecipe[]): IGameRecipe[] {
    const validRecipes = recipes.filter((recipe: IGameRecipe) => {
      const required = recipe.require || [];
      return required.every((req) => resources[req] > 0);
    });

    return sortBy(validRecipes, 'result');
  }

  canCraftRecipe(resources: Record<string, number>, recipe: IGameRecipe, amount = 1): boolean {
    return canCraftRecipe(resources, recipe, amount);
  }

  craft(recipe: IGameRecipe, amount = 1) {
    this.amounts[recipe.result] = 1;

    this.store.dispatch(new StartWeavingJob(recipe, amount));
  }

  cancel(jobIndex: number) {
    this.store.dispatch(new CancelWeavingJob(jobIndex));
  }

  workersAllocatedToRecipe(allWorkers: IGameWorkersRefining[], recipe: IGameRecipe): number {
    return allWorkers.filter(w => w.recipe.result === recipe.result && w.tradeskill === 'weaving').length;
  }

  assignWorker(recipe: IGameRecipe) {
    this.store.dispatch(new AssignRefiningWorker('weaving', recipe));
  }

  unassignWorker(recipe: IGameRecipe) {
    this.store.dispatch(new UnassignRefiningWorker('weaving', recipe));
  }

}
