import { IGameRecipe } from '../../interfaces';

export class StartBlacksmithingJob {
  static type = '[Blacksmithing] Start Job';
  constructor(public job: IGameRecipe, public quantity: number) {}
}

export class CancelBlacksmithingJob {
  static type = '[Blacksmithing] Cancel Job';
  constructor(public jobIndex: number, public shouldRefundResources = true) {}
}
