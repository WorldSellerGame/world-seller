import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameWorkerFarming, IGameWorkersGathering, IGameWorkersMercantle, IGameWorkersRefining } from '../../../../../../interfaces';
import { CharSelectState, WorkersState } from '../../../../../../stores';
import { AnalyticsTrack } from '../../../../../../stores/game/game.actions';
import {
  BuyWorker, UnassignFarmingWorker, UnassignGatheringWorker,
  UnassignMercantileWorker, UnassignRefiningWorker
} from '../../../../../../stores/workers/workers.actions';
import { nextWorkerCost, upkeepCost } from '../../../../../../stores/workers/workers.functions';
import { ContentService } from '../../../../../services/content.service';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.page.html',
  styleUrls: ['./workers.page.scss'],
})
export class WorkersPage implements OnInit {

  @Select(CharSelectState.activeCharacterCoins) coins$!: Observable<number>;
  @Select(WorkersState.workersAndAllocated) workersAndAllocated$!: Observable<{ current: number; max: number }>;
  @Select(WorkersState.maxWorkers) maxWorkers$!: Observable<number>;
  @Select(WorkersState.upkeep) upkeep$!: Observable<{ paid: number; ticks: number }>;
  @Select(WorkersState.workerAllocations) workerAllocations$!: Observable<{
    gathering: IGameWorkersGathering[];
    refining: IGameWorkersRefining[];
    mercantile: IGameWorkersMercantle[];
    farming: IGameWorkerFarming[];
  }>;

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
  }

  trackBy(index: number) {
    return index;
  }

  nextWorkerCost(currentWorkers: number) {
    return nextWorkerCost(currentWorkers);
  }

  canBuyWorker(coins: number, currentWorkers: number) {
    return coins >= this.nextWorkerCost(currentWorkers);
  }

  totalUpkeepCost(numWorkers: number) {
    return upkeepCost(numWorkers);
  }

  buyWorker() {
    this.store.dispatch(new BuyWorker());
  }

  workerName(id: number) {
    return this.contentService.getCharacterNameFromSeed(id);
  }

  unallocateAll(allocations: {
    gathering: IGameWorkersGathering[];
    refining: IGameWorkersRefining[];
    mercantile: IGameWorkersMercantle[];
    farming: IGameWorkerFarming[];
  }) {
    allocations.gathering.forEach(worker => this.unallocateGatheringWorker(worker));
    allocations.refining.forEach(worker => this.unallocateRefiningWorker(worker));
    allocations.farming.forEach(() => this.unallocateFarmingWorker());
    allocations.mercantile.forEach(() => this.unallocateMercantileWorker());
  }

  unallocateGatheringWorker(worker: IGameWorkersGathering) {
    this.store.dispatch([
      new AnalyticsTrack(`Gathering:${worker.tradeskill}:RemoveWorker:${worker.location.name}`, 1),
      new UnassignGatheringWorker(worker.tradeskill, worker.location)
    ]);
  }

  unallocateRefiningWorker(worker: IGameWorkersRefining) {
    this.store.dispatch([
      new AnalyticsTrack(`Refining:${worker.tradeskill}:RemoveWorker:${worker.recipe.result}`, 1),
      new UnassignRefiningWorker(worker.tradeskill, worker.recipe)
    ]);
  }

  unallocateFarmingWorker() {
    this.store.dispatch(new UnassignFarmingWorker());
  }

  unallocateMercantileWorker() {
    this.store.dispatch(new UnassignMercantileWorker());
  }

}
