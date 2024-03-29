import { IGameResourceTransform } from '../../interfaces';

export class UnlockFarming {
  static type = '[Farming] Unlock';
}

export class GainFarmingLevels {
  static type = '[Farming] Gain Levels';
  constructor(public levels = 1) {}
}

export class PlantSeedInFarm {
  static type = '[Farming] Plant Seed';
  constructor(public plotIndex: number, public job: IGameResourceTransform, public playSfx = true) {}
}

export class HarvestPlantFromFarm {
  static type = '[Farming] Harvest Plant';
  constructor(public plotIndex: number, public playSfx = true) {}
}

export class BuyNewPlot {
  static type = '[Farming] Buy New Plot';
}

export class UpgradeWorkerSpeed {
  static type = '[Farming] Upgrade Worker Speed';
}
