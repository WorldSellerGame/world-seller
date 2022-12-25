import { IGameRecipe } from '../../interfaces';

export class StartJewelcraftingJob {
  static type = '[Jewelcrafting] Start Job';
  constructor(public job: IGameRecipe, public quantity: number) {}
}

export class CancelJewelcraftingJob {
  static type = '[Jewelcrafting] Cancel Job';
  constructor(public jobIndex: number, public shouldRefundResources = true) {}
}
