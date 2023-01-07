import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameFarmingPlot, IGameResourceTransform } from '../../../../../interfaces';
import { CharSelectState, FarmingState } from '../../../../../stores';
import { HarvestPlantFromFarm, PlantSeedInFarm } from '../../../../../stores/farming/farming.actions';
import { ContentService } from '../../../../services/content.service';
import { ItemCreatorService } from '../../../../services/item-creator.service';
import { NotifyService } from '../../../../services/notify.service';

@Component({
  selector: 'app-farming',
  templateUrl: './farming.page.html',
  styleUrls: ['./farming.page.scss'],
})
export class FarmingPage implements OnInit {

  public get locationData() {
    return this.contentService.farming;
  }

  public currentPlantIndex = -1;
  public plantableSeeds: Array<{ name: string; quantity: number }> = [];

  @Select(FarmingState.level) level$!: Observable<number>;
  @Select(FarmingState.plotInfo) plotInfo$!: Observable<{ plots: IGameFarmingPlot[]; maxPlots: number }>;

  constructor(
    private store: Store,
    private itemCreatorService: ItemCreatorService,
    private notifyService: NotifyService,
    private contentService: ContentService
  ) { }

  ngOnInit() {
  }

  public trackBy(index: number) {
    return index;
  }

  public plotList(maxPlots: number, allPlots: IGameFarmingPlot[]) {
    return Array(maxPlots).fill(null).map((x, i) => allPlots[i] || { seed: undefined });
  }

  public setupPlanting(plotIndex: number) {
    this.currentPlantIndex = plotIndex;

    const resources = this.store.selectSnapshot(CharSelectState.activeCharacterResources);
    this.plantableSeeds = Object.keys(resources)
      .filter(res => this.itemCreatorService.resourceMatchesType(res, 'Seeds'))
      .filter(res => resources[res] > 0)
      .map(res => ({ name: res, quantity: resources[res] }));
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

  private getSeedTransform(seed: string): IGameResourceTransform {
    return this.locationData.transforms.find((t: IGameResourceTransform) => t.startingItem === seed);
  }

}
