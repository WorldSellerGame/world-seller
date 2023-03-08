import { IGameRecipe } from '../../interfaces';

export class UnlockCooking {
  static type = '[Cooking] Unlock';
}

export class StartCookingJob {
  static type = '[Cooking] Start Job';
  constructor(public job: IGameRecipe, public quantity: number) {}
}

export class CancelCookingJob {
  static type = '[Cooking] Cancel Job';
  constructor(public jobIndex: number, public shouldRefundResources = true) {}
}
