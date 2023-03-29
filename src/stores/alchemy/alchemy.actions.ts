import { IGameItem, IGameRecipe, IGameRefiningOptions } from '../../interfaces';

export class UnlockAlchemy {
  static type = '[Alchemy] Unlock';
}

export class GainAlchemyLevels {
  static type = '[Alchemy] Gain Levels';
  constructor(public levels = 1) {}
}

export class StartAlchemyJob {
  static type = '[Alchemy] Start Job';
  constructor(public job: IGameRecipe, public quantity: number, public items: IGameItem[] = []) {}
}

export class CancelAlchemyJob {
  static type = '[Alchemy] Cancel Job';
  constructor(public jobIndex: number, public shouldRefundResources = true) {}
}

export class ChangeAlchemyFilterOption {
  static type = '[Alchemy] Change Filter Option';
  constructor(public option: keyof IGameRefiningOptions, public value: boolean) {}
}

export class StarAlchemyRecipe {
  static type = '[Alchemy] Star Recipe';
  constructor(public recipe: IGameRecipe) {}
}
