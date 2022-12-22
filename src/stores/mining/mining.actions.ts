import { IGameGatherLocation } from '../../interfaces';

export class SetMiningLocation {
  static type = '[Mining] Set Mining Location';
  constructor(public location: IGameGatherLocation) {}
}

export class CancelMining {
  static type = '[Mining] Cancel Mining';
  constructor() {}
}
