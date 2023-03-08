import { IGameRecipe, IGameRefiningOptions } from '../../interfaces';

export class UnlockJewelcrafting {
  static type = '[Jewelcrafting] Unlock';
}

export class StartJewelcraftingJob {
  static type = '[Jewelcrafting] Start Job';
  constructor(public job: IGameRecipe, public quantity: number) {}
}

export class CancelJewelcraftingJob {
  static type = '[Jewelcrafting] Cancel Job';
  constructor(public jobIndex: number, public shouldRefundResources = true) {}
}

export class ChangeJewelcraftingFilterOption {
  static type = '[Jewelcrafting] Change Filter Option';
  constructor(public option: keyof IGameRefiningOptions, public value: boolean) {}
}
