import { IGameResourceTransform } from '../../interfaces';

export class PlantSeedInFarm {
  static type = '[Farming] Plant Seed';
  constructor(public plotIndex: number, public job: IGameResourceTransform) {}
}

export class HarvestPlantFromFarm {
  static type = '[Farming] Harvest Plant';
  constructor(public plotIndex: number) {}
}
