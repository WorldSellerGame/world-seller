import { IGameRecipe, IGameRefiningOptions } from '../../interfaces';

export class UnlockWeaving {
  static type = '[Weaving] Unlock';
}

export class StartWeavingJob {
  static type = '[Weaving] Start Job';
  constructor(public job: IGameRecipe, public quantity: number) {}
}

export class CancelWeavingJob {
  static type = '[Weaving] Cancel Job';
  constructor(public jobIndex: number, public shouldRefundResources = true) {}
}

export class ChangeWeavingFilterOption {
  static type = '[Weaving] Change Filter Option';
  constructor(public option: keyof IGameRefiningOptions, public value: boolean) {}
}
