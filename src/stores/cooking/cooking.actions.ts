import { IGameRecipe, IGameRefiningOptions } from '../../interfaces';

export class UnlockCooking {
  static type = '[Cooking] Unlock';
}

export class GainCookingLevels {
  static type = '[Cooking] Gain Levels';
  constructor(public levels = 1) {}
}

export class StartCookingJob {
  static type = '[Cooking] Start Job';
  constructor(public job: IGameRecipe, public quantity: number) {}
}

export class CancelCookingJob {
  static type = '[Cooking] Cancel Job';
  constructor(public jobIndex: number, public shouldRefundResources = true) {}
}

export class ChangeCookingFilterOption {
  static type = '[Cooking] Change Filter Option';
  constructor(public option: keyof IGameRefiningOptions, public value: boolean) {}
}

