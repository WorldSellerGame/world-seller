import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameRecipe, IGameRefiningRecipe } from '../../../../../interfaces';
import { BlacksmithingState, CharSelectState } from '../../../../../stores';

import { sortBy } from 'lodash';
import * as locationData from '../../../../../assets/content/blacksmithing.json';
import * as itemsData from '../../../../../assets/content/items.json';
import { CancelBlacksmithingJob, StartBlacksmithingJob } from '../../../../../stores/blacksmithing/blacksmithing.actions';
import { ItemCreatorService } from '../../../../services/item-creator.service';

@Component({
  selector: 'app-blacksmith',
  templateUrl: './blacksmith.page.html',
  styleUrls: ['./blacksmith.page.scss'],
})
export class BlacksmithPage implements OnInit {

  public readonly locationData = (locationData as any).default || locationData;
  public readonly itemsData = (itemsData as any).default || itemsData;

  public amounts: Record<string, number> = {};
  public recipes$!: Observable<IGameRecipe[]>;

  @Select(BlacksmithingState.level) level$!: Observable<number>;
  @Select(BlacksmithingState.currentQueue) currentQueue$!: Observable<{ queue: IGameRefiningRecipe[]; size: number }>;

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

  visibleRecipes(resources: Record<string, number>, recipes: IGameRecipe[]): IGameRecipe[] {
    const validRecipes = recipes.filter((recipe: IGameRecipe) => {
      const required = recipe.require || [];
      return required.every((req) => resources[req] > 0);
    });

    return sortBy(validRecipes, 'result');
  }

  iconForRecipe(recipe: IGameRecipe) {
    return this.itemCreatorService.iconFor(recipe.result);
  }

  modifyAmount(recipe: IGameRecipe, amount: number) {
    this.amounts[recipe.result] = (this.amounts[recipe.result] || 1) + amount;
  }

  canCraftRecipe(resources: Record<string, number>, recipe: IGameRecipe, amount = 1): boolean {
    return Object.keys(recipe.ingredients).every(ingredient => resources[ingredient] >= (recipe.ingredients[ingredient] * amount));
  }

  craft(recipe: IGameRecipe, amount = 1) {
    this.amounts[recipe.result] = 1;

    this.store.dispatch(new StartBlacksmithingJob(recipe, amount));
  }

  cancel(jobIndex: number) {
    this.store.dispatch(new CancelBlacksmithingJob(jobIndex));
  }

}
