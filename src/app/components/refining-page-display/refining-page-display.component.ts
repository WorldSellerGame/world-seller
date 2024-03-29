import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { sortBy } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import {
  IGameItem, IGameRecipe, IGameRefiningOptions,
  IGameRefiningRecipe, IGameResource, IGameWorkersRefining, ItemCategory, Tradeskill
} from '../../../interfaces';
import { CharSelectState } from '../../../stores';
import { GainResources } from '../../../stores/charselect/charselect.actions';
import { AssignRefiningWorker, UnassignRefiningWorker } from '../../../stores/workers/workers.actions';
import { canCraftRecipe } from '../../helpers';
import { ContentService } from '../../services/content.service';
import { ItemCreatorService } from '../../services/item-creator.service';

@Component({
  selector: 'app-refining-page-display',
  templateUrl: './refining-page-display.component.html',
  styleUrls: ['./refining-page-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RefiningPageDisplayComponent implements OnInit, OnChanges, OnDestroy {

  @Select(CharSelectState.activeCharacterDiscoveries) discoveries$!: Observable<Record<string, boolean>>;
  @Select(CharSelectState.activeCharacterResources) resources$!: Observable<Record<string, number>>;

  @Input() tradeskill = '';
  @Input() level = 0;
  @Input() currentQueue: { queue: IGameRefiningRecipe[]; size: number } = { queue: [], size: 1 };
  @Input() items: IGameItem[] = [];

  @Input() refiningWorkers: {
    workerAllocations: IGameWorkersRefining[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  } = { workerAllocations: [], canAssignWorker: false, hasWorkers: false };

  @Input() filterOptions: IGameRefiningOptions = {
    hideDiscovered: false,
    hideDiscoveredTables: false,
    hideHasIngredients: false,
    hideHasNoIngredients: false,
  };

  @Input() starredRecipes: Record<string, boolean> | null = {};
  @Input() locationData: IGameRecipe[] = [];
  @Input() startAction: any;
  @Input() cancelAction: any;
  @Input() favoriteAction: any;
  @Input() upgradeQueueAction: any;
  @Input() changeOptionAction: any;

  @Output() totalsMetadata = new EventEmitter<{ totalDiscovered: number; totalRecipes: number }>();

  public type!: 'resources'|'items';
  public activeRecipes: IGameRecipe[] = [];
  public amounts: Record<string, number> = {};
  public resources: Record<string, number> = {};
  public discoveries: Record<string, boolean> = {};

  public resourceRecipes: IGameRecipe[] = [];
  public itemRecipes: IGameRecipe[] = [];

  public workersPerRecipe: Record<string, number> = {};
  public canCraftRecipes: Record<string, boolean> = {};
  public ingredients: Record<string, Array<{ name: string; amount: number }>> = {};
  public itemIngredients: Record<string, Array<{ name: string; amount: number }>> = {};
  public itemOutputs: Record<string, IGameItem> = {};
  public resourceOutputs: Record<string, IGameResource> = {};
  public rarityOutputs: Record<string, string> = {};
  public outputIdToName: Record<string, string> = {};

  public summedResources: Record<string, number> = {};

  public visibleCancels: Record<number, boolean> = {};
  public visibleStars: Record<string, boolean> = {};
  public allStarredRecipes: Record<string, boolean> = {};

  private resourcesSub!: Subscription;
  private discoveriesSub!: Subscription;

  constructor(
    private store: Store,
    private contentService: ContentService,
    private itemCreatorService: ItemCreatorService
  ) {}

  ngOnInit() {
    this.allStarredRecipes = this.starredRecipes || {};

    this.setIngredients();
    this.setResults();
    this.setVisibleRecipes();
    this.setRefiningWorkerHash();
    this.setTotalResources();

    this.resourcesSub = this.resources$.subscribe((resources) => {
      this.resources = resources;

      this.setVisibleRecipes();
      this.setTotalResources();
    });

    this.discoveriesSub = this.discoveries$.subscribe((discoveries) => {
      this.discoveries = discoveries;

      this.setVisibleRecipes();
      this.setMetadata();
    });
  }

  ngOnChanges(changes: any) {
    if(changes.discoveries || changes.filterOptions) {
      this.setVisibleRecipes();
    }

    if(changes.refiningWorkers) {
      this.setRefiningWorkerHash();
    }

    if(changes.items) {
      this.setTotalResources();
    }
  }

  ngOnDestroy() {
    this.resourcesSub?.unsubscribe();
    this.discoveriesSub?.unsubscribe();
  }

  toggleFavorite(recipe: IGameRecipe, value: boolean) {
    this.store.dispatch(new this.favoriteAction(recipe));
    this.allStarredRecipes[recipe.result] = value;
    this.setVisibleRecipes();
  }

  validateAmount(recipeResult: string, $event: any) {
    if(isNaN($event.target.value) || !$event.target.value) {
      this.amounts[recipeResult] = 1;
    }
  }

  setType(type: 'items'|'resources') {
    this.type = type;
  }

  setMetadata() {
    const totalDiscovered = this.locationData.filter(x => this.discoveries[x.result]).length;
    const totalRecipes = this.locationData.length;

    this.totalsMetadata.emit({ totalDiscovered, totalRecipes });
  }

  setTotalResources() {
    this.summedResources = this.totalResourceHashForCrafting();
  }

  setVisibleRecipes() {

    this.resourceRecipes = this.visibleRecipes(this.locationData, 'resources');
    this.itemRecipes = this.visibleRecipes(this.locationData, 'items');

    if(!this.type) {
      this.setType(this.resourceRecipes.length > 0 ? 'resources' : 'items');
    }

    if(this.type === 'resources' && this.resourceRecipes.length === 0) {
      this.setType('items');
    }

    if(this.type === 'items' && this.itemRecipes.length === 0) {
      this.setType('resources');
    }

    this.setCanCrafts();
  }

  setIngredients() {
    this.ingredients = {};

    this.locationData.forEach((recipe) => {
      this.ingredients[recipe.result] = Object.keys(recipe.ingredients || {})
        .filter(x => this.contentService.isResource(x))
        .map((name) => ({ name, amount: recipe.ingredients[name] }));

      this.itemIngredients[recipe.result] = Object.keys(recipe.ingredients || {})
        .filter(x => this.contentService.isItem(x))
        .map((name) => ({ name, amount: recipe.ingredients[name] }));
    });
  }

  setCanCrafts() {
    this.canCraftRecipes = {};

    [...this.resourceRecipes, ...this.itemRecipes].forEach((recipe) => {
      this.canCraftRecipes[recipe.result] = this.canCraftRecipe(recipe, this.amounts[recipe.result] || 1);
      this.amounts[recipe.result] = this.amounts[recipe.result] || 1;
    });
  }

  setResults() {
    this.itemOutputs = {};
    this.resourceOutputs = {};
    this.rarityOutputs = {};

    this.locationData
      .filter((recipe: IGameRecipe) => this.contentService.isItem(recipe.result))
      .forEach((recipe: IGameRecipe) => {
        this.itemOutputs[recipe.result] = this.contentService.getItemByName(recipe.result) as IGameItem;
        this.rarityOutputs[recipe.result] = this.itemOutputs[recipe.result].rarity;
        this.outputIdToName[recipe.result] = this.itemOutputs[recipe.result].name;
      });

    this.locationData
      .filter((recipe: IGameRecipe) => this.contentService.isResource(recipe.result))
      .forEach((recipe: IGameRecipe) => {
        this.resourceOutputs[recipe.result] = this.contentService.getResourceByName(recipe.result) as IGameResource;
        this.rarityOutputs[recipe.result] = this.resourceOutputs[recipe.result].rarity;
        this.outputIdToName[recipe.result] = this.resourceOutputs[recipe.result].name;
      });
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

  public queueUpgradeRequirements(
    queueInfo: { queue: IGameRefiningRecipe[]; size: number } | null
  ): { coins: number; resources: Record<string, number> } | undefined {
    const upgradeInfo = this.contentService.queueUpgrades[this.tradeskill];
    if(!upgradeInfo || !queueInfo) {
      return undefined;
    }

    const upgradeRequirements = upgradeInfo[queueInfo.size - 1];
    if(!upgradeRequirements) {
      return undefined;
    }

    return upgradeRequirements;
  }

  canUpgradeQueue(queueInfo: { queue: IGameRefiningRecipe[]; size: number } | null): boolean {
    const upgradeInfo = this.contentService.queueUpgrades[this.tradeskill];
    if(!upgradeInfo || !queueInfo) {
      return false;
    }

    const upgradeRequirements = this.queueUpgradeRequirements(queueInfo);
    if(!upgradeRequirements) {
      return false;
    }

    const { coins, resources } = upgradeRequirements;
    if(coins > this.resources['Coin']) {
      return false;
    }

    return Object.keys(resources || {}).every(resourceName => this.resources[resourceName] >= resources[resourceName]);
  }

  upgradeQueue(queueInfo: { queue: IGameRefiningRecipe[]; size: number } | null) {
    const upgradeCost = this.queueUpgradeRequirements(queueInfo);
    if(!upgradeCost) {
      return;
    }

    const costInversion: Record<string, number> = {};
    costInversion['Coin'] = -upgradeCost.coins;

    Object.keys(upgradeCost.resources || {}).forEach(resourceName => {
      costInversion[resourceName] = -upgradeCost.resources[resourceName];
    });

    this.store.dispatch([
      new GainResources(costInversion),
      new this.upgradeQueueAction()
    ]);
  }

  trackBy<IGameRecipe>(index: number, recipe: IGameRecipe) {
    return index;
  }

  iconForRecipe(recipe: IGameRecipe) {
    return this.itemCreatorService.iconFor(recipe.result);
  }

  modifyAmount(recipe: IGameRecipe, amount: number) {
    this.amounts[recipe.result] = (this.amounts[recipe.result] || 1) + amount;

    this.setCanCrafts();
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
        if(this.allStarredRecipes[recipe.result]) {
          return true;
        }

        if(this.filterOptions.hideDiscovered && this.discoveries[recipe.result]) {
          return false;
        }

        if(this.filterOptions.hideDiscoveredTables && this.discoveries[recipe.result] && type === 'resources') {
          return this.contentService.getResourceByName(recipe.result).category !== ItemCategory.CraftingTables;
        }

        if(this.filterOptions.hideHasIngredients && this.canCraftRecipe(recipe)) {
          return false;
        }

        if(this.filterOptions.hideHasNoIngredients && !this.canCraftRecipe(recipe)) {
          return false;
        }

        return true;
      });

    return sortBy(validRecipes, [
      (recipe) => !this.allStarredRecipes[recipe.result],
      (recipe) => !this.canCraftRecipe(recipe),
      (recipe) => this.outputIdToName[recipe.result]
    ]);
  }

  totalResourceHashForCrafting() {
    const base = Object.assign({}, this.resources);
    this.items.forEach(item => {
      base[item.name] = (base[item.name] || 0) + 1;
    });

    return base;
  }

  canCraftRecipe(recipe: IGameRecipe, amount = 1): boolean {
    return canCraftRecipe(this.summedResources, recipe, amount);
  }

  craft(recipe: IGameRecipe, amount = 1) {
    if(isNaN(amount)) {
      amount = 1;
    }

    this.amounts[recipe.result] = 1;

    this.setCanCrafts();

    const itemsNeeded = Object.keys(recipe.ingredients)
      .filter(x => this.contentService.isItem(x))
      .filter(x => !recipe.preserve?.includes(x))
      .map(x => ({ name: x, itemAmount: recipe.ingredients[x] * amount }));

    let validItems = this.items.slice();

    const itemsTaken: IGameItem[] = [];
    itemsNeeded.forEach(({ name, itemAmount }) => {
      for(let i = 0; i < itemAmount; i++) {
        const itemIndex = validItems.findIndex(x => x.name === name);
        if(itemIndex === -1) {
          return;
        }

        const item = validItems[itemIndex];
        itemsTaken.push(item);
        validItems = validItems.filter(x => x !== item);
      }
    });

    this.store.dispatch(new this.startAction(recipe, amount, itemsTaken));
  }

  cancel(jobIndex: number) {
    this.store.dispatch(new this.cancelAction(jobIndex));
    this.visibleCancels[jobIndex] = false;
  }

  assignWorker(recipe: IGameRecipe) {
    this.store.dispatch(new AssignRefiningWorker(this.tradeskill as Tradeskill, recipe));
  }

  unassignWorker(recipe: IGameRecipe) {
    this.store.dispatch(new UnassignRefiningWorker(this.tradeskill as Tradeskill, recipe));
  }

  changeOption(option: keyof IGameRefiningOptions, value: boolean) {
    this.store.dispatch(new this.changeOptionAction(option, value));
  }

}
