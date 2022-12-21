import { IGameMiningLocation } from '../../interfaces';

export class SetMiningLocation {
  static type = '[Mining] Set Mining Location';
  constructor(public location: IGameMiningLocation) {}
}

export class CancelMining {
  static type = '[Mining] Cancel Mining';
  constructor() {}
}
