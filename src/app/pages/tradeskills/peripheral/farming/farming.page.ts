import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, first } from 'rxjs';
import { IGameFarmingPlot, IGameResourceTransform, IGameWorkerFarming } from '../../../../../interfaces';
import { CharSelectState, FarmingState, WorkersState } from '../../../../../stores';
import { BuyNewPlot, HarvestPlantFromFarm, PlantSeedInFarm, UpgradeWorkerSpeed } from '../../../../../stores/farming/farming.actions';
import {
  maxFarmingWorkers, maxPlots, maxWorkerSpeedLevel,
  nextPlotCost, workerSpeedUpgradeCost
} from '../../../../../stores/farming/farming.functions';
import { AssignFarmingWorker, UnassignFarmingWorker } from '../../../../../stores/workers/workers.actions';
import { setDiscordStatus } from '../../../../helpers/electron';
import { ContentService } from '../../../../services/content.service';
import { NotifyService } from '../../../../services/notify.service';

@Component({
  selector: 'app-farming',
  templateUrl: './farming.page.html',
  styleUrls: ['./farming.page.scss'],
})
export class FarmingPage implements OnInit {

  public readonly locationData = this.contentService.getFarmingTransforms();

  public currentPlantIndex = -1;
  public plantableSeeds: Array<{ name: string; quantity: number; canGiveLevel: boolean }> = [];

  @Select(FarmingState.level) level$!: Observable<number>;
  @Select(FarmingState.plotInfo) plotInfo$!: Observable<{ plots: IGameFarmingPlot[]; maxPlots: number }>;
  @Select(FarmingState.upgrades) upgrades$!: Observable<{ workerUpgradeLevel: number }>;
  @Select(CharSelectState.activeCharacterCoins) coins$!: Observable<number>;
  @Select(WorkersState.farmingWorkers) farmingWorkers$!: Observable<{
    workerAllocations: IGameWorkerFarming[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(
    private store: Store,
    private notifyService: NotifyService,
    private contentService: ContentService
  ) { }

  ngOnInit() {
    this.level$.pipe(first()).subscribe(level => {
      const state = `Farming Lv.${level}, browsing...`;

      setDiscordStatus({
        state
      });
    });
  }

  public trackBy(index: number) {
    return index;
  }

  public plotList(maxPlotCount: number, allPlots: IGameFarmingPlot[]) {
    return Array(maxPlotCount).fill(null).map((x, i) => allPlots[i] || { seed: undefined });
  }

  public minLevelForSeed(seedName: string): number {
    return this.locationData.find((x: IGameResourceTransform) => x.startingItem === seedName)?.level.min ?? 0;
  }

  public maxLevelForSeed(seedName: string): number {
    return this.locationData.find((x: IGameResourceTransform) => x.startingItem === seedName)?.level.max ?? 0;
  }

  public setupPlanting(plotIndex: number, currentLevel: number) {
    this.currentPlantIndex = plotIndex;

    const resources = this.store.selectSnapshot(CharSelectState.activeCharacterResources);
    const locationValidItems = this.locationData.map(x => x.startingItem);

    this.plantableSeeds = Object.keys(resources)
      .filter(res => locationValidItems.includes(res))
      .filter(res => resources[res] > 0)
      .filter(res => this.minLevelForSeed(res) <= currentLevel)
      .map(res => ({
        name: res,
        quantity: resources[res],
        canGiveLevel: this.maxLevelForSeed(res) > currentLevel
      }));
  }

  public plant(plotIndex: number, seed: string) {
    this.currentPlantIndex = -1;

    const transform = this.getSeedTransform(seed);
    if(!transform) {
      this.notifyService.error('Seed does not have a plantable form.');
      return;
    }

    this.store.dispatch(new PlantSeedInFarm(plotIndex, transform));
  }

  public harvest(plotIndex: number) {
    this.store.dispatch(new HarvestPlantFromFarm(plotIndex));
  }

  public unplant() {
    this.currentPlantIndex = -1;
  }

  maxPlots() {
    return maxPlots();
  }

  nextPlotCost(currentPlots: number) {
    return nextPlotCost(currentPlots);
  }

  public buyNewPlot() {
    this.store.dispatch(new BuyNewPlot());
  }

  public getResource(seed: string) {
    return this.contentService.getResourceByName(seed);
  }

  public getIcon(seed: string) {
    return this.getResource(seed).icon;
  }

  private getSeedTransform(seed: string): IGameResourceTransform | undefined {
    return this.locationData.find((t: IGameResourceTransform) => t.startingItem === seed);
  }

  maxWorkers() {
    return maxFarmingWorkers();
  }

  allocateWorker() {
    this.store.dispatch(new AssignFarmingWorker());
  }

  unallocateWorker() {
    this.store.dispatch(new UnassignFarmingWorker());
  }

  // worker speed functions
  canUpgradeWorkerSpeed(currentCoins: number, currentLevel: number): boolean {
    if(this.isWorkerSpeedMaxLevel(currentLevel)) {
      return false;
    }

    return currentCoins >= this.workerSpeedUpgradeCost(currentLevel);
  }

  isWorkerSpeedMaxLevel(currentLevel: number): boolean {
    return currentLevel >= maxWorkerSpeedLevel();
  }

  workerSpeedUpgradeCost(currentLevel: number) {
    return workerSpeedUpgradeCost(currentLevel);
  }

  upgradeWorkerSpeed() {
    this.store.dispatch(new UpgradeWorkerSpeed());
  }

}
