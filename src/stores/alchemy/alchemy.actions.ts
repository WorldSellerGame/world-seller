import { IGameRecipe } from '../../interfaces';

export class StartAlchemyJob {
  static type = '[Alchemy] Start Job';
  constructor(public job: IGameRecipe, public quantity: number) {}
}

export class CancelAlchemyJob {
  static type = '[Alchemy] Cancel Job';
  constructor(public jobIndex: number, public shouldRefundResources = true) {}
}
