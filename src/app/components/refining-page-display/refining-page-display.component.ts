import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { sortBy } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { IGameRecipe, IGameRefiningRecipe, IGameWorkersRefining } from '../../../interfaces';
import { CharSelectState } from '../../../stores';
import { AssignRefiningWorker, UnassignRefiningWorker } from '../../../stores/workers/workers.actions';
import { canCraftRecipe } from '../../helpers';
import { ContentService } from '../../services/content.service';
import { ItemCreatorService } from '../../services/item-creator.service';

@Component({
  selector: 'app-refining-page-display',
  templateUrl: './refining-page-display.component.html',
  styleUrls: ['./refining-page-display.component.scss'],
})
export class RefiningPageDisplayComponent implements OnInit, OnDestroy {

  @Input() tradeskill = '';
  @Input() level$!: Observable<number>;
  @Input() currentQueue$!: Observable<{ queue: IGameRefiningRecipe[]; size: number }>;
  @Input() resources$!: Observable<Record<string, number>>;
  @Input() refiningWorkers$!: Observable<{
    workerAllocations: IGameWorkersRefining[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  @Input() locationData: { recipes: IGameRecipe[] } = { recipes: [] };
  @Input() startAction: any;
  @Input() cancelAction: any;

  @Select(CharSelectState.activeCharacterDiscoveries) discoveries$!: Observable<Record<string, boolean>>;
  private discoveriesSub!: Subscription;

  public type!: 'resources'|'items';
  public amounts: Record<string, number> = {};

  public resourceRecipes: IGameRecipe[] = [];
  public itemRecipes: IGameRecipe[] = [];

  constructor(
    private store: Store,
    private contentService: ContentService,
    private itemCreatorService: ItemCreatorService
  ) {}

  ngOnInit() {
    this.discoveriesSub = this.discoveries$.subscribe((discoveries) => {
      this.resourceRecipes = this.visibleRecipes(discoveries, this.locationData.recipes, 'resources');
      this.itemRecipes = this.visibleRecipes(discoveries, this.locationData.recipes, 'items');

      if(!this.type) {
        this.type = this.resourceRecipes.length > 0 ? 'resources' : 'items';
      }
    });
  }

  ngOnDestroy() {
    this.discoveriesSub?.unsubscribe();
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

  visibleRecipes(discoveries: Record<string, boolean>, recipes: IGameRecipe[], type: 'resources'|'items'): IGameRecipe[] {
    const validRecipes = recipes
      .filter((recipe: IGameRecipe) => {
        if(type === 'resources') {
          return this.contentService.isResource(recipe.result);
        }

        if(type === 'items') {
          return this.contentService.isItem(recipe.result);
        }

        return false;
      })
      .filter((recipe: IGameRecipe) => {
        const required = recipe.require || [];
        return required.every((req) => discoveries[req]);
      });

    return sortBy(validRecipes, 'result');
  }

  canCraftRecipe(resources: Record<string, number>, recipe: IGameRecipe, amount = 1): boolean {
    return canCraftRecipe(resources, recipe, amount);
  }

  craft(recipe: IGameRecipe, amount = 1) {
    this.amounts[recipe.result] = 1;

    this.store.dispatch(new this.startAction(recipe, amount));
  }

  cancel(jobIndex: number) {
    this.store.dispatch(new this.cancelAction(jobIndex));
  }

  workersAllocatedToRecipe(allWorkers: IGameWorkersRefining[], recipe: IGameRecipe): number {
    return allWorkers.filter(w => w.recipe.result === recipe.result && w.tradeskill === this.tradeskill).length;
  }

  assignWorker(recipe: IGameRecipe) {
    this.store.dispatch(new AssignRefiningWorker(this.tradeskill, recipe));
  }

  unassignWorker(recipe: IGameRecipe) {
    this.store.dispatch(new UnassignRefiningWorker(this.tradeskill, recipe));
  }

}
