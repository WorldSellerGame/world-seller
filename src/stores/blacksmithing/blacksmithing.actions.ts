import { IGameItem, IGameRecipe, IGameRefiningOptions } from '../../interfaces';

export class UnlockBlacksmithing {
  static type = '[Blacksmithing] Unlock';
}

export class GainBlacksmithingLevels {
  static type = '[Blacksmithing] Gain Levels';
  constructor(public levels = 1) {}
}

export class StartBlacksmithingJob {
  static type = '[Blacksmithing] Start Job';
  constructor(public job: IGameRecipe, public quantity: number, public items: IGameItem[] = []) {}
}

export class CancelBlacksmithingJob {
  static type = '[Blacksmithing] Cancel Job';
  constructor(public jobIndex: number, public shouldRefundResources = true) {}
}

export class ChangeBlacksmithingFilterOption {
  static type = '[Blacksmithing] Change Filter Option';
  constructor(public option: keyof IGameRefiningOptions, public value: boolean) {}
}

export class StarBlacksmithingRecipe {
  static type = '[Blacksmithing] Star Recipe';
  constructor(public recipe: IGameRecipe) {}
}
