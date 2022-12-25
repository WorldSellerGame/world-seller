import { IGameRecipe } from '../../interfaces';

export class StartWeavingJob {
  static type = '[Weaving] Start Job';
  constructor(public job: IGameRecipe, public quantity: number) {}
}

export class CancelWeavingJob {
  static type = '[Weaving] Cancel Job';
  constructor(public jobIndex: number, public shouldRefundResources = true) {}
}
