import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameRecipe, IGameRefiningRecipe } from '../../../interfaces';
import { CharSelectState, CookingState } from '../../../stores';

import { sortBy } from 'lodash';
import * as locationData from '../../../assets/content/cooking.json';
import * as itemsData from '../../../assets/content/items.json';
import { ItemCreatorService } from '../../services/item-creator.service';
import { CancelCookingJob, StartCookingJob } from '../../../stores/cooking/cooking.actions';

@Component({
  selector: 'app-cooking',
  templateUrl: './cooking.page.html',
  styleUrls: ['./cooking.page.scss'],
})
export class CookingPage implements OnInit {

  public readonly locationData = (locationData as any).default || locationData;
  public readonly itemsData = (itemsData as any).default || itemsData;

  public amounts: Record<string, number> = {};

  @Select(CookingState.level) level$!: Observable<number>;
  @Select(CookingState.currentQueue) currentQueue$!: Observable<{ queue: IGameRefiningRecipe[]; size: number }>;

  @Select(CharSelectState.activeCharacterResources) resources$!: Observable<Record<string, number>>;

  constructor(private store: Store, private itemCreatorService: ItemCreatorService) { }

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

  sortRecipes(recipes: IGameRecipe[]): IGameRecipe[] {
    return sortBy(recipes, 'result');
  }

  canCraftRecipe(resources: Record<string, number>, recipe: IGameRecipe, amount = 1): boolean {
    return Object.keys(recipe.ingredients).every(ingredient => resources[ingredient] >= (recipe.ingredients[ingredient] * amount));
  }

  craft(recipe: IGameRecipe, amount = 1) {
    this.amounts[recipe.result] = 1;

    this.store.dispatch(new StartCookingJob(recipe, amount));
  }

  cancel(jobIndex: number) {
    this.store.dispatch(new CancelCookingJob(jobIndex));
  }

}
