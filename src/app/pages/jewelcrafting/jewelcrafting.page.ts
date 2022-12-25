import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameRecipe, IGameRefiningRecipe } from '../../../interfaces';
import { CharSelectState, JewelcraftingState } from '../../../stores';

import { sortBy } from 'lodash';
import * as locationData from '../../../assets/content/jewelcrafting.json';
import * as itemsData from '../../../assets/content/items.json';
import { ItemCreatorService } from '../../services/item-creator.service';
import { CancelJewelcraftingJob, StartJewelcraftingJob } from '../../../stores/jewelcrafting/jewelcrafting.actions';

@Component({
  selector: 'app-jewelcrafting',
  templateUrl: './jewelcrafting.page.html',
  styleUrls: ['./jewelcrafting.page.scss'],
})
export class JewelcraftingPage implements OnInit {

  public readonly locationData = (locationData as any).default || locationData;
  public readonly itemsData = (itemsData as any).default || itemsData;

  public amounts: Record<string, number> = {};

  @Select(JewelcraftingState.level) level$!: Observable<number>;
  @Select(JewelcraftingState.currentQueue) currentQueue$!: Observable<IGameRefiningRecipe[]>;

  @Select(CharSelectState.activeCharacterResources) resources$!: Observable<Record<string, number>>;

  constructor(private store: Store, private itemCreatorService: ItemCreatorService) { }

  ngOnInit() {
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

    this.store.dispatch(new StartJewelcraftingJob(recipe, amount));
  }

  cancel(jobIndex: number) {
    this.store.dispatch(new CancelJewelcraftingJob(jobIndex));
  }

}
