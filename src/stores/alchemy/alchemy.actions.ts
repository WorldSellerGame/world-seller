import { IGameRecipe, IGameRefiningOptions } from '../../interfaces';

export class UnlockAlchemy {
  static type = '[Alchemy] Unlock';
}

export class StartAlchemyJob {
  static type = '[Alchemy] Start Job';
  constructor(public job: IGameRecipe, public quantity: number) {}
}

export class CancelAlchemyJob {
  static type = '[Alchemy] Cancel Job';
  constructor(public jobIndex: number, public shouldRefundResources = true) {}
}

export class ChangeAlchemyFilterOption {
  static type = '[Alchemy] Change Filter Option';
  constructor(public option: keyof IGameRefiningOptions, public value: boolean) {}
}
