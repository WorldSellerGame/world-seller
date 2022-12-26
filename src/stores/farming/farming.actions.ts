import { IGameFarmingSeedTransform } from '../../interfaces';

export class PlantSeedInFarm {
  static type = '[Farming] Plant Seed';
  constructor(public plotIndex: number, public job: IGameFarmingSeedTransform) {}
}

export class HarvestPlantFromFarm {
  static type = '[Farming] Harvest Plant';
  constructor(public plotIndex: number) {}
}
