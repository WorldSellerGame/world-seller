import { IGameItem, IGameRecipe, IGameRefiningOptions } from '../../interfaces';

export class UnlockJewelcrafting {
  static type = '[Jewelcrafting] Unlock';
}

export class GainJewelcraftingLevels {
  static type = '[Jewelcrafting] Gain Levels';
  constructor(public levels = 1) {}
}

export class StartJewelcraftingJob {
  static type = '[Jewelcrafting] Start Job';
  constructor(public job: IGameRecipe, public quantity: number, public items: IGameItem[] = []) {}
}

export class CancelJewelcraftingJob {
  static type = '[Jewelcrafting] Cancel Job';
  constructor(public jobIndex: number, public shouldRefundResources = true) {}
}

export class ChangeJewelcraftingFilterOption {
  static type = '[Jewelcrafting] Change Filter Option';
  constructor(public option: keyof IGameRefiningOptions, public value: boolean) {}
}
