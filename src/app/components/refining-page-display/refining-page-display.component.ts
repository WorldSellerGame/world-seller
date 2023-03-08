import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { sortBy } from 'lodash';
import { IGameRecipe, IGameRefiningOptions, IGameRefiningRecipe, IGameWorkersRefining } from '../../../interfaces';
import { AssignRefiningWorker, UnassignRefiningWorker } from '../../../stores/workers/workers.actions';
import { canCraftRecipe } from '../../helpers';
import { ContentService } from '../../services/content.service';
import { ItemCreatorService } from '../../services/item-creator.service';

@Component({
  selector: 'app-refining-page-display',
  templateUrl: './refining-page-display.component.html',
  styleUrls: ['./refining-page-display.component.scss'],
})
export class RefiningPageDisplayComponent implements OnInit, OnChanges {

  @Input() tradeskill = '';
  @Input() level = 0;
  @Input() currentQueue: { queue: IGameRefiningRecipe[]; size: number } = { queue: [], size: 1 };
  @Input() resources: Record<string, number> = {};

  @Input() refiningWorkers: {
    workerAllocations: IGameWorkersRefining[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  } = { workerAllocations: [], canAssignWorker: false, hasWorkers: false };

  @Input() filterOptions: IGameRefiningOptions = {
    hideDiscovered: false,
    hideNew: false,
    hideHasIngredients: false,
    hideHasNoIngredients: false,
  };

  @Input() discoveries: Record<string, boolean> = {};
  @Input() locationData: { recipes: IGameRecipe[] } = { recipes: [] };
  @Input() startAction: any;
  @Input() cancelAction: any;
  @Input() changeOptionAction: any;

  public type!: 'resources'|'items';
  public amounts: Record<string, number> = {};

  public resourceRecipes: IGameRecipe[] = [];
  public itemRecipes: IGameRecipe[] = [];

  public workersPerRecipe: Record<string, number> = {};

  constructor(
    private store: Store,
    private contentService: ContentService,
    private itemCreatorService: ItemCreatorService
  ) {}

  ngOnInit() {
    this.setVisibleRecipes();
    this.setRefiningWorkerHash();
  }

  ngOnChanges(changes: any) {
    if(changes.discoveries || changes.filterOptions || changes.resources) {
      this.setVisibleRecipes();
    }

    if(changes.refiningWorkers) {
      this.setRefiningWorkerHash();
    }
  }

  setVisibleRecipes() {
    this.resourceRecipes = this.visibleRecipes(this.locationData.recipes, 'resources');
    this.itemRecipes = this.visibleRecipes(this.locationData.recipes, 'items');

    if(!this.type) {
      this.type = this.resourceRecipes.length > 0 ? 'resources' : 'items';
    }

    if(this.type === 'resources' && this.resourceRecipes.length === 0) {
      this.type = 'items';
    }

    if(this.type === 'items' && this.itemRecipes.length === 0) {
      this.type = 'resources';
    }
  }

  setRefiningWorkerHash() {
    const workersPerRecipe: Record<string, number> = {};

    this.refiningWorkers.workerAllocations.forEach((worker) => {
      if(worker.tradeskill !== this.tradeskill) {
        return;
      }

      workersPerRecipe[worker.recipe.result] ??= 0;
      workersPerRecipe[worker.recipe.result]++;
    });

    this.workersPerRecipe = workersPerRecipe;
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

  visibleRecipes(recipes: IGameRecipe[], type: 'resources'|'items'): IGameRecipe[] {
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
        return required.every((req) => this.discoveries[req]);
      })
      .filter((recipe: IGameRecipe) => {
        if(this.filterOptions.hideDiscovered && this.discoveries[recipe.result]) {
          return false;
        }

        if(this.filterOptions.hideNew && !this.discoveries[recipe.result]) {
          return false;
        }

        if(this.filterOptions.hideHasIngredients && this.canCraftRecipe(this.resources, recipe)) {
          return false;
        }

        if(this.filterOptions.hideHasNoIngredients && !this.canCraftRecipe(this.resources, recipe)) {
          return false;
        }

        return true;
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

  assignWorker(recipe: IGameRecipe) {
    this.store.dispatch(new AssignRefiningWorker(this.tradeskill, recipe));
  }

  unassignWorker(recipe: IGameRecipe) {
    this.store.dispatch(new UnassignRefiningWorker(this.tradeskill, recipe));
  }

  changeOption(option: keyof IGameRefiningOptions, value: boolean) {
    this.store.dispatch(new this.changeOptionAction(option, value));
  }

}
